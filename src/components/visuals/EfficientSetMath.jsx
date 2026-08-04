import { useState } from 'react';

/**
 * Frontier from the fundamental scalars: sigma^2 = (a - 2b r + c r^2)/(ac - b^2).
 * MVP at r = b/c with sigma = 1/sqrt(c).
 * showDerivation: derivation storyboard. summaryMode: MVP vs tangency formula cards.
 */
export default function EfficientSetMath({ showDerivation = false, summaryMode = false }) {
  const [a, setA] = useState(0.2);
  const [b, setB] = useState(2.0);
  const [c, setC] = useState(25);

  if (summaryMode) {
    return (
      <div className="w-full max-w-lg grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl border border-yale-200 bg-yale-50 p-4">
          <p className="font-bold text-yale-800 mb-2">MVP</p>
          <p className="font-mono text-yale-700 text-center py-2">W = V⁻¹1 / (1′V⁻¹1)</p>
          <p className="text-xs text-slate-600">Equal covariance with every asset: Cov(rᵢ, R_MVP) = 1/c for all i. Needs only V.</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="font-bold text-amber-800 mb-2">Tangency</p>
          <p className="font-mono text-amber-800 text-center py-2">W = V⁻¹(R − r_f1) / (1′V⁻¹(R − r_f1))</p>
          <p className="text-xs text-slate-600">Max Sharpe. Equal (E[rᵢ] − r_f)/Cov(rᵢ, R_T) across assets. Needs V and the means.</p>
        </div>
        <div className="sm:col-span-2 rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-600 text-center">
          Beta representation: R = r_f·1 + β(r_T − r_f), with β = VW_T/σ²_T — the CAPM in disguise.
        </div>
      </div>
    );
  }

  const disc = a * c - b * b;
  const rMvp = b / c;
  const sMvp = Math.sqrt(1 / c);
  const sigOf = (r) => Math.sqrt(Math.max(0, (a - 2 * b * r + c * r * r) / disc));

  const X = (s) => 50 + (s / 0.45) * 350;
  const Y = (r) => 200 - ((r - (-0.02)) / 0.22) * 180;
  const pts = [];
  for (let r = -0.02; r <= 0.2; r += 0.002) pts.push(`${pts.length === 0 ? 'M' : 'L'}${X(sigOf(r)).toFixed(1)},${Y(r).toFixed(1)}`);

  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-3">
      {showDerivation && (
        <div className="w-full rounded-xl bg-yale-50 border border-yale-100 p-3 text-xs text-yale-900 font-mono flex flex-col gap-1">
          <p>min W′VW &nbsp;s.t.&nbsp; W′R = r_p, &nbsp;W′1 = 1</p>
          <p>⟹ 2VW = λ₁R + λ₂1 &nbsp;⟹&nbsp; W* = V⁻¹[R 1]A⁻¹(r_p, 1)′</p>
          <p>A = [R 1]′V⁻¹[R 1] = [[a, b], [b, c]]</p>
          <p className="font-bold">⟹ σ²_p = (a − 2b·r_p + c·r_p²)/(ac − b²)</p>
        </div>
      )}
      {disc <= 0 ? (
        <div className="w-full rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          ac − b² = {disc.toFixed(2)} ≤ 0 — the frontier degenerates. Raise a or c, or lower b.
        </div>
      ) : (
        <svg viewBox="0 0 420 218" className="w-full">
          <line x1="50" y1="200" x2="405" y2="200" stroke="#94a3b8" />
          <line x1="50" y1="200" x2="50" y2="15" stroke="#94a3b8" />
          <text x="400" y="213" textAnchor="end" fontSize="10" fill="#64748b">σ_p</text>
          <text x="46" y="12" textAnchor="end" fontSize="10" fill="#64748b">r_p</text>
          <path d={pts.join(' ')} fill="none" stroke="#00356b" strokeWidth="2.5" />
          <circle cx={X(sMvp)} cy={Y(rMvp)} r="6" fill="#d97706" stroke="#00356b" strokeWidth="1" />
          <text x={X(sMvp) + 10} y={Y(rMvp) + 4} fontSize="11" fill="#b45309" fontWeight="700">
            MVP (σ = {(sMvp * 100).toFixed(1)}%, r = {(rMvp * 100).toFixed(1)}%)
          </text>
        </svg>
      )}
      <div className="w-full grid grid-cols-1 gap-2">
        <label className="flex items-center gap-3 text-sm text-slate-700">
          <span className="w-40 font-mono">a = {a.toFixed(2)}</span>
          <input type="range" min={0.05} max={0.6} step={0.01} value={a} onChange={(e) => setA(Number(e.target.value))} className="flex-1 accent-yale-600" />
        </label>
        <label className="flex items-center gap-3 text-sm text-slate-700">
          <span className="w-40 font-mono">b = {b.toFixed(2)}</span>
          <input type="range" min={0.5} max={4} step={0.05} value={b} onChange={(e) => setB(Number(e.target.value))} className="flex-1 accent-yale-600" />
        </label>
        <label className="flex items-center gap-3 text-sm text-slate-700">
          <span className="w-40 font-mono">c = {c.toFixed(0)}</span>
          <input type="range" min={10} max={80} step={1} value={c} onChange={(e) => setC(Number(e.target.value))} className="flex-1 accent-yale-600" />
        </label>
      </div>
      <p className="text-xs text-slate-500 text-center font-mono">
        r_MVP = b/c = {(rMvp * 100).toFixed(1)}% · σ_MVP = 1/√c = {(sMvp * 100).toFixed(1)}% · ac − b² = {disc.toFixed(2)}
      </p>
    </div>
  );
}
