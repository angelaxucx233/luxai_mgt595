#!/usr/bin/env python3
"""
LuxAI agent — pre-bake slide narration audio (Gemini TTS or ElevenLabs).

Reads narration strings from src/data/lectures/{lecture_id}Slides.js and writes
MP3 files to public/audio/{lecture_id}/slide_XX.mp3 for instant playback.

Pipeline: ... -> build_slides.py -> bake_narration_audio.py

Usage:
  python agents/bake_narration_audio.py --lecture-id lecture04 --provider elevenlabs
  python agents/bake_narration_audio.py --lecture-id lecture04 --provider gemini
  python agents/bake_narration_audio.py --lecture-id lecture04 --provider elevenlabs --clean
"""

from __future__ import annotations

import argparse
import base64
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
import wave
from pathlib import Path

import requests
from dotenv import load_dotenv
from google import genai
from google.genai import types

ROOT = Path(__file__).resolve().parent
PROJECT_ROOT = ROOT.parent
SLIDES_DIR = PROJECT_ROOT / "src" / "data" / "lectures"
AUDIO_DIR = PROJECT_ROOT / "public" / "audio"

TAG_PATTERN = re.compile(r"\[[^\]]+\]\s*")

DEFAULT_GEMINI_TTS_MODELS = [
    "gemini-2.5-flash-preview-tts",
    "gemini-3.1-flash-tts-preview",
]
DEFAULT_GEMINI_VOICE = "Sulafat"
DEFAULT_ELEVENLABS_MODEL = "eleven_v3"
DEFAULT_ELEVENLABS_VOICE_ID = "dR1Ptm3rjBUIbHiaywdJ"  # Lisa Manoban
DEFAULT_ELEVENLABS_OUTPUT = "mp3_44100_128"
GEMINI_SAMPLE_RATE = 24000


def load_env_files() -> None:
    load_dotenv(PROJECT_ROOT / ".env")
    load_dotenv(PROJECT_ROOT.parent / ".env")


def strip_emotion_tags(text: str) -> str:
    return TAG_PATTERN.sub("", text).replace("  ", " ").strip()


def build_gemini_tts_prompt(narration: str) -> str:
    clean = strip_emotion_tags(narration)
    if not clean:
        return ""
    if clean.lower().startswith("say "):
        return clean
    return f"Say in a warm, friendly Socratic tutor voice: {clean}"


def build_elevenlabs_tts_text(narration: str) -> str:
    return narration.strip()


def load_slides(lecture_id: str) -> list[dict]:
    slides_path = SLIDES_DIR / f"{lecture_id}Slides.js"
    if not slides_path.exists():
        print(f"Error: slide deck not found: {slides_path}", file=sys.stderr)
        sys.exit(1)

    export_name = f"{lecture_id}Slides"
    import_uri = slides_path.resolve().as_uri()
    script = (
        f"import {{ {export_name} as slides }} from {json.dumps(import_uri)}; "
        "console.log(JSON.stringify(slides.map(s => ({"
        "slideId: s.slideId, narration: s.narration ?? ''"
        "}))));"
    )
    result = subprocess.run(
        ["node", "-e", script],
        cwd=PROJECT_ROOT,
        capture_output=True,
        text=True,
        check=False,
    )
    if result.returncode != 0:
        print(result.stderr or result.stdout, file=sys.stderr)
        sys.exit(1)
    return json.loads(result.stdout.strip())


def clean_lecture_mp3s(out_dir: Path) -> int:
    removed = 0
    for mp3 in out_dir.glob("slide_*.mp3"):
        mp3.unlink()
        removed += 1
    return removed


def pcm_to_wav_bytes(pcm: bytes, sample_rate: int = GEMINI_SAMPLE_RATE) -> bytes:
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        tmp_path = tmp.name
    try:
        with wave.open(tmp_path, "wb") as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(sample_rate)
            wf.writeframes(pcm)
        return Path(tmp_path).read_bytes()
    finally:
        Path(tmp_path).unlink(missing_ok=True)


