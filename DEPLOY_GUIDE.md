# LuxAI — Deploying to Render

This puts your course on a real URL (like `https://luxai-mgt595.onrender.com`) that anyone can open. Total time: about 10 minutes, mostly clicking.

## How it works (30 seconds of theory)

Locally, the browser calls the Anthropic API directly using the key from your `.env`. That's fine on your machine, but a public site must never contain the key. So in production the app calls **its own** endpoint, `/api/lux`, and a tiny server (`server.js`) attaches the key — which lives only in Render's settings — before forwarding to Anthropic. Visitors never see it.

Nothing changes about local development: `npm run dev` works exactly as before.

## Before you start

- [ ] The installer ran green (it smoke-tests the server on your machine)
- [ ] Your fork is pushed to GitHub: `git add -A && git commit -m "Add Render deployment" && git push`
- [ ] You have your Anthropic API key handy (console.anthropic.com → API keys). **Recommended: create a fresh key named `luxai-render` so you can revoke it independently.**

## Set a spend limit first (2 minutes, do not skip)

1. Go to **console.anthropic.com → Settings → Limits**
2. Set a monthly spend limit you're comfortable with (e.g. $5–10). Lux chats cost fractions of a cent each; this is purely a safety net if the link spreads further than you expect.

## Create the Render service

1. Go to **render.com** and sign up — choose **"Sign in with GitHub"** (this is what lets Render see your repo).
2. Click **New → Blueprint**.
3. Connect your `luxai_mgt595` repository. Render reads the `render.yaml` we added and pre-fills everything (build command, start command, free plan).
4. It will prompt for **ANTHROPIC_API_KEY** — paste your key. This is stored server-side by Render and never sent to browsers.
5. Click **Apply / Deploy**. The first build takes ~3–5 minutes (watch the log scroll — it runs the same `npm install && npm run build` that passed on your machine).
6. When it flips to **Live**, click the URL at the top. That's your course. 🎉

> If the Blueprint option gives you trouble, the manual route works too: **New → Web Service**, pick the repo, set Build Command `npm install && npm run build`, Start Command `npm start`, add the `ANTHROPIC_API_KEY` environment variable, choose the Free plan, deploy.

## Test the live site

- [ ] Home page shows all 7 lecture cards
- [ ] Open Lecture 6, page a few slides — visuals render
- [ ] Refresh the browser while deep in a lecture (e.g. on `/lecture/06`) — the page reloads correctly (this tests the SPA fallback)
- [ ] Open Lux chat and send a message — a reply means the proxy is working end to end
- [ ] Open DevTools (⌥⌘J) → Network tab → send another Lux message → click the `lux` request → confirm the request goes to `/api/lux` on your domain and contains **no** `x-api-key` header

## Updating the site later

Render redeploys automatically on every `git push`. Ship a change locally, push, wait ~3 minutes, refresh.

## Good to know

- **Free-tier sleep:** after ~15 idle minutes the server naps; the next visitor waits 30–60s while it wakes. Fine for a demo. ($7/month removes it, entirely optional.)
- **Built-in guardrails:** the proxy only forwards the two models the app uses, caps response length, and rate-limits each visitor to 20 requests/minute — so even a shared link can't burn through your key quickly. Combined with the spend limit, worst case is capped.
- **Local production test:** `ANTHROPIC_API_KEY=sk-your-key npm start` then open http://localhost:3000 — this runs the exact same server Render runs. (Note: `npm run preview` will NOT have working chat — it serves the build without the proxy. Use `npm start` instead.)
- **If chat fails on the live site** with a 500 mentioning the key: the env var didn't save — Render dashboard → your service → Environment → add `ANTHROPIC_API_KEY` → Save (it redeploys automatically).
