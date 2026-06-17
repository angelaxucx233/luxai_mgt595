#!/usr/bin/env python3
"""
LuxAI agent — build and refine an interactive app lecture outline from slide descriptions.

Pipeline: PDF -> describe_slides.py -> outline_lecture.py -> build_slides.py

Pass 1: descriptions JSON -> draft outline JSON.
Pass 2: draft outline -> refined outline (problems, visuals, interactivity).

Usage:
  1. Edit INPUT_JSON_FILENAME, OUTPUT_JSON_FILENAME, REFINED_OUTPUT_JSON_FILENAME below.
  2. python agents/outline_lecture.py
     python agents/outline_lecture.py --no-refine          # pass 1 only
     python agents/outline_lecture.py --refine-only        # pass 2 only (needs draft outline)
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types

# ---------------------------------------------------------------------------
# Edit these defaults before running (CLI flags override).
# ---------------------------------------------------------------------------

INPUT_JSON_FILENAME = "lecture01_slide_descriptions.json"

# Pass 1 draft outline — written to lectures/ (add .json if omitted)
OUTPUT_JSON_FILENAME = "lecture01_outline.json"

# Pass 2 refined outline (default final artifact)
REFINED_OUTPUT_JSON_FILENAME = "lecture01_outline_refined.json"

# PDF digests help pass 2 when adding slides tied to source material
INCLUDE_DESCRIPTIONS_FOR_REFINE = True

LECTURE_ID = "lecture01"
LECTURE_TITLE = "Probability Experiments"

EXTRA_CONTEXT = (
    "LuxAI — Brilliant-style interactive SPA for MGT 403. Yale navy theme. "
    "Lux is a Socratic AI tutor with chat, optional voice, 3D coin/urn demos, "
    "and HTML/JS sandboxes. Existing problem templates: coin_outcomes, "
    "urn_conditional, equation_roots. Current lecture01 app has only 7 slides; "
    "expand to cover the full PDF pedagogically. Prefer interactive problems "
    "and visuals over static text."
)

REFINE_CONTEXT = (
    "LuxAI Brilliant-style tutor. Pass 1 outline exists — your job is to make it "
    "significantly better for students: more hands-on, more delightful visuals, "
    "clever problems that teach (not just quiz), and Lux-friendly Socratic moments. "
    "Existing templates: coin_outcomes, urn_conditional, equation_roots. "
    "You may add slides, split explain into explain+problem, upgrade type to "
    "interactive, or deepen problem_spec / visual_spec. Keep Yale navy aesthetic."
)

# Categories to skip — infer which PDF pages match from descriptions (no fixed page list).
ADMIN_SKIP_GUIDANCE = """
Identify administrative/coursework PDF pages from each page digest (TITLE, TYPE,
TEACHING_GOAL, TEXT). Skip them in the app outline — do not create app slides.

Skip categories (when the digest matches):
- Syllabus, course overview, schedules, room/section times
- Instructor bio, teaching squad, TAs, office hours, contact info
- Homework, projects, exams, grading, Canvas/submission logistics

Record skipped page numbers in pdf_pages_skipped and skipped_admin_pdf_pages.
Pedagogical hooks and concept slides are never admin even if they appear early.
"""

# Outline design needs a strong model (independent of VITE_GEMINI_MODEL in .env).
GEMINI_MODEL = "gemini-3.1-pro-preview"

# Pro models can take several minutes to emit a full outline JSON (93 PDF pages).
# Flash is faster; without a long timeout the HTTP client drops with "Server disconnected".
GEMINI_HTTP_TIMEOUT_MS = 900_000  # 15 minutes
MAX_GEMINI_ATTEMPTS = 4

# ---------------------------------------------------------------------------

ROOT = Path(__file__).resolve().parent
PROJECT_ROOT = ROOT.parent
LECTURES_DIR = PROJECT_ROOT / "lectures"

MODEL_ALIASES = {
    "gemini-3-flash": "gemini-3-flash-preview",
    "gemini-3.1-pro": "gemini-3.1-pro-preview",
}


def default_outline_model() -> str:
    """Outline agent model — not the app's chat TTS model from .env."""
    return os.getenv("OUTLINE_GEMINI_MODEL", GEMINI_MODEL)


def default_refine_model() -> str:
    return os.getenv("REFINE_GEMINI_MODEL") or os.getenv(
        "OUTLINE_GEMINI_MODEL", GEMINI_MODEL
    )