def wav_to_mp3(wav_bytes: bytes, mp3_path: Path) -> None:
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        raise RuntimeError(
            "ffmpeg not found on PATH — install ffmpeg to encode MP3 "
            "(https://ffmpeg.org/download.html)"
        )
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        tmp.write(wav_bytes)
        wav_path = tmp.name
    try:
        subprocess.run(
            [
                ffmpeg,
                "-y",
                "-loglevel",
                "error",
                "-i",
                wav_path,
                "-codec:a",
                "libmp3lame",
                "-qscale:a",
                "4",
                str(mp3_path),
            ],
            check=True,
        )
    finally:
        Path(wav_path).unlink(missing_ok=True)


def extract_pcm(response) -> bytes | None:
    candidates = getattr(response, "candidates", None) or []
    for candidate in candidates:
        content = getattr(candidate, "content", None)
        if not content:
            continue
        for part in getattr(content, "parts", None) or []:
            inline = getattr(part, "inline_data", None)
            if not inline or not inline.data:
                continue
            data = inline.data
            if isinstance(data, str):
                return base64.b64decode(data)
            if isinstance(data, (bytes, bytearray)):
                return bytes(data)
    return None


def synthesize_gemini_pcm(
    client: genai.Client,
    prompt: str,
    voice_name: str,
    models: list[str],
    *,
    max_retries: int = 4,
) -> bytes:
    config = types.GenerateContentConfig(
        response_modalities=["AUDIO"],
        speech_config=types.SpeechConfig(
            voice_config=types.VoiceConfig(
                prebuilt_voice_config=types.PrebuiltVoiceConfig(
                    voice_name=voice_name,
                )
            )
        ),
    )

    last_error: Exception | None = None
    for model in models:
        for attempt in range(max_retries):
            try:
                response = client.models.generate_content(
                    model=model,
                    contents=prompt,
                    config=config,
                )
                pcm = extract_pcm(response)
                if pcm:
                    return pcm
                last_error = RuntimeError("Gemini TTS returned no audio data")
                if attempt < max_retries - 1:
                    wait = 2**attempt
                    print(f"    empty audio, retry {attempt + 1}/{max_retries - 1} in {wait}s…")
                    time.sleep(wait)
                    continue
                break
            except Exception as err:
                last_error = err
                msg = str(err).lower()
                if "404" in msg or "not found" in msg or "not_found" in msg:
                    break
                retryable = any(
                    token in msg
                    for token in ("500", "internal", "429", "resource_exhausted", "timeout")
                )
                if retryable and attempt < max_retries - 1:
                    wait = 2**attempt
                    print(f"    retry {attempt + 1}/{max_retries - 1} in {wait}s…")
                    time.sleep(wait)
                    continue
                if retryable:
                    break
                raise
    raise RuntimeError(str(last_error) if last_error else "Gemini TTS failed")


def elevenlabs_voice_settings(model_id: str) -> dict:
    is_v3 = "v3" in model_id
    return {
        "stability": 0.35 if is_v3 else 0.5,
        "similarity_boost": 0.75,
    }


def synthesize_elevenlabs_mp3(
    text: str,
    *,
    api_key: str,
    voice_id: str,
    model_id: str,
    output_format: str = DEFAULT_ELEVENLABS_OUTPUT,
    max_retries: int = 4,
) -> bytes:
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {
        "xi-api-key": api_key,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg",
    }
    body = {
        "text": text,
        "model_id": model_id,
        "voice_settings": elevenlabs_voice_settings(model_id),
    }
    params = {"output_format": output_format}

    last_error: Exception | None = None
    for attempt in range(max_retries):
        try:
            response = requests.post(
                url,
                headers=headers,
                params=params,
                json=body,
                timeout=180,
            )
            if response.status_code == 429 and attempt < max_retries - 1:
                wait = 2**attempt
                print(f"    rate limited, retry {attempt + 1}/{max_retries - 1} in {wait}s…")
                time.sleep(wait)
                continue
            response.raise_for_status()
            if not response.content:
                raise RuntimeError("ElevenLabs returned empty audio")
            return response.content
        except Exception as err:
            last_error = err
            if attempt < max_retries - 1:
                wait = 2**attempt
                print(f"    retry {attempt + 1}/{max_retries - 1} in {wait}s…")
                time.sleep(wait)
                continue
            raise
    raise RuntimeError(str(last_error) if last_error else "ElevenLabs TTS failed")


