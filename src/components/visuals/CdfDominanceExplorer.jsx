import { useState } from 'react';

/** Logistic CDFs. A fixed; B gets a shift and a spread slider. Verdict banner reports FSD / SSD. */
export default function CdfDominanceExplorer() {
  const [shift, setShift] = useState(-2.5); // B's center relative to A's (A center = 5)
  const [spread, setSpread] = useState(1.0); // B's scale multiplier (1 = same as A)
  const aC = 5, aK = 1.5;
  const bC = 5 + shift;
  const bK = aK / spread;
  const F = (x, c, k) => 1 / (1 + Math.exp(-k * (x - c)));

  // numeric checks on a grid
  const N = 200;
  let fsdAoverB = true; // F_A <= F_B everywhere
  let ssdAoverB = true; // integral of (F_B - F_A) >= 0 everywhere
  let integ = 0;
  const dx = 10 / N;
  for (let i = 0; i <= N; i++) {
    const x = i * dx;
    const fa = F(x, aC, aK), fb = F(x, bC, bK);
    if (fa > fb + 1e-6) fsdAoverB = false;
    integ += (fb - fa) * dx;
    if (integ < -1e-4) ssdAoverB = false;
  }

  const X = (x) => 40 + (x / 10) * 350;
  const Y = (p) => 200 - p * 175;
  const path = (c, k) =>
    Array.from({ length: 101 }, (_, i) => {
      const x = (i / 100) * 10;
      return `${i === 0 ? 'M' : 'L'}${X(x).toFixed(1)},${Y(F(x, c, k)).toFixed(1)}`;
    }).join(' ');

  const verdict = fsdAoverB
    ? { text: 'A first-order dominates B — every investor who prefers more to less picks A.', cls: 'bg-emerald-50 text-emerald-800 border-emerald-200' }
    : ssdAoverB
      ? { text: 'FSD fails (the CDFs cross), but A still second-order dominates B — all risk-averse investors pick A.', cls: 'bg-amber-50 text-amber-800 border-amber-200' }
      : { text: 'Neither dominance holds — the ranking now depends on the investor\'s utility function.', cls: 'bg-rose-50 text-rose-700 border-rose-200' };

  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-3">
      <svg viewBox="0 0 420 220" className="w-full">
        <line x1="40" y1="200" x2="400" y2="200" stroke="#94a3b8" />
        <line x1="40" y1="200" x2="40" y2="20" stroke="#94a3b8" />
        <text x="36" y="30" textAnchor="end" fontSize="10" fill="#a3b1c2">1</text>
        <text x="36" y="203" textAnchor="end" fontSize="10" fill="#a3b1c2">0</text>
        <text x="398" y="214" textAnchor="end" fontSize="10" fill="#a3b1c2">return r</text>
        <path d={path(aC, aK)} fill="none" stroke="#3b82f6" strokeWidth="2.5" />
        <path d={path(bC, bK)} fill="none" stroke="#e11d48" strokeWidth="2.5" />
        <text x={X(aC) + 60} y={Y(0.86)} fontSize="12" fontWeight="700" fill="#93b8e8">F_A</text>
        <text x={X(bC) - 14} y={Y(0.6)} fontSize="12" fontWeight="700" fill="#fb7185">F_B</text>
      </svg>

      <label className="w-full flex items-center gap-3 text-sm text-slate-700">
        <span className="w-40">Shift B: {shift.toFixed(1)}</span>
        <input type="range" min={-3} max={1.5} step={0.1} value={shift}
          onChange={(e) => setShift(Number(e.target.value))} className="flex-1 accent-yale-600" />
      </label>
      <label className="w-full flex items-center gap-3 text-sm text-slate-700">
        <span className="w-40">Spread B: ×{spread.toFixed(1)}</span>
        <input type="range" min={0.6} max={3} step={0.1} value={spread}
          onChange={(e) => setSpread(Number(e.target.value))} className="flex-1 accent-yale-600" />
      </label>

      <div className={`w-full rounded-xl border p-3 text-sm ${verdict.cls}`}>{verdict.text}</div>
      <p className="text-xs text-slate-500">
        FSD: F_A ≤ F_B everywhere. SSD: the shaded area between the CDFs, accumulated left to right, never goes negative.
      </p>
    </div>
  );
}