OUTLINE_SCHEMA_HINT = """
Return a single JSON object with this shape (no markdown fences):

{
  "lecture_id": "lecture01",
  "lecture_title": "Probability Experiments",
  "design_principles": [
    {
      "principle": "short name",
      "pdf_approach": "what the deck does",
      "app_approach": "what LuxAI should do instead"
    }
  ],
  "blocks": [
    {
      "block_id": "A",
      "block_title": "block theme",
      "pdf_page_range": "e.g. 12-20",
      "target_app_slide_count": 0,
      "slides": [
        {
          "app_slide_number": 1,
          "type": "explain | problem | interactive | recap",
          "title": "slide title",
          "pdf_page_refs": ["PDF page numbers this app slide uses"],
          "pdf_pages_skipped": ["admin/coursework PDF pages skipped near this block"],
          "content_summary": "what the student sees/learns",
          "interactivity": "tap, drag, simulate, problem check, etc.",
          "visual": "short label: HTML widget, 3D demo, Venn, tree, etc.",
          "visual_spec": {
            "component": "widget name (e.g. CoinOutcomeTable, VennDiagram, ProbabilityTree)",
            "student_actions": "what the student clicks/drags/sees animate",
            "implementation": "HTML/CSS, React sandbox, Three.js, or BuiltinDemoCanvas",
            "ties_to_concept": "which PDF teaching goal this visual reinforces"
          },
          "problem_template_id": "existing id or null",
          "problem_template_new": "suggested new template id or null",
          "problem_spec": {
            "when_to_place": "why a problem belongs here (after which concept)",
            "prompt": "exact problem statement for the student",
            "inputs": ["keypad count", "fraction picker", "multi-select outcomes", "etc."],
            "correct_answer_form": "e.g. 4, 3/4, {H1H2, H1T2, ...}",
            "params_for_regenerate": "numeric fields Lux may vary for extra practice",
            "difficulty": "warmup | core | stretch"
          },
          "lux_integration": "how Lux tutors this slide (hints, when to regenerate)",
          "system_prompt_notes": "context for Lux system prompt"
        }
      ]
    }
  ],
  "new_problem_templates": [
    {
      "id": "template_id",
      "label": "human label",
      "description": "what it validates",
      "input_fields": ["field names"],
      "randomizable_params": ["numeric params for regenerate_practice_problem"],
      "used_on_app_slides": [13, 21]
    }
  ],
  "visual_toolkit": [
    {
      "name": "Coin outcome table",
      "used_on_app_slides": [7],
      "implementation": "HTML/JS or Three.js"
    }
  ],
  "recommended_build_order": ["step 1", "step 2"],
  "gap_analysis": {
    "notes": "what the current minimal app misses vs this outline",
    "proposed_total_app_slides": 32
  },
  "skipped_admin_pdf_pages": ["all PDF page numbers you classified as admin/coursework"],
  "skipped_admin_reason": "brief summary of what was skipped and why"
}
"""

SYSTEM_INSTRUCTION = """You are an instructional designer and lead developer for LuxAI,
a Brilliant-style interactive probability tutor (React SPA, Yale theme).

You receive structured digests of every page from a lecture PDF (already described
by vision). Your job is to design the APP lecture experience — NOT replicate the
PDF page-by-page.

Goals:
- Group PDF content into thematic BLOCKS (A, B, C, ...).
- Within each block, propose an ordered table of APP SLIDES (much fewer than PDF pages).
- Mark slides as explain, problem, interactive, or recap.
- After every major concept, ask: should the student DO something? Insert problems where
  the PDF only shows static examples — Brilliant-style learn-by-doing.
- For each problem slide, fill problem_spec (prompt, inputs, answer form, regenerate params).
- For each slide, fill visual_spec when a custom widget helps (not just bullet text).
- Map each app slide to pdf_page_refs (and pdf_pages_skipped where admin content is dropped).
- Propose concrete interactivity: HTML/JS widgets, 3D demos, trees, Venns, sandboxes.
- Integrate Lux AI tutor: Socratic hints, system prompt notes, when to offer more practice.
- Reuse existing templates when possible: coin_outcomes, urn_conditional, equation_roots.
- Propose new problem templates only when needed (with id, label, fields, randomizable params).
- Include visual_toolkit and recommended_build_order for developers.
- Be opinionated and specific — vague slides are not acceptable.

ADMIN / COURSEWORK — INFER AND SKIP:
LuxAI is an online self-paced lesson. Read each page digest and decide whether it is
administrative/coursework (syllabus, logistics, bio, TAs, homework, exams, etc.).
Never allocate app slides for pages you classify that way. You must infer which pages
to skip from the descriptions — do not assume fixed page numbers across lectures.

List skipped page numbers in pdf_pages_skipped and skipped_admin_pdf_pages with
skipped_admin_reason. Do not put skipped admin content in app slide titles.

Output valid JSON only, matching the schema provided. Be specific and actionable."""

