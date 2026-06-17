import { GoogleGenerativeAI } from '@google/generative-ai';
import { parseSandboxFromResponse } from '../utils/sandboxParser.js';
import { env } from '../config/env.js';
import { PROBLEM_TEMPLATE_IDS } from '../data/problemTemplates.js';

const TUTOR_SYSTEM_INSTRUCTION = `You are Lux, the friendly lightbulb AI tutor inside the LuxAI app (Brilliant-style probability lessons for MGT 403). Speak in a warm, concise voice as Lux. Guide with Socratic hints — do not give final answers immediately unless the student is stuck after 2+ attempts.

You can SEE the student's live work in [Student work on screen] — their typed values, which field is active, whether they submitted, and if correct.

You CANNOT invent new problem UIs. To give more practice, call the tool regenerate_practice_problem with an allowed templateId and new numeric params only.

Allowed templateIds: ${PROBLEM_TEMPLATE_IDS.join(', ')}. Use regenerate only for templates that define randomizeParams (coin_outcomes, probability_fraction, never_fail_table, urn_conditional).

When the student solves correctly or asks for more practice, offer another example warmly ("Want to try another with different numbers?") and use the tool if they say yes.

Never repeat the internal slide context or student work JSON to the student.

Custom 3D visualizations (rare): use <<<SANDBOX_HTML>>> ... <<<END_SANDBOX_HTML>>>.`;

const MODEL_ALIASES = {
  'gemini-3-flash': 'gemini-3-flash-preview',
};

const PRACTICE_TOOL = {
  functionDeclarations: [
    {
      name: 'regenerate_practice_problem',
      description:
        'Reload the current problem template with new numeric parameters for extra practice.',
      parameters: {
        type: 'OBJECT',
        properties: {
          templateId: {
            type: 'STRING',
            description: `One of: ${PROBLEM_TEMPLATE_IDS.join(', ')}`,
          },
          params: {
            type: 'OBJECT',
            description: 'Numeric template fields only (e.g. rightSide, coinCount, blueBalls, redBalls)',
          },
        },
        required: ['templateId', 'params'],
      },
    },
  ],
};

function resolveModelId(modelId) {
  return MODEL_ALIASES[modelId] ?? modelId;
}

function buildModelChain() {
  const primary = resolveModelId(env.geminiModel);
  return [...new Set([primary, 'gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'])];
}

function toGeminiHistory(messages) {
  const mapped = messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .slice(-12)
    .map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

  let start = 0;
  while (start < mapped.length && mapped[start].role !== 'user') start += 1;

  const normalized = [];
  for (const entry of mapped.slice(start)) {
    if (normalized.length === 0) {
      if (entry.role === 'user') normalized.push(entry);
      continue;
    }
    const last = normalized[normalized.length - 1];
    if (last.role === entry.role) {
      normalized[normalized.length - 1] = entry;
    } else {
      normalized.push(entry);
    }
  }

  if (normalized.length > 0 && normalized[normalized.length - 1].role === 'user') {
    normalized.pop();
  }

  return normalized;
}

function extractPracticeCall(response) {
  const calls = response.functionCalls?.() ?? [];
  const match = calls.find((c) => c.name === 'regenerate_practice_problem');
  if (!match) return null;
  const args = match.args ?? {};
  return {
    templateId: args.templateId,
    params: args.params ?? {},
  };
}

async function generateWithModel(model, userMessage) {
  const result = await model.generateContent(userMessage);
  return result.response;
}

async function chatWithModel(model, userMessage, priorMessages) {
  const history = toGeminiHistory(priorMessages);
  if (history.length === 0) {
    return generateWithModel(model, userMessage);
  }
  const chat = model.startChat({ history });
  const result = await chat.sendMessage(userMessage);
  return result.response;
}

function buildSystemInstruction(slideSystemContext, studentWorkContext) {
  return `${TUTOR_SYSTEM_INSTRUCTION}

[Internal slide context]
${slideSystemContext}

[Student work on screen]
${studentWorkContext}`;
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
  if (!env.geminiApiKey) {
    throw new Error(
      'Gemini API key missing. Set VITE_GEMINI_API_KEY in .env and restart the dev server.'
    );
  }

  const fullPrompt = `[Student message]\n${userMessage}`;
  let lastError = null;

  for (const modelId of buildModelChain()) {
    try {
      const genAI = new GoogleGenerativeAI(env.geminiApiKey);
      const namedModel = genAI.getGenerativeModel({
        model: modelId,
        systemInstruction: buildSystemInstruction(slideSystemContext, studentWorkContext),
        tools: [PRACTICE_TOOL],
      });

      const response = await chatWithModel(namedModel, fullPrompt, history);
      const practiceRegeneration = extractPracticeCall(response);
      let rawText = '';

      try {
        rawText = response.text?.() ?? '';
      } catch {
        rawText = '';
      }

      const { cleanText, sandboxHtml } = parseSandboxFromResponse(rawText);

      let reply =
        cleanText ||
        (practiceRegeneration
          ? 'Here is another practice problem with fresh numbers — give it a try!'
          : '');

      return {
        reply,
        sandboxHtml,
        practiceRegeneration,
        modelUsed: modelId,
      };
    } catch (err) {
      lastError = err;
      const msg = err?.message ?? String(err);
      const notFound =
        msg.includes('404') ||
        msg.includes('not found') ||
        msg.includes('NOT_FOUND') ||
        msg.includes('is not supported');
      if (!notFound) break;
    }
  }

  throw new Error(lastError?.message ?? 'Gemini request failed.');
}

export function isGeminiConfigured() {
  return Boolean(env.geminiApiKey);
}

export function getOfflineTutorReply(userMessage, slideTitle, wantsPractice = false) {
  const lower = userMessage.toLowerCase();

  if (
    wantsPractice ||
    lower.includes('another') ||
    lower.includes('more practice') ||
    lower.includes('new numbers')
  ) {
    return {
      reply: "Here's another problem with new numbers — you've got this! (Connect VITE_GEMINI_API_KEY to chat with Lux.)",
      sandboxHtml: null,
      practiceRegeneration: null,
      useLocalRandomize: true,
    };
  }

  return {
    reply: "What part feels unclear? Tell me what you entered — I'm Lux, and I can see your work on screen.",
    sandboxHtml: null,
    practiceRegeneration: null,
    useLocalRandomize: false,
  };
}
