#!/usr/bin/env python3
"""
LuxAI agent — describe lecture slide PDFs with Gemini.

Renders each PDF page to a PNG, sends pages one at a time to Gemini with
accumulating context from prior page descriptions, and writes a JSON catalog.

Usage:
  1. Edit EXTRA_CONTEXT, PDF_PATH, and OUTPUT_JSON_FILENAME below (or pass CLI flags).
  2. pip install -r agents/requirements.txt
  3. python agents/describe_slides.py
     python agents/describe_slides.py --pdf "path/to/lecture.pdf" --context "MGT 403 Lecture 2"
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

import fitz  # PyMuPDF
from dotenv import load_dotenv
from google import genai
from google.genai import types

# ---------------------------------------------------------------------------
# Edit these defaults before running (CLI flags override).
# ---------------------------------------------------------------------------

EXTRA_CONTEXT = (
    "MGT 403 Probability and Statistics — Lecture 01: Probability Experiments. "
    "Slides cover sample spaces, coin toss experiments, counting outcomes, "
    "urn draws without replacement, and conditional probability."
)

PDF_PATH = "../lectures/MGT 403 - Lecture 01 - Probability Experiments.pdf"

# JSON filename only — written to lectures/ (add .json if omitted)
OUTPUT_JSON_FILENAME = "lecture01_slide_descriptions.json"

GEMINI_MODEL = "gemini-3-flash"

RENDER_DPI = 180

# ---------------------------------------------------------------------------

ROOT = Path(__file__).resolve().parent
PROJECT_ROOT = ROOT.parent
LECTURES_DIR = PROJECT_ROOT / "lectures"

MODEL_ALIASES = {
    "gemini-3-flash": "gemini-3-flash-preview",
}

SYSTEM_INSTRUCTION = """You are a meticulous teaching assistant helping build LuxAI,
an interactive probability tutor app (Brilliant-style).

You receive one lecture slide image at a time. Describe what is on the slide so a
developer can later recreate the lesson structure, problems, and Lux tutor prompts.

For each slide, return structured plain text with these sections:

TITLE: (short slide title if visible or inferred)
TYPE: (one of: title, concept, example, problem, recap, other)
VISUALS: (diagrams, tables, equations, colors, layout — be specific)
TEXT: (key bullet points and notation exactly as shown, using Unicode math where needed)
TEACHING_GOAL: (what the student should take away)
LUX_HINTS: (1–2 Socratic hints Lux could give without spoiling answers)