REFINE_SCHEMA_EXTRA = """
Also include these top-level fields in your JSON output:

  "refinement_changelog": [
    {
      "action": "added_slide | removed_slide | upgraded_slide | reordered | new_problem | new_visual",
      "app_slide_number": 0,
      "detail": "what changed and why it helps students"
    }
  ],
  "refinement_summary": "2-4 sentences on how pass 2 improved the lecture"
"""

REFINE_SYSTEM_INSTRUCTION = """You are a senior instructional designer and creative technologist
refining a LuxAI lecture outline (pass 2 of 2).

You receive a complete pass-1 outline JSON. Do NOT start from scratch — improve it.

Your mission: make the lecture noticeably better for students learning online.

Look for:
1. MISSED PRACTICE — concepts explained but never practiced → add problem or interactive slides
2. WEAK VISUALS — text-only explain slides → add visual_spec (widgets, simulations, diagrams)
3. CLEVER PROBLEMS — replace generic drills with insight-building tasks (predict, drag, compare,
   spot the mistake, build the sample space, use complement instead of brute force, etc.)
4. COOL VISUALS — probability trees students build, Venns that glow on hover, urn draws,
   gauges that update P(A|B), election-style maps, step-by-step Never Fail table wizards
5. PACING — split dense slides; add short recap checkpoints; add stretch problems after core skills
6. LUX MOMENTS — where Lux should provoke curiosity, celebrate insight, offer regenerate practice

Rules:
- Keep lecture_id, skipped_admin_pdf_pages, and admin skip decisions unless you have reason to adjust
- Renumber app_slide_number globally (1..N) after insertions/reorder
- Update new_problem_templates and visual_toolkit to match changes
- Fill problem_spec and visual_spec with concrete, buildable detail (null only if truly N/A)
- Same JSON schema as pass 1 plus refinement_changelog and refinement_summary
- Output valid JSON only"""


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


def gemini_http_timeout_ms() -> int:
    raw = os.getenv("GEMINI_HTTP_TIMEOUT_MS", str(GEMINI_HTTP_TIMEOUT_MS))
    try:
        return max(60_000, int(raw))
    except ValueError:
        return GEMINI_HTTP_TIMEOUT_MS


def make_genai_client() -> genai.Client:
    return genai.Client(
        api_key=load_api_key(),
        http_options=types.HttpOptions(
            timeout=gemini_http_timeout_ms(),
            retry_options=types.HttpRetryOptions(
                attempts=5,
                initial_delay=2.0,
                max_delay=60.0,
            ),
        ),
    )


def is_retryable_gemini_error(err: Exception) -> bool:
    msg = str(err).lower()
    return any(
        token in msg
        for token in (
            "disconnect",
            "timeout",
            "timed out",
            "connection reset",
            "connection aborted",
            "broken pipe",
            "502",
            "503",
            "504",
            "429",
            "resource_exhausted",
            "unavailable",
            "internal",
        )
    )


def generate_json_text(
    client: genai.Client,
    model: str,
    user_prompt: str,
    system_instruction: str,
    *,
    label: str,
) -> str:
    """Stream a JSON response with retries — pro models need long-lived connections."""
    config = types.GenerateContentConfig(
        system_instruction=system_instruction,
        response_mime_type="application/json",
    )

    last_err: Exception | None = None
    for attempt in range(1, MAX_GEMINI_ATTEMPTS + 1):
        try:
            if attempt > 1:
                wait = min(2**attempt, 60)
                print(
                    f"  Retry {attempt}/{MAX_GEMINI_ATTEMPTS} for {label} "
                    f"(waiting {wait}s) ..."
                )
                time.sleep(wait)
            elif "pro" in model:
                print(f"  Streaming {label} (pro models can take several minutes) ...")

            parts: list[str] = []
            stream = client.models.generate_content_stream(
                model=model,
                contents=[types.Part.from_text(text=user_prompt)],
                config=config,
            )
            for chunk in stream:
                if chunk.text:
                    parts.append(chunk.text)

            raw = "".join(parts).strip()
            if raw:
                return raw
            raise RuntimeError(f"Empty Gemini stream for {label}")
        except Exception as err:
            last_err = err
            if not is_retryable_gemini_error(err) or attempt == MAX_GEMINI_ATTEMPTS:
                raise

    raise last_err or RuntimeError(f"Failed to get {label}")