def resolve_provider(explicit: str | None) -> str:
    if explicit:
        return explicit.lower()
    env_provider = (
        os.getenv("NARRATION_TTS_PROVIDER")
        or os.getenv("VITE_TTS_PROVIDER")
        or "elevenlabs"
    )
    return env_provider.lower()


def bake_lecture(
    lecture_id: str,
    *,
    provider: str,
    skip_existing: bool = False,
    clean: bool = False,
    gemini_voice: str = DEFAULT_GEMINI_VOICE,
    gemini_models: list[str] | None = None,
    elevenlabs_voice_id: str = DEFAULT_ELEVENLABS_VOICE_ID,
    elevenlabs_model: str = DEFAULT_ELEVENLABS_MODEL,
) -> None:
    provider = provider.lower()
    if provider not in ("gemini", "elevenlabs"):
        print(f"Error: unknown provider {provider!r} (use gemini or elevenlabs)", file=sys.stderr)
        sys.exit(1)

    slides = load_slides(lecture_id)
    out_dir = AUDIO_DIR / lecture_id
    out_dir.mkdir(parents=True, exist_ok=True)

    if clean:
        removed = clean_lecture_mp3s(out_dir)
        print(f"Cleaned {removed} existing MP3(s) in {out_dir.relative_to(PROJECT_ROOT)}")

    gemini_client = None
    if provider == "gemini":
        api_key = os.getenv("GEMINI_API_KEY") or os.getenv("VITE_GEMINI_API_KEY")
        if not api_key:
            print("Error: set GEMINI_API_KEY or VITE_GEMINI_API_KEY in .env", file=sys.stderr)
            sys.exit(1)
        gemini_client = genai.Client(api_key=api_key)

    elevenlabs_api_key = None
    if provider == "elevenlabs":
        elevenlabs_api_key = (
            os.getenv("ELEVENLABS_API_KEY")
            or os.getenv("VITE_ELEVENLABS_API_KEY")
        )
        if not elevenlabs_api_key:
            print(
                "Error: set ELEVENLABS_API_KEY or VITE_ELEVENLABS_API_KEY in .env",
                file=sys.stderr,
            )
            sys.exit(1)
        elevenlabs_voice_id = (
            os.getenv("ELEVENLABS_VOICE_ID")
            or os.getenv("VITE_ELEVENLABS_VOICE_ID")
            or elevenlabs_voice_id
        )
        elevenlabs_model = (
            os.getenv("ELEVENLABS_MODEL")
            or os.getenv("VITE_ELEVENLABS_MODEL")
            or elevenlabs_model
        )

    model_chain = gemini_models or DEFAULT_GEMINI_TTS_MODELS
    manifest: list[dict] = []
    baked = 0
    skipped = 0

    for slide in slides:
        slide_id = int(slide["slideId"])
        narration = (slide.get("narration") or "").strip()
        filename = f"slide_{slide_id:02d}.mp3"
        mp3_path = out_dir / filename

        if not narration:
            print(f"  slide {slide_id:02d}: skip (no narration)")
            continue

        if skip_existing and mp3_path.exists():
            print(f"  slide {slide_id:02d}: skip (exists)")
            skipped += 1
            manifest.append({"slideId": slide_id, "file": filename, "skipped": True})
            continue

        print(f"  slide {slide_id:02d}: synthesizing ({provider})…")

        if provider == "gemini":
            assert gemini_client is not None
            prompt = build_gemini_tts_prompt(narration)
            pcm = synthesize_gemini_pcm(gemini_client, prompt, gemini_voice, model_chain)
            wav_bytes = pcm_to_wav_bytes(pcm)
            wav_to_mp3(wav_bytes, mp3_path)
            manifest.append(
                {
                    "slideId": slide_id,
                    "file": filename,
                    "chars": len(strip_emotion_tags(narration)),
                }
            )
        else:
            assert elevenlabs_api_key is not None
            text = build_elevenlabs_tts_text(narration)
            mp3_bytes = synthesize_elevenlabs_mp3(
                text,
                api_key=elevenlabs_api_key,
                voice_id=elevenlabs_voice_id,
                model_id=elevenlabs_model,
            )
            mp3_path.write_bytes(mp3_bytes)
            manifest.append(
                {
                    "slideId": slide_id,
                    "file": filename,
                    "chars": len(text),
                }
            )

        baked += 1
        print(f"  slide {slide_id:02d}: wrote {mp3_path.relative_to(PROJECT_ROOT)}")

    manifest_path = out_dir / "manifest.json"
    manifest_meta = {
        "lectureId": lecture_id,
        "provider": provider,
        "slides": manifest,
    }
    if provider == "gemini":
        manifest_meta["voice"] = gemini_voice
        manifest_meta["models"] = model_chain
    else:
        manifest_meta["voiceId"] = elevenlabs_voice_id
        manifest_meta["voiceName"] = "Lisa Manoban"
        manifest_meta["model"] = elevenlabs_model

    manifest_path.write_text(json.dumps(manifest_meta, indent=2), encoding="utf-8")

    print(
        f"\nDone ({provider}): {baked} baked, {skipped} skipped -> "
        f"{out_dir.relative_to(PROJECT_ROOT)}/"
    )