Be factual. If text is illegible, say [illegible]. Do not invent content not on the slide."""


def load_api_key() -> str:
    load_dotenv(PROJECT_ROOT / ".env")
    key = (
        os.getenv("GEMINI_API_KEY")
        or os.getenv("VITE_GEMINI_API_KEY")
        or os.getenv("GOOGLE_API_KEY")
    )
    if not key:
        raise RuntimeError(
            "No Gemini API key found. Set GEMINI_API_KEY or VITE_GEMINI_API_KEY in .env"
        )
    return key


def resolve_model(name: str) -> str:
    return MODEL_ALIASES.get(name, name)


def ensure_json_filename(filename: str) -> str:
    name = filename.strip()
    return name if name.lower().endswith(".json") else f"{name}.json"


def default_images_dir(pdf_path: Path) -> Path:
    stem = pdf_path.stem.replace(" ", "_").lower()
    return ROOT / "output" / stem / "pages"


def lectures_json_path(filename: str) -> Path:
    LECTURES_DIR.mkdir(parents=True, exist_ok=True)
    return LECTURES_DIR / ensure_json_filename(filename)


def render_pdf_pages(pdf_path: Path, images_dir: Path) -> list[Path]:
    images_dir.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(pdf_path)
    image_paths: list[Path] = []

    zoom = RENDER_DPI / 72
    matrix = fitz.Matrix(zoom, zoom)

    for index in range(len(doc)):
        page_number = index + 1
        image_path = images_dir / f"page_{page_number:03d}.png"
        if not image_path.exists():
            pix = doc.load_page(index).get_pixmap(matrix=matrix, alpha=False)
            pix.save(str(image_path))
        image_paths.append(image_path)

    doc.close()
    return image_paths


def build_user_prompt(
    page_number: int,
    total_pages: int,
    extra_context: str,
    previous_descriptions: list[dict],
) -> str:
    lines = [
        f"Document context: {extra_context}",
        "",
        f"Describe slide {page_number} of {total_pages}.",
    ]

    if previous_descriptions:
        lines.append("")
        lines.append("Previous slides (for continuity — do not repeat verbatim):")
        for entry in previous_descriptions:
            lines.append(f"--- Page {entry['page_number']} ---")
            lines.append(entry["description"])
            lines.append("")

    lines.append("Describe only the current slide image.")
    return "\n".join(lines)


def describe_slide(
    client: genai.Client,
    model_name: str,
    image_path: Path,
    user_prompt: str,
) -> str:
    image_bytes = image_path.read_bytes()
    response = client.models.generate_content(
        model=model_name,
        contents=[
            types.Part.from_text(text=user_prompt),
            types.Part.from_bytes(data=image_bytes, mime_type="image/png"),
        ],
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_INSTRUCTION,
        ),
    )
    text = (response.text or "").strip()
    if not text:
        raise RuntimeError(f"Empty Gemini response for {image_path.name}")
    return text


def load_existing_results(json_path: Path) -> dict | None:
    if not json_path.exists():
        return None
    with json_path.open(encoding="utf-8") as f:
        return json.load(f)


def save_results(json_path: Path, payload: dict) -> None:
    json_path.parent.mkdir(parents=True, exist_ok=True)
    with json_path.open("w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)
        f.write("\n")


def cleanup_page_images(images_dir: Path) -> int:
    """Delete temporary PNGs and remove empty output directories."""
    if not images_dir.is_dir():
        return 0

    removed = 0
    for png in images_dir.glob("*.png"):
        png.unlink()
        removed += 1

    try:
        images_dir.rmdir()
    except OSError:
        pass

    parent = images_dir.parent
    try:
        if parent.is_dir() and not any(parent.iterdir()):
            parent.rmdir()
    except OSError:
        pass

    return removed


def run(
    pdf_path: Path,
    extra_context: str,
    images_dir: Path,
    json_path: Path,
    model_name: str,
    resume: bool,
) -> dict:
    if not pdf_path.is_file():
        raise FileNotFoundError(
            f"PDF not found: {pdf_path}\n"
            f"Copy your slide deck into: {LECTURES_DIR}\n"
            f"Or pass --pdf \"path/to/your/file.pdf\""
        )

    resolved_model = resolve_model(model_name)
    client = genai.Client(api_key=load_api_key())

    image_paths = render_pdf_pages(pdf_path, images_dir)
    total_pages = len(image_paths)

    existing = load_existing_results(json_path) if resume else None
    previous_pages: list[dict] = []
    if existing and existing.get("pages"):
        previous_pages = list(existing["pages"])

    payload: dict = {
        "source_pdf": str(pdf_path.resolve()),
        "extra_context": extra_context,
        "model": resolved_model,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "total_pages": total_pages,
        "pages": previous_pages,
    }

    described_numbers = {p["page_number"] for p in previous_pages}

    for page_number, image_path in enumerate(image_paths, start=1):
        if page_number in described_numbers:
            print(f"Skipping page {page_number}/{total_pages} (already described)")
            continue

        print(f"Describing page {page_number}/{total_pages} ...")
        user_prompt = build_user_prompt(
            page_number=page_number,
            total_pages=total_pages,
            extra_context=extra_context,
            previous_descriptions=previous_pages,
        )

        description = describe_slide(
            client=client,
            model_name=resolved_model,
            image_path=image_path,
            user_prompt=user_prompt,
        )

        page_entry = {
            "page_number": page_number,
            "image_path": str(image_path.relative_to(ROOT)),
            "description": description,
        }
        previous_pages.append(page_entry)
        payload["pages"] = previous_pages
        payload["generated_at"] = datetime.now(timezone.utc).isoformat()
        save_results(json_path, payload)
        print(f"  saved: {json_path}")

    payload["pages"] = sorted(previous_pages, key=lambda p: p["page_number"])

    if len(payload["pages"]) == total_pages:
        payload["pages"] = [
            {k: v for k, v in page.items() if k != "image_path"}
            for page in payload["pages"]
        ]
        save_results(json_path, payload)
        removed = cleanup_page_images(images_dir)
        payload["temporary_images_removed"] = removed
    else:
        save_results(json_path, payload)

    return payload


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Describe lecture slide PDF pages with Gemini vision."
    )
    parser.add_argument(
        "--pdf",
        type=Path,
        default=Path(PDF_PATH),
        help="Path to the lecture PDF",
    )
    parser.add_argument(
        "--context",
        type=str,
        default=EXTRA_CONTEXT,
        help="Extra document context string sent with every page",
    )
    parser.add_argument(
        "--json",
        type=str,
        default=OUTPUT_JSON_FILENAME,
        dest="json_filename",
        help="Output JSON filename, saved in lectures/ (default: OUTPUT_JSON_FILENAME)",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=None,
        help="Full output JSON path (overrides --json)",
    )
    parser.add_argument(
        "--images-dir",
        type=Path,
        default=None,
        help="Directory for rendered page PNGs",
    )
    parser.add_argument(
        "--model",
        type=str,
        default=os.getenv("VITE_GEMINI_MODEL", GEMINI_MODEL),
        help="Gemini model id (alias gemini-3-flash maps to gemini-3-flash-preview)",
    )
    parser.add_argument(
        "--no-resume",
        action="store_true",
        help="Ignore existing JSON and re-describe all pages",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    pdf_path = args.pdf
    if not pdf_path.is_absolute():
        pdf_path = (ROOT / pdf_path).resolve()

    images_dir = args.images_dir or default_images_dir(pdf_path)
    if args.output:
        json_path = args.output
        if not json_path.is_absolute():
            json_path = (ROOT / json_path).resolve()
    else:
        json_path = lectures_json_path(args.json_filename)

    if not images_dir.is_absolute():
        images_dir = (ROOT / images_dir).resolve()

    try:
        result = run(
            pdf_path=pdf_path,
            extra_context=args.context,
            images_dir=images_dir,
            json_path=json_path,
            model_name=args.model,
            resume=not args.no_resume,
        )
    except Exception as err:
        print(f"Error: {err}", file=sys.stderr)
        return 1

    removed = result.get("temporary_images_removed")
    cleanup_note = (
        f"Removed {removed} temporary page image(s)."
        if removed is not None
        else "Temporary images kept (run incomplete — resume to finish)."
    )
    print(
        f"\nDone - {len(result['pages'])} page(s) described.\n"
        f"JSON: {json_path}\n"
        f"{cleanup_note}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
