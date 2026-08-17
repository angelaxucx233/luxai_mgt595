/**
 * anthropicService.js — drop-in replacement for geminiService.js, powered by Claude.
 *
 * Keeps the EXACT same exported interface as geminiService.js:
 *   sendTutorMessage(userMessage, slideSystemContext, studentWorkContext, history)
 *     -> { reply, sandboxHtml, practiceRegeneration, modelUsed }
 *   isTutorConfigured()  (also exported as isGeminiConfigured for zero-diff swaps)
 *   getOfflineTutorReply(userMessage, slideTitle, wantsPractice)
 *
 * HOW LUX TALKS TO CLAUDE (two modes, picked automatically):
 *   - npm run dev (local): calls api.anthropic.com directly from the browser using
 *     VITE_ANTHROPIC_API_KEY from your .env — unchanged from before. Fine on your
 *     own machine; set a spend limit on the key at console.anthropic.com regardless.
 *   - production build (Render): calls our own /api/lux endpoint on the same host.
 *     server.js attaches the secret ANTHROPIC_API_KEY there, so the key is NEVER
 *     in the browser bundle and never visible to visitors.
 */

import { parseSandboxFromResponse } from '../utils/sandboxParser.js';
import { env } from '../config/env.js';
import { PROBLEM_TEMPLATE_IDS } from '../data/problemTemplates.js';

/** Production builds talk to our own proxy; dev talks to Anthropic directly. */
const USE_PROXY = import.meta.env.PROD;
const ANTHROPIC_URL = USE_PROXY ? '/api/lux' : 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';

const TUTOR_SYSTEM_INSTRUCTION = `You are Lux, the friendly lightbulb AI tutor inside the LuxAI app (Brilliant-style interactive lessons for MGT 595 Quantitative Investing at Yale SOM). Speak in a warm, concise voice as Lux. Guide with Socratic hints — do not give final answers immediately unless the student is stuck after 2+ attempts.

You can SEE the student's live work in [Student work on screen] — their typed values, which field is active, whether they submitted, and if correct.

You CANNOT invent new problem UIs. To give more practice, call the tool regenerate_practice_problem with an allowed templateId and new numeric params only.

Allowed templateIds: ${PROBLEM_TEMPLATE_IDS.join(', ')}. Use regenerate only for templates that define randomizeParams.

When the student solves correctly or asks for more practice, offer another example warmly ("Want to try another with different numbers?") and use the tool if they say yes.

Never repeat the internal slide context or student work JSON to the student.

Write every mathematical expression as LaTeX inside single dollar signs, e.g. $\\sigma_p^2$, $E[r_i] = r_f + \\beta_i(E[R_M] - r_f)$, $W'VW$. Inline math only — single $ pairs, never $$ blocks. Use \\text{...} for words inside a formula. Dollar amounts stay plain text ($50, $110) — never wrap money in math.

Formatting: you may use **bold** and *italic*; avoid all other Markdown (headings, tables, numbered syntax, code blocks render as plain text). Use short paragraphs separated by blank lines, and simple dashes for lists.

Custom 3D visualizations (rare): use <<<SANDBOX_HTML>>> ... <<<END_SANDBOX_HTML>>>.`;

/** Tool definition in Anthropic's input_schema format. */
const PRACTICE_TOOL = {
  name: 'regenerate_practice_problem',
  description:
    'Reload the current problem template with new numeric parameters for extra practice.',
  input_schema: {
    type: 'object',
    properties: {
      templateId: {
        type: 'string',
        description: `One of: ${PROBLEM_TEMPLATE_IDS.join(', ')}`,
      },
      params: {
        type: 'object',
        description:
          'Numeric template fields only (e.g. rightSide, coinCount, blueBalls, redBalls)',
      },
    },
    required: ['templateId', 'params'],
  },
};

/** Primary model from env, then safe fallbacks. */
function buildModelChain() {
  const primary = env.anthropicModel || 'claude-sonnet-4-6';
  return [...new Set([primary, 'claude-sonnet-4-6', 'claude-haiku-4-5-20251001'])];
}

/**
 * Convert app history ({role:'user'|'assistant', text}) to Anthropic messages.
 * Anthropic requires: first message is user, roles strictly alternate.
 * Mirrors the normalization the Gemini service performed.
 */
