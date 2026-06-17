#!/usr/bin/env python3
"""
LuxAI agent — build src/data/lectures/{lecture_id}Slides.js from a refined outline JSON.

Pipeline: PDF -> describe_slides.py -> outline_lecture.py -> build_slides.py

Usage:
  python agents/build_slides.py --outline lecture04_outline_refined.json --lecture-id lecture04
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PROJECT_ROOT = ROOT.parent
LECTURES_DIR = PROJECT_ROOT / "lectures"
SLIDES_DIR = PROJECT_ROOT / "src" / "data" / "lectures"

# Map outline visual_spec.component names to existing SlideVisual registry ids.
VISUAL_MAP: dict[str, str | None] = {
    "ProbabilityTreeBuilder": "InteractiveTreeDiagram",
    "CoefficientTable": "FairCoinRow",
    "FormulaHighlighter": "MathTooltipText",
    "DragDropMath": "MathTooltipText",
    "CoinGrid": "FairCoinRow",
    "VarianceParabola": "ProbabilitySlider",
    "BinomialDistributionPlotter": "MathAccumulator",
    "InteractiveHistogramSelector": "ComplementBar",
    "RiskGrid": "ScenarioCardGrid",
    "TasteTestCurve": "ProbabilitySlider",
    "WinRateGauge": "ScenarioCompare",
    "StepByStepMath": "MathTooltipText",
    "LLNConvergenceSimulator": "CoinTossSim",
    "NestedProbabilityTree": "StaticTreeDiagram",
    "TransitionAnimation": None,
}

# Map outline problem_template_id to (template_id, default problemParams).
PROBLEM_MAP: dict[str, tuple[str, dict] | None] = {
    "binomial_coefficient_discovery": None,
    "drag_drop_formula_assembly": None,
    "binomial_pmf_calculator": (
        "probability_fraction",
        {
            "prompt": "Fair coin, 10 tosses. P(exactly 5 heads)? Enter as a fraction or decimal equivalent.",
            "answer": "252/1024",
            "altAnswers": ["63/256", "0.2461"],
        },
    ),
    "binomial_cdf_range": (
        "probability_fraction",
        {
            "prompt": "Use the complement rule when helpful. Enter your probability as n/d.",
            "answer": "1/4",
            "altAnswers": ["0.264"],
        },
    ),
    "nested_probability_binomial": (
        "probability_fraction",
        {
            "prompt": "Two-step: find P(convict one trial), then P(acquitted all 7). Enter final as n/d.",
            "answer": "893025/20000000",
            "altAnswers": ["0.045"],
        },
    ),
}

VISUAL_PROPS: dict[str, dict] = {
    "FairCoinRow": {"coinCount": 3, "faces": ["heads", "tails"]},
}


def js_string(value: str) -> str:
    return json.dumps(value, ensure_ascii=False)


def student_body(summary: str, title: str) -> str:
    """Turn outline designer summary into second-person slide copy."""
    if not summary:
        return title
    text = summary.strip()
    replacements = [
        (r"\bStudents manually\b", "You will"),
        (r"\bStudents predict\b", "Predict"),
        (r"\bStudents interactively discover\b", "Explore and discover"),
        (r"\bStudents must infer\b", "You need to infer"),
        (r"\bStudents\b", "You"),
        (r"\bIntroduces\b", "Here is"),
        (r"\bApplication of\b", "Apply"),
        (r"\bExtending the logic\b", "Extend the logic"),
        (r"\bIntroduction to\b", "Start with"),
        (r"\bReplaces Excel syntax with\b", "Use"),
        (r"\bTeaches calculating\b", "Calculate"),
        (r"\bMathematical derivation showing\b", "This shows"),
        (r"\bVisual summary of\b", "This shows"),
        (r"\bQuick recap of\b", "Recap:"),
        (r"\bA complex problem requiring\b", "This problem uses"),
        (r"\bThe 'Going Pro' problem\. Calculates\b", "Calculate"),
    ]
    for pattern, repl in replacements:
        text = re.sub(pattern, repl, text, flags=re.IGNORECASE)
    text = re.sub(r"\s+", " ", text).strip()
    if text.endswith("."):
        return text
    return text + "."


def student_footnote(interactivity: str | None, slide_type: str) -> str | None:
    """Student-directed call to action — not designer spec."""
    if not interactivity:
        if slide_type == "problem":
            return "Enter your answer below — tap Lux for a hint."
        return None
    text = interactivity.strip()
    replacements = [
        (r"\bStudents attach\b", "Attach"),
        (r"\bStudents fill\b", "Fill in"),
        (r"\bStudents input\b", "Enter"),
        (r"\bStudents predict\b", "Predict"),
        (r"\bStudents manually\b", ""),
        (r"\bInput fields for\b", "Enter"),
        (r"\bDrag-and-drop tree building\.?\s*", "Build the tree — "),
        (r"\bProblem-solving input\.?\s*", ""),
        (r"\bMulti-step problem:?\s*", ""),
        (r"\bTwo-part problem input\.?\s*", ""),
        (r"\bNone\b", ""),
    ]
    for pattern, repl in replacements:
        text = re.sub(pattern, repl, text, flags=re.IGNORECASE)
    text = re.sub(r"\s+", " ", text).strip()
    if not text or text.lower() in {"none", "n/a"}:
        if slide_type == "problem":
            return "Enter your answer below — tap Lux for a hint."
        return None
    if not text[0].isupper():
        text = text[0].upper() + text[1:]
    if not text.endswith("."):
        text += "."
    return text


def student_narration(slide: dict, title: str, slide_type: str) -> str:
    """Lux speaking TO the student — never meta notes about what Lux does."""
    spec = slide.get("problem_spec") or {}
    if slide_type == "problem" and spec.get("prompt"):
        return f"[encouraging] {spec['prompt']}"
    if slide_type == "recap":
        return f"[friendly] Great work on this lecture. [encouraging] {title} — ask Lux if you want more practice."
    templates = {
        "explain": f"[clear] {title}. [thoughtful] Read through, then tap Lux if anything is unclear.",
        "interactive": f"[curious] {title}. [encouraging] Try the interactive — explore before moving on.",
        "problem": f"[encouraging] {title}. Take your time — tap Lux if you want a hint.",
    }
    return templates.get(slide_type, f"[friendly] {title}.")


def tutor_context(slide: dict, block_id: str, title: str) -> str:
    """Backend-only notes for Lux (designer + tutor guidance)."""
    parts = [f"BLOCK {block_id} — {title}."]
    for key in ("system_prompt_notes", "lux_integration"):
        val = slide.get(key)
        if val:
            parts.append(str(val).strip())
    spec = slide.get("problem_spec") or {}
    if spec.get("prompt"):
        parts.append(f"Problem: {spec['prompt']}")
    if spec.get("correct_answer_form"):
        parts.append(f"Expected: {spec['correct_answer_form']}")
    return " ".join(parts)


def flatten_slides(outline: dict) -> list[dict]:
    slides: list[dict] = []
    for block in outline.get("blocks", []):
        for slide in block.get("slides", []):
            slides.append({**slide, "block_id": block.get("block_id", "?")})
    slides.sort(key=lambda s: s.get("app_slide_number", 0))
    return slides


def resolve_visual(slide: dict) -> tuple[str | None, dict | None]:
    visual_spec = slide.get("visual_spec") or {}
    component = visual_spec.get("component") or slide.get("visual", "")
    mapped = VISUAL_MAP.get(component)
    if mapped is None and component:
        for key, val in VISUAL_MAP.items():
            if key.lower() in component.lower():
                mapped = val
                break
    if mapped is None and slide.get("visual"):
        label = slide["visual"]
        for key, val in VISUAL_MAP.items():
            if key.lower() in label.lower().replace(" ", ""):
                mapped = val
                break
    props = VISUAL_PROPS.get(mapped) if mapped else None
    if mapped == "FairCoinRow" and "n=10" in (slide.get("content_summary") or ""):
        props = {"coinCount": 10, "faces": ["heads", "tails"]}
    return mapped, props


def resolve_problem(slide: dict) -> tuple[str | None, dict | None]:
    template_id = slide.get("problem_template_id")
    if not template_id:
        return None, None
    mapped = PROBLEM_MAP.get(template_id)
    if mapped is None:
        return None, None
    tpl_id, params = mapped
    spec = slide.get("problem_spec") or {}
    merged = {**params}
    if spec.get("prompt"):
        merged["prompt"] = spec["prompt"]
    if spec.get("correct_answer_form"):
        answer = spec["correct_answer_form"]
        if "/" not in answer and answer.replace(".", "", 1).isdigit():
            merged.setdefault("altAnswers", []).append(answer)
        else:
            merged["answer"] = answer.split(",")[0].strip()
    return tpl_id, merged


def slide_to_js(slide: dict, block_id: str) -> str:
    slide_id = slide["app_slide_number"]
    slide_type = slide.get("type", "explain")
    title = slide.get("title", f"Slide {slide_id}")
    context_label = f"Block {block_id} · {title[:40]}"
    summary = slide.get("content_summary") or ""

    visual, visual_props = resolve_visual(slide)
    problem_tpl, problem_params = resolve_problem(slide)

    if slide_type == "problem" and not problem_tpl:
        slide_type = "interactive"

    lines = [
        "  {",
        f"    slideId: {slide_id},",
        f"    type: {js_string(slide_type)},",
        f"    title: {js_string(title)},",
        f"    contextLabel: {js_string(context_label)},",
        f"    blockId: {js_string(block_id)},",
        "    module: 'binomial',",
    ]

    if visual:
        lines.append(f"    visual: {js_string(visual)},")
        if visual_props:
            props_json = json.dumps(visual_props, ensure_ascii=False, indent=2)
            props_indented = "\n".join("    " + line for line in props_json.splitlines())
            lines.append(f"    visualProps: {props_indented.strip()},")

    if slide_type == "problem" and problem_tpl:
        lines.append(f"    problemTemplateId: {js_string(problem_tpl)},")
        params_json = json.dumps(problem_params or {}, ensure_ascii=False, indent=2)
        params_indented = "\n".join("    " + line for line in params_json.splitlines())
        lines.append(f"    problemParams: {params_indented.strip()},")

    narration = student_narration(slide, title, slide_type)
    lines.append(f"    narration: {js_string(narration)},")
    lines.append(f"    systemPromptContext: {js_string(tutor_context(slide, block_id, title))},")

    eyebrow = (slide.get("visual") or f"Block {block_id}")[:60]
    body = student_body(summary, title)
    footnote = student_footnote(slide.get("interactivity"), slide_type)
    content_lines = [
        "    content: {",
        f"      eyebrow: {js_string(eyebrow)},",
        f"      heading: {js_string(title)},",
        f"      body: {js_string(body)},",
    ]
    if footnote:
        content_lines.append(f"      footnote: {js_string(footnote)},")
    content_lines.append("    },")
    lines.extend(content_lines)
    lines.append("  },")
    return "\n".join(lines)


def build_slides_js(outline: dict, lecture_id: str) -> str:
    lecture_title = outline.get("lecture_title", lecture_id)
    export_name = f"{lecture_id}Slides"
    slides = flatten_slides(outline)
    slide_chunks = [slide_to_js(s, s.get("block_id", "?")) for s in slides]

    header = f"""/**
 * {lecture_title} — generated from lectures/{lecture_id}_outline_refined.json
 * Regenerate: python agents/build_slides.py --outline {lecture_id}_outline_refined.json
 */

export const {export_name} = [
"""
    footer = "];\n"
    return header + "\n".join(slide_chunks) + footer


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Build lecture slides JS from outline JSON.")
    parser.add_argument(
        "--outline",
        default="lecture04_outline_refined.json",
        help="Outline JSON filename in lectures/",
    )
    parser.add_argument("--lecture-id", default="lecture04", help="Lecture id slug")
    parser.add_argument(
        "--output",
        default=None,
        help="Output path (default: src/data/lectures/{lecture_id}Slides.js)",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    outline_path = LECTURES_DIR / args.outline
    if not outline_path.is_file():
        print(f"Error: outline not found: {outline_path}", file=sys.stderr)
        return 1

    outline = json.loads(outline_path.read_text(encoding="utf-8"))
    js = build_slides_js(outline, args.lecture_id)

    output_path = Path(args.output) if args.output else SLIDES_DIR / f"{args.lecture_id}Slides.js"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(js, encoding="utf-8")

    slide_count = len(flatten_slides(outline))
    print(f"Built {slide_count} slide(s) -> {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
