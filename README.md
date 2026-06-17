# LuxAI Template — Interactive AI Tutor for Yale SOM

A forkable template for turning lecture slide PDFs into a **Brilliant-style** web app with **Lux**, a Socratic AI tutor (chat + voice). Built with React, Vite, Gemini, and optional ElevenLabs TTS.

Use this repo to build your own course: clone it, add API keys, drop PDFs in `lectures/`, run the conversion pipeline, and launch the app.

---

## Quick start (colleagues)

```bash
git clone <your-repo-url> my-course-tutor
cd my-course-tutor

npm install
cp .env.example .env
# Edit .env — add API keys (see below)

npm run dev
```

Open **http://localhost:5173** — home page → your course → an available lecture.

For the faculty demo deck, open **`seminar.html`** in a browser (no npm needed).

---

## API keys

Copy `.env.example` to `.env`. **Never commit `.env`.**

### Required to run the app

| Variable | What it does | Where to get it |
|----------|----------------|-----------------|
| `VITE_GEMINI_API_KEY` | Lux chat tutor (required) | [Google AI Studio](https://aistudio.google.com/apikey) |
| `VITE_GEMINI_MODEL` | Chat model (default: `gemini-3-flash`) | Same; use a model name from the Gemini API |

Without Gemini, the app loads but Lux chat shows an offline placeholder.

### Optional — Lux voice

Slide narration uses **pre-baked MP3s** (step 4). Live chat replies use on-demand TTS when students tap the speaker icon.

| Variable | What it does | Default |
|----------|----------------|---------|
| `VITE_TTS_PROVIDER` / `NARRATION_TTS_PROVIDER` | TTS for baking + live voice | `elevenlabs` |
| `VITE_ELEVENLABS_API_KEY` / `ELEVENLABS_API_KEY` | ElevenLabs TTS (bake step + app) | — |
| `VITE_ELEVENLABS_VOICE_ID` | ElevenLabs voice (Lisa Manoban) | `dR1Ptm3rjBUIbHiaywdJ` |
| `VITE_ELEVENLABS_MODEL` | ElevenLabs model | `eleven_v3` |
| `VITE_GEMINI_TTS_MODEL` | Gemini TTS model (if provider = gemini) | `gemini-2.5-flash-preview-tts` |
| `VITE_GEMINI_TTS_VOICE` | Gemini prebuilt voice | `Sulafat` |

ElevenLabs keeps emotion tags like `[excited]` in narration. Gemini TTS uses the same `VITE_GEMINI_API_KEY` as chat.

### Required only for the PDF → web conversion pipeline

These use the same Gemini key as the app. Python agents read `GEMINI_API_KEY` or `VITE_GEMINI_API_KEY` from `.env`.

| Variable | What it does | Default |
|----------|----------------|---------|
| `OUTLINE_GEMINI_MODEL` | Instructional-design outline (pass 1 & 2) | `gemini-3.1-pro-preview` |
| `REFINE_GEMINI_MODEL` | Outline refinement (optional override) | same as above |
| `GEMINI_HTTP_TIMEOUT_MS` | Long timeout for big lectures (ms) | `900000` (15 min) |

Install Python deps once:

```bash
pip install -r agents/requirements.txt
```

---

## Add your lecture PDFs

1. Put slide decks in **`lectures/`** (project root).
2. Use a clear filename, e.g. `MGT 403 - Lecture 04 - Binomial Distribution.pdf`.
3. Do **not** put notes/solution PDFs here (they are excluded from the catalog).

---

## Convert PDF slides → interactive web lecture (4 steps)

Run from the **`luxai_template`** folder. Replace `04` / lecture title with your lecture number.

### Step 1 — Describe slides (`describe_slides.py`)

Gemini vision reads each PDF page and writes a JSON catalog.

```bash
python agents/describe_slides.py \
  --pdf "../lectures/MGT 403 - Lecture 04 - Binomial Distribution.pdf" \
  --json lecture04_slide_descriptions.json \
  --context "MGT 403 Lecture 04: Binomial Distribution"
```

**Output:** `lectures/lecture04_slide_descriptions.json`

### Step 2 — Design the interactive outline (`outline_lecture.py`)

Turns page descriptions into a Brilliant-style app outline (explain / problem / interactive slides). Runs pass 1 + pass 2 automatically.

```bash
python agents/outline_lecture.py \
  --input lecture04_slide_descriptions.json \
  --output lecture04_outline.json \
  --refined-output lecture04_outline_refined.json \
  --lecture-id lecture04 \
  --lecture-title "Binomial Distribution"
```

**Output:** `lectures/lecture04_outline.json`, `lectures/lecture04_outline_refined.json`

Large decks can take several minutes per pass.

### Step 3 — Build the React slide deck (`build_slides.py`)

Generates the JavaScript slide file the app loads.

```bash
python agents/build_slides.py \
  --outline lecture04_outline_refined.json \
  --lecture-id lecture04
```

**Output:** `src/data/lectures/lecture04Slides.js`

### Step 4 — Bake slide narration audio (`bake_narration_audio.py`)

Pre-generates MP3 files from each slide's `narration` text. Students get instant playback on slide open; live chat replies still use on-demand TTS.

**ElevenLabs** (default) — Lisa Manoban voice, `eleven_v3`, supports `[excited]` emotion tags.  
**Gemini TTS** — Sulafat voice; requires **ffmpeg** on PATH for MP3 encoding.

```bash
# ElevenLabs (default)
python agents/bake_narration_audio.py --lecture-id lecture04 --provider elevenlabs

# Or Gemini TTS
python agents/bake_narration_audio.py --lecture-id lecture04 --provider gemini
```

**Output:** `public/audio/lecture04/slide_01.mp3` … `slide_15.mp3`

Re-run with `--clean` after editing narration text. Use `--skip-existing` to only bake missing files.

---

## Wire the lecture into the app

After the pipeline, two small edits make the lecture live:

### 1. Register the slide deck — `src/data/slidesData.jsx`

```js
import { lecture04Slides } from './lectures/lecture04Slides.js';

const LECTURE_DECKS = {
  // ...
  '04': lecture04Slides,
  '4': lecture04Slides,
};
```

### 2. Enable it in the catalog — `src/data/catalog.js`

Add or update the lecture entry and set `available: true`:

```js
{
  number: 4,
  title: 'Binomial Distribution',
  slug: '04',
  pdfFilename: 'MGT 403 - Lecture 04 - Binomial Distribution.pdf',
  available: true,
},
```

Restart `npm run dev` if it is already running. Open:

**`/course/mgt-403/lecture/04`**

(Change `mgt-403` if you customize the course `id` in `catalog.js`.)

---

## Customize for your course

| Task | File |
|------|------|
| Course name, lecture list, which lectures are live | `src/data/catalog.js` |
| Slide decks per lecture | `src/data/lectures/lectureXXSlides.js` + `src/data/slidesData.jsx` |
| Practice problem types Lux can regenerate | `src/data/problemTemplates.js` |
| Lux chat behavior | `src/services/geminiService.js` |
| Yale colors / theme | `tailwind.config.js` |

Rename branding (Lux, MGT 403) in `src/components/`, `catalog.js`, and `index.html` as needed for your class.

---

## Run & build

```bash
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run preview  # preview production build locally
```

### App routes

| URL | Page |
|-----|------|
| `/` | Home — course cards |
| `/course/mgt-403` | Lecture list |
| `/course/mgt-403/lecture/01` | Interactive lecture (if `available: true`) |

PDFs are served from `/lectures/...` in dev and copied to `dist/lectures` on build.

---

## How the app works (short)

- **Slides** — explain, interactive, and problem slides in `lectureXXSlides.js`
- **Lux chat** — Gemini tutor sees the current slide and student’s problem inputs
- **Voice** — slide-open narration uses pre-baked MP3s (step 4, ElevenLabs or Gemini); tap speaker on chat replies for live TTS
- **Agents folder** — `agents/describe_slides.py`, `outline_lecture.py`, `build_slides.py`, `bake_narration_audio.py`

---

## Faculty seminar deck

**`seminar.html`** — standalone slide deck explaining LuxAI and the 4-step pipeline for Yale SOM colleagues. Open in any browser; no API keys required.

---

## Security

- Do not commit `.env` or API keys.
- `VITE_*` variables are exposed to the browser (required for client-side Gemini in dev).
- For production, consider a backend proxy for API keys and TTS.