def ensure_json_filename(filename: str) -> str:
    name = filename.strip()
    return name if name.lower().endswith(".json") else f"{name}.json"


def lectures_json_path(filename: str) -> Path:
    LECTURES_DIR.mkdir(parents=True, exist_ok=True)
    return LECTURES_DIR / ensure_json_filename(filename)


def parse_description_fields(description: str) -> dict[str, str]:
    """Pull labeled sections from a describe_slides page description."""
    fields: dict[str, str] = {}

    def grab(label: str) -> str:
        pattern = rf"(?:\*\*)?{label}(?:\*\*)?:\s*(.+?)(?=\n(?:\*\*)?[A-Z_]+(?:\*\*)?:|\Z)"
        match = re.search(pattern, description, re.DOTALL | re.IGNORECASE)
        return match.group(1).strip() if match else ""

    for label in (
        "TITLE",
        "TYPE",
        "TEACHING_GOAL",
        "LUX_HINTS",
        "TEXT",
        "VISUALS",
    ):
        fields[label.lower()] = grab(label)

    return fields


def build_page_digest(page: dict, text_max: int = 280) -> str:
    """Compact one-page summary for the outline model."""
    fields = parse_description_fields(page.get("description", ""))
    title = fields.get("title") or "?"
    slide_type = fields.get("type") or "?"
    goal = fields.get("teaching_goal") or ""
    text = fields.get("text") or ""
    if len(text) > text_max:
        text = text[: text_max - 3] + "..."

    lines = [
        f"PDF page {page['page_number']}",
        f"  TITLE: {title}",
        f"  TYPE: {slide_type}",
        f"  TEACHING_GOAL: {goal}",
    ]
    if text:
        lines.append(f"  TEXT: {text}")
    return "\n".join(lines)


def load_descriptions(path: Path) -> dict:
    with path.open(encoding="utf-8") as f:
        return json.load(f)


def load_outline(path: Path) -> dict:
    with path.open(encoding="utf-8") as f:
        return json.load(f)


def descriptions_digest(path: Path | None) -> str:
    if not path or not path.is_file():
        return "(no PDF descriptions provided)"
    data = load_descriptions(path)
    pages = data.get("pages") or []
    return "\n\n".join(build_page_digest(p) for p in pages)


def strip_json_fence(text: str) -> str:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
        cleaned = re.sub(r"\s*```$", "", cleaned)
    return cleaned.strip()


def validate_outline(data: dict) -> None:
    if not isinstance(data.get("blocks"), list) or not data["blocks"]:
        raise ValueError("Outline JSON missing non-empty 'blocks' array")

    for block in data["blocks"]:
        if not block.get("block_id") or not block.get("slides"):
            raise ValueError(f"Block missing block_id or slides: {block!r}")
        for slide in block["slides"]:
            if not slide.get("app_slide_number") or not slide.get("title"):
                raise ValueError(f"Slide missing app_slide_number or title: {slide!r}")