function toAnthropicHistory(messages) {
  const mapped = (messages || [])
    .filter((m) => (m.role === 'user' || m.role === 'assistant') && m.text)
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.text }));

  // drop leading assistant turns
  let start = 0;
  while (start < mapped.length && mapped[start].role !== 'user') start += 1;

  // collapse consecutive same-role turns (keep the latest)
  const normalized = [];
  for (const entry of mapped.slice(start)) {
    const last = normalized[normalized.length - 1];
    if (last && last.role === entry.role) {
      normalized[normalized.length - 1] = entry;
    } else {
      normalized.push(entry);
    }
  }

  // the current user message is appended separately — don't end history on user
  if (normalized.length > 0 && normalized[normalized.length - 1].role === 'user') {
    normalized.pop();
  }

  return normalized;
}

function buildSystemPrompt(slideSystemContext, studentWorkContext) {
  return `${TUTOR_SYSTEM_INSTRUCTION}

[Internal slide context]
${slideSystemContext ?? '(none)'}

[Student work on screen]
${studentWorkContext ?? '(none)'}`;
}

function extractFromContent(contentBlocks) {
  let text = '';
  let practiceRegeneration = null;
  for (const block of contentBlocks ?? []) {
    if (block.type === 'text') text += block.text;
    if (block.type === 'tool_use' && block.name === 'regenerate_practice_problem') {
      const args = block.input ?? {};
      practiceRegeneration = { templateId: args.templateId, params: args.params ?? {} };
    }
  }
  return { text, practiceRegeneration };
}

async function callClaude(modelId, systemPrompt, messages) {
  const headers = { 'content-type': 'application/json' };
  if (!USE_PROXY) {
    // dev only: key comes from .env and the request goes straight to Anthropic
    headers['x-api-key'] = env.anthropicApiKey;
    headers['anthropic-version'] = ANTHROPIC_VERSION;
    headers['anthropic-dangerous-direct-browser-access'] = 'true';
  }

  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: modelId,
      max_tokens: 1024,
      system: systemPrompt,
      tools: [PRACTICE_TOOL],
      messages,
    }),
  });

  if (!res.ok) {
    let detail = '';
    try {
      const errBody = await res.json();
      detail = errBody?.error?.message ?? '';
    } catch {
      /* ignore parse failure */
    }
    const err = new Error(`Anthropic ${res.status}: ${detail || res.statusText}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

/**
 * @returns {Promise<{ reply: string, sandboxHtml: string | null, practiceRegeneration: object | null, modelUsed: string }>}
 */
export async function sendTutorMessage(
  userMessage,
  slideSystemContext,
  studentWorkContext,
  history = []
) {
  if (!USE_PROXY && !env.anthropicApiKey) {
    throw new Error(
      'Anthropic API key missing. Set VITE_ANTHROPIC_API_KEY in .env and restart the dev server.'
    );
  }

  const systemPrompt = buildSystemPrompt(slideSystemContext, studentWorkContext);
  const messages = [
    ...toAnthropicHistory(history),
    { role: 'user', content: `[Student message]\n${userMessage}` },
  ];

  let lastError = null;

  for (const modelId of buildModelChain()) {
    try {
      const data = await callClaude(modelId, systemPrompt, messages);
      const { text, practiceRegeneration } = extractFromContent(data.content);
      const { cleanText, sandboxHtml } = parseSandboxFromResponse(text);

      const reply =
        cleanText ||
        (practiceRegeneration
          ? 'Here is another practice problem with fresh numbers — give it a try!'
          : '');

      return { reply, sandboxHtml, practiceRegeneration, modelUsed: modelId };
    } catch (err) {
      lastError = err;
      // Fall through to the next model only on model-not-found; otherwise surface it.
      const retriable = err?.status === 404 || /not_found|model/i.test(err?.message ?? '');
      if (!retriable) break;
    }
  }

  throw new Error(lastError?.message ?? 'Anthropic request failed.');
}

export function isTutorConfigured() {
  // In production the proxy holds the key, so Lux is always "configured".
  return USE_PROXY || Boolean(env.anthropicApiKey);
}

/** Alias so existing imports (`isGeminiConfigured`) keep working with a 1-line path change. */
export const isGeminiConfigured = isTutorConfigured;

export function getOfflineTutorReply(userMessage, slideTitle, wantsPractice = false) {
  const lower = userMessage.toLowerCase();

  if (
    wantsPractice ||
    lower.includes('another') ||
    lower.includes('more practice') ||
    lower.includes('new numbers')
  ) {
    return {
      reply:
        "Here's another problem with new numbers — you've got this! (Connect VITE_ANTHROPIC_API_KEY to chat with Lux.)",
      sandboxHtml: null,
      practiceRegeneration: null,
      useLocalRandomize: true,
    };
  }

  return {
    reply:
      "What part feels unclear? Tell me what you entered — I'm Lux, and I can see your work on screen.",
    sandboxHtml: null,
    practiceRegeneration: null,
    useLocalRandomize: false,
  };
}
