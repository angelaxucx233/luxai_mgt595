import { useState } from 'react';

/**
 * Lecture example: two stocks with sigma^2 = 0.04 each, held 50/50.
 * sigma_p^2 = 0.02 + 0.02*rho. mode='static' shows the formulas without the dial.
 */
export default function DiversificationLab({ mode = 'interactive' }) {
  const [rho, setRho] = useState(0.5);
  const varP = 0.02 + 0.02 * rho;
  const pct = (varP / 0.04) * 100;

  if (mode === 'static') {
    return (
      <div className="w-full max-w-lg flex flex-col gap-3 text-sm">
        <div className="rounded-xl bg-yale-50 border border-yale-100 p-4 font-mono text-yale-800 text-center">
          R<sub>p</sub> = Σ wⱼ rⱼ = W′R &nbsp;·&nbsp; E[R<sub>p</sub>] = W′μ
        </div>
        <div className="rounded-xl bg-yale-50 border border-yale-100 p-4 font-mono text-yale-800 text-center">
          σ²<sub>p</sub> = w₁²σ₁² + w₂²σ₂² + <span className="bg-amber-100 px-1 rounded">2w₁w₂σ₁₂</span>
        </div>
        <div className="rounded-xl bg-white border border-slate-200 p-4 text-slate-700 text-center">
          ρ₁₂ = σ₁₂ / (σ₁σ₂), always between −1 and +1.
          <span className="block text-xs text-slate-500 mt-1">The highlighted cross term is where diversification lives.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-4">
      <div className="rounded-xl bg-yale-50 border border-yale-100 px-4 py-3 font-mono text-sm text-yale-800">
        σ²<sub>p</sub> = 0.02 + 0.02 × ρ = <span className="font-bold">{varP.toFixed(4)}</span>
      </div>

      <div className="w-full">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>each stock alone: 0.0400</span>
          <span>{pct.toFixed(0)}% of standalone risk</span>
        </div>
        <div className="w-full h-6 rounded-full bg-slate-200 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${rho < 0 ? 'bg-emerald-500' : 'bg-yale-600'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <label className="w-full flex items-center gap-3 text-sm text-slate-700">
        <span className="w-24">ρ = {rho.toFixed(2)}</span>
        <input
          type="range" min={-1} max={1} step={0.05} value={rho}
          onChange={(e) => setRho(Number(e.target.value))}
          className="flex-1 accent-yale-600"
        />
      </label>

      <div className="grid grid-cols-5 gap-1 w-full text-center text-[11px]">
        {[[1, '0.0400', 'no benefit'], [0.5, '0.0300', '−25%'], [0, '0.0200', 'halved'], [-0.5, '0.0100', '−75%'], [-1, '0.0000', 'eliminated']].map(([r, v, note]) => (
          <button
            key={r}
            onClick={() => setRho(Number(r))}
            className={`rounded-lg border p-1.5 transition-colors ${Math.abs(rho - r) < 0.026 ? 'border-yale-600 bg-yale-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
          >
            <p className="font-semibold text-yale-700">ρ={r}</p>
            <p className="tabular-nums text-slate-700">{v}</p>
            <p className="text-slate-500">{note}</p>
          </button>
        ))}
      </div>

      <p className="text-xs text-slate-500 text-center">
        Expected return never moves. With N assets, σ²_p = W′VW — at N = 100 that is 100 variances and 9,900 covariances.
      </p>
    </div>
  );
}