def generate_outline(
    descriptions: dict,
    extra_context: str,
    lecture_id: str,
    lecture_title: str,
    model_name: str,
) -> dict:
    pages = descriptions.get("pages") or []
    if not pages:
        raise ValueError("Descriptions JSON has no pages")

    digests = "\n\n".join(build_page_digest(p) for p in pages)
    source_extra = descriptions.get("extra_context", "")

    user_prompt = f"""Design the LuxAI app lecture outline.

ADMIN / COURSEWORK — SKIP (not relevant online):
{ADMIN_SKIP_GUIDANCE}

APP CONTEXT:
{extra_context}

SOURCE PDF CONTEXT (from describe_slides):
{source_extra}

LECTURE:
  id: {lecture_id}
  title: {lecture_title}
  pdf_pages: {descriptions.get("total_pages", len(pages))}

PAGE DIGESTS ({len(pages)} PDF pages):
{digests}

{OUTLINE_SCHEMA_HINT}

Assign globally unique app_slide_number across all blocks (1, 2, 3, ...).
Cover all pedagogical content from the page digests (skip admin only).
Place problems wherever practice solidifies a concept; specify problem_spec and
visual_spec on every slide where they apply (use null only when truly N/A)."""

    resolved_model = resolve_model(model_name)
    client = make_genai_client()

    raw = generate_json_text(
        client,
        resolved_model,
        user_prompt,
        SYSTEM_INSTRUCTION,
        label="pass-1 outline",
    )

    outline = json.loads(strip_json_fence(raw))
    validate_outline(outline)

    outline.setdefault("lecture_id", lecture_id)
    outline.setdefault("lecture_title", lecture_title)
    outline["source_descriptions"] = descriptions.get("source_pdf", "")
    outline["source_descriptions_file"] = descriptions.get("_source_file", "")
    outline["extra_context"] = extra_context
    outline["model"] = resolved_model
    outline["generated_at"] = datetime.now(timezone.utc).isoformat()
    outline["source_pdf_pages"] = descriptions.get("total_pages", len(pages))

    return outline


def refine_outline(
    outline: dict,
    extra_context: str,
    model_name: str,
    source_outline_name: str,
    descriptions_path: Path | None,
) -> dict:
    outline_json = json.dumps(outline, indent=2, ensure_ascii=False)
    digests = descriptions_digest(descriptions_path)

    user_prompt = f"""Refine this LuxAI lecture outline (pass 2).

REFINEMENT GOALS:
{extra_context}

PASS-1 OUTLINE JSON:
{outline_json}

PDF PAGE DIGESTS (use when adding slides tied to source material):
{digests}

{OUTLINE_SCHEMA_HINT}
{REFINE_SCHEMA_EXTRA}

Return the full improved outline JSON. Be bold — students should feel this is interactive
and thoughtfully designed, not a slideshow."""

    resolved_model = resolve_model(model_name)
    client = make_genai_client()

    raw = generate_json_text(
        client,
        resolved_model,
        user_prompt,
        REFINE_SYSTEM_INSTRUCTION,
        label="pass-2 refine",
    )

    refined = json.loads(strip_json_fence(raw))
    validate_outline(refined)

    refined.setdefault("refinement_changelog", [])
    refined.setdefault("refinement_summary", "")
    refined["refined_from"] = source_outline_name
    refined["refinement_model"] = resolved_model
    refined["refinement_generated_at"] = datetime.now(timezone.utc).isoformat()
    refined["refinement_context"] = extra_context

    if "generated_at" not in refined and outline.get("generated_at"):
        refined["outline_pass1_generated_at"] = outline["generated_at"]

    return refined


def write_outline(path: Path, data: dict) -> None:
    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")