def main() -> None:
    load_env_files()

    parser = argparse.ArgumentParser(
        description="Bake slide narration MP3s with Gemini TTS or ElevenLabs"
    )
    parser.add_argument(
        "--lecture-id",
        required=True,
        help="Lecture id matching slides file, e.g. lecture04",
    )
    parser.add_argument(
        "--provider",
        choices=["gemini", "elevenlabs"],
        default=None,
        help="TTS provider (default: NARRATION_TTS_PROVIDER or elevenlabs)",
    )
    parser.add_argument(
        "--clean",
        action="store_true",
        help="Delete existing slide_XX.mp3 files before baking",
    )
    parser.add_argument(
        "--skip-existing",
        action="store_true",
        help="Skip slides that already have an MP3",
    )
    parser.add_argument(
        "--voice",
        default=os.getenv("VITE_GEMINI_TTS_VOICE", DEFAULT_GEMINI_VOICE),
        help=f"Gemini prebuilt voice (default: {DEFAULT_GEMINI_VOICE})",
    )
    parser.add_argument(
        "--model",
        default=os.getenv("VITE_GEMINI_TTS_MODEL", ""),
        help="Primary Gemini TTS model (falls back automatically)",
    )
    parser.add_argument(
        "--elevenlabs-voice-id",
        default=os.getenv("ELEVENLABS_VOICE_ID")
        or os.getenv("VITE_ELEVENLABS_VOICE_ID")
        or DEFAULT_ELEVENLABS_VOICE_ID,
        help="ElevenLabs voice id (default: Lisa Manoban)",
    )
    parser.add_argument(
        "--elevenlabs-model",
        default=os.getenv("ELEVENLABS_MODEL")
        or os.getenv("VITE_ELEVENLABS_MODEL")
        or DEFAULT_ELEVENLABS_MODEL,
        help=f"ElevenLabs model (default: {DEFAULT_ELEVENLABS_MODEL})",
    )
    args = parser.parse_args()

    provider = resolve_provider(args.provider)
    models = DEFAULT_GEMINI_TTS_MODELS
    if args.model:
        models = [args.model, *[m for m in DEFAULT_GEMINI_TTS_MODELS if m != args.model]]

    if provider == "elevenlabs":
        print(
            f"Baking narration audio for {args.lecture_id} "
            f"(ElevenLabs / Lisa Manoban / {args.elevenlabs_model})"
        )
    else:
        print(f"Baking narration audio for {args.lecture_id} (Gemini / voice: {args.voice})")

    bake_lecture(
        args.lecture_id,
        provider=provider,
        skip_existing=args.skip_existing,
        clean=args.clean,
        gemini_voice=args.voice,
        gemini_models=models,
        elevenlabs_voice_id=args.elevenlabs_voice_id,
        elevenlabs_model=args.elevenlabs_model,
    )


if __name__ == "__main__":
    main()
