#!/usr/bin/env python3
"""Backward-compat shim — refinement lives in outline_lecture.py (pass 2)."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from outline_lecture import main  # noqa: E402

if __name__ == "__main__":
    if "--refine-only" not in sys.argv:
        sys.argv.insert(1, "--refine-only")
    raise SystemExit(main())