def count_slides(outline: dict) -> int:
    return sum(len(b.get("slides", [])) for b in outline.get("blocks", []))


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Generate and refine LuxAI app lecture outline JSON "
            "(pass 1 + pass 2 in one flow)."
        )
    )
    parser.add_argument(
        "--input",
        type=str,
        default=INPUT_JSON_FILENAME,
        dest="input_filename",
        help="Slide descriptions JSON in lectures/ (default: INPUT_JSON_FILENAME)",
    )
    parser.add_argument(
        "--output",
        type=str,
        default=OUTPUT_JSON_FILENAME,
        dest="output_filename",
        help="Pass-1 draft outline JSON in lectures/ (default: OUTPUT_JSON_FILENAME)",
    )
    parser.add_argument(
        "--refined-output",
        type=str,
        default=REFINED_OUTPUT_JSON_FILENAME,
        dest="refined_output_filename",
        help="Pass-2 refined outline JSON in lectures/ (default: REFINED_OUTPUT_JSON_FILENAME)",
    )
    parser.add_argument(
        "--no-refine",
        action="store_true",
        help="Run pass 1 only; skip refinement",
    )
    parser.add_argument(
        "--refine-only",
        action="store_true",
        help="Run pass 2 only; read pass-1 outline from --output",
    )
    parser.add_argument(
        "--no-descriptions",
        action="store_true",
        help="Do not attach PDF page digests to the refine prompt",
    )
    parser.add_argument(
        "--context",
        type=str,
        default=EXTRA_CONTEXT,
        help="Extra app-design context string",
    )
    parser.add_argument(
        "--lecture-id",
        type=str,
        default=LECTURE_ID,
        help="Lecture id slug (e.g. lecture01)",
    )
    parser.add_argument(
        "--lecture-title",
        type=str,
        default=LECTURE_TITLE,
        help="Human-readable lecture title",
    )
    parser.add_argument(
        "--model",
        type=str,
        default=default_outline_model(),
        help=(
            "Gemini model for pass 1 "
            f"(default: {GEMINI_MODEL}; env OUTLINE_GEMINI_MODEL overrides)"
        ),
    )
    parser.add_argument(
        "--refine-context",
        type=str,
        default=REFINE_CONTEXT,
        help="Refinement goals / creative direction for pass 2",
    )
    parser.add_argument(
        "--refine-model",
        type=str,
        default=default_refine_model(),
        help=(
            "Gemini model for pass 2 "
            f"(default: {GEMINI_MODEL}; env REFINE_GEMINI_MODEL or OUTLINE_GEMINI_MODEL)"
        ),
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    if args.refine_only and args.no_refine:
        print("Error: --refine-only and --no-refine cannot be used together", file=sys.stderr)
        return 1

    input_path = lectures_json_path(args.input_filename)
    output_path = lectures_json_path(args.output_filename)
    refined_output_path = lectures_json_path(args.refined_output_filename)

    run_pass1 = not args.refine_only
    run_pass2 = not args.no_refine

    try:
        outline: dict | None = None
        descriptions_path: Path | None = None

        if run_pass1:
            if not input_path.is_file():
                print(f"Error: descriptions file not found: {input_path}", file=sys.stderr)
                print(
                    "Run describe_slides.py first, e.g.:\n"
                    "  python agents/describe_slides.py",
                    file=sys.stderr,
                )
                return 1

            descriptions = load_descriptions(input_path)
            descriptions["_source_file"] = str(input_path.name)

            print(f"Pass 1 — loaded {len(descriptions.get('pages', []))} page descriptions")
            print(f"Generating draft outline with {resolve_model(args.model)} ...")

            outline = generate_outline(
                descriptions=descriptions,
                extra_context=args.context,
                lecture_id=args.lecture_id,
                lecture_title=args.lecture_title,
                model_name=args.model,
            )

            write_outline(output_path, outline)

            block_count = len(outline.get("blocks", []))
            slide_count = count_slides(outline)
            print(
                f"Pass 1 done — {block_count} block(s), "
                f"{slide_count} proposed app slide(s)"
            )
            print(f"Draft outline: {output_path}")

            if not args.no_descriptions and INCLUDE_DESCRIPTIONS_FOR_REFINE:
                descriptions_path = input_path

        if run_pass2:
            if outline is None:
                if not output_path.is_file():
                    print(f"Error: pass-1 outline not found: {output_path}", file=sys.stderr)
                    print(
                        "Run without --refine-only, or generate pass 1 first.",
                        file=sys.stderr,
                    )
                    return 1
                outline = load_outline(output_path)

            if descriptions_path is None and not args.no_descriptions:
                if INCLUDE_DESCRIPTIONS_FOR_REFINE and input_path.is_file():
                    descriptions_path = input_path
                elif INCLUDE_DESCRIPTIONS_FOR_REFINE:
                    print(
                        f"Note: descriptions not found ({input_path}), "
                        "refining without PDF digests"
                    )

            slide_count_before = count_slides(outline)
            print(f"\nPass 2 — refining {slide_count_before} app slide(s) from {output_path.name}")
            print(f"Refining with {resolve_model(args.refine_model)} ...")

            refined = refine_outline(
                outline=outline,
                extra_context=args.refine_context,
                model_name=args.refine_model,
                source_outline_name=output_path.name,
                descriptions_path=descriptions_path,
            )

            write_outline(refined_output_path, refined)

            slide_count_after = count_slides(refined)
            changes = len(refined.get("refinement_changelog", []))
            print(f"Pass 2 done — {slide_count_before} -> {slide_count_after} app slide(s)")
            print(f"Changelog entries: {changes}")
            if refined.get("refinement_summary"):
                print(f"Summary: {refined['refinement_summary']}")
            print(f"Refined outline: {refined_output_path}")

    except Exception as err:
        print(f"Error: {err}", file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
