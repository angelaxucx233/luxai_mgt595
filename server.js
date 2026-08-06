/**
 * server.js — LuxAI production server for Render (or any Node host).
 *
 * Does exactly two things:
 *   1. Serves the built app from dist/
 *   2. Proxies POST /api/lux → api.anthropic.com, attaching the secret API key
 *      from the ANTHROPIC_API_KEY environment variable (set in Render's dashboard —
 *      it never reaches the browser).
 *
 * Guardrails (so a shared link can't run up your bill):
 *   - Only whitelisted models are forwarded
 *   - max_tokens is capped at 1024
 *   - Per-IP rate limit: 20 requests/minute
 *
 * Run locally to test the production build:  ANTHROPIC_API_KEY=sk-... npm start
 */
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json({ limit: '1mb' }));

const ALLOWED_MODELS = new Set(['claude-sonnet-4-6', 'claude-haiku-4-5-20251001']);
const hits = new Map(); // ip → [timestamps]

app.post('/api/lux', async (req, res) => {
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: { message: 'Server missing ANTHROPIC_API_KEY' } });
  }

  // rate limit: 20/min per IP
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress;
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  if (recent.length >= 20) {
    return res.status(429).json({ error: { message: 'Rate limit: please wait a minute.' } });
  }
  recent.push(now);
  hits.set(ip, recent);

  // clamp what the browser may request
  const body = req.body || {};
  if (!ALLOWED_MODELS.has(body.model)) body.model = 'claude-sonnet-4-6';
  body.max_tokens = Math.min(body.max_tokens || 1024, 1024);

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });
    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (err) {
    res.status(502).json({ error: { message: `Proxy error: ${err.message}` } });
  }
});

// static app + SPA fallback (BrowserRouter routes like /lecture/06 must serve index.html)
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`LuxAI serving on :${port}`));
