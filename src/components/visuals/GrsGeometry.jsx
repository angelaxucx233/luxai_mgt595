import { useState } from 'react';

/**
 * Lecture 2 — GRS geometry. Frontier in excess-return space; drag the market's
 * inefficiency; rays from the origin; live J1 for chosen T, N with F-verdict.
 * Props: showFormula (derivation card), summaryMode (takeaway card).
 */
export default function GrsGeometry({ showFormula = false, summaryMode = false }) {
  const [gap, setGap] = useState(0.10);       // theta_q − theta_m
  const [T, setT] = useState(342);
  const [N, setN] = useState(25);
  const thQ = 0.25;
  const thM = Math.max(0.02, thQ - gap);
  const j1 = ((T - N - 1) / N) * (thQ * thQ - thM * thM) / (1 + thM * thM);
  // rough 5% F critical values by N (df2 large)
  const fCrit = N <= 5 ? 2.26 : N <= 10 ? 1.91 : N <= 25 ? 1.55 : 1.4;
  const reject = j1 > fCrit;

  const X = (s) => 30 + (s / 2.4) * 330;
  const Y = (mu) => 168 - (mu / 0.72) * 148;
  const frontier = [];
  for (let mu = 0.12; mu <= 0.62; mu += 0.02) frontier.push(`${X(Math.sqrt(0.36 + 5.5 * (mu - 0.24) ** 2))},${Y(mu)}`);
  const sigQ = 1.0; // tangency at sigma where slope thQ: pick point on ray
  const M = { sig: 1.35, mu: thM * 1.35 };

  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      {showFormula && (
        <div className="w-full rounded-xl bg-yale-50 border border-yale-100 p-3 text-[11px] text-yale-900 font-mono flex flex-col gap-1">
          <p>N regressions: rᵢ−r_f = αᵢ + βᵢ(R_M−r_f) + εᵢ · H₀: all αᵢ = 0</p>
          <p>J₁ = [(T−N−1)/N] · α̂′Σ̂⁻¹α̂ / (1+θ̂²_m) ~ F(N, T−N−1)</p>
          <p className="font-bold">Identity: α′Σ⁻¹α = θ²_q − θ²_m — the test measures a Sharpe gap.</p>
        </div>
      )}
      <svg viewBox="0 0 400 186" className="w-full">
        <line x1="30" y1="168" x2="390" y2="168" stroke="#94a3b8" /><line x1="30" y1="168" x2="30" y2="12" stroke="#94a3b8" />
        <text x="386" y="180" textAnchor="end" fontSize="9" fill="#a3b1c2">σ</text>
        <text x="34" y="12" fontSize="9" fill="#a3b1c2">E[r]−r_f</text>
        <polyline points={frontier.join(' ')} fill="none" stroke="#cbd5e1" strokeWidth="2" />
        {/* tangency ray */}
        <line x1={X(0)} y1={Y(0)} x2={X(2.3)} y2={Y(thQ * 2.3)} stroke="#d97706" strokeWidth="2.4" />
        <circle cx={X(sigQ)} cy={Y(thQ * sigQ)} r="5" fill="#d97706" stroke="#3b82f6" strokeWidth="1.2" />
        <text x={X(sigQ) - 4} y={Y(thQ * sigQ) - 8} fontSize="9.5" fill="#f59e0b" fontWeight="700">q (tangency)</text>
        {/* market ray */}
        <line x1={X(0)} y1={Y(0)} x2={X(2.3)} y2={Y(thM * 2.3)} stroke="#3b82f6" strokeWidth="2.4" />
        <circle cx={X(M.sig)} cy={Y(M.mu)} r="5" fill="#3b82f6" stroke="white" strokeWidth="1.2" />
        <text x={X(M.sig) + 8} y={Y(M.mu) + 4} fontSize="9.5" fill="#93b8e8" fontWeight="700">M</text>
        {/* sigma=1 verticals */}
        <line x1={X(1)} y1={Y(0)} x2={X(1)} y2={Y(thQ)} stroke="#e11d48" strokeDasharray="4 3" strokeWidth="1.4" />
        <circle cx={X(1)} cy={Y(thQ)} r="3.4" fill="#d97706" />
        <circle cx={X(1)} cy={Y(thM)} r="3.4" fill="#3b82f6" />
        <text x={X(1) + 6} y={Y(thQ) - 4} fontSize="8.5" fill="#f59e0b">θ_q = {thQ.toFixed(2)}</text>
        <text x={X(1) + 6} y={Y(thM) + 12} fontSize="8.5" fill="#93b8e8">θ_m = {thM.toFixed(2)}</text>
        <text x={X(1)} y={Y(0) + 12} textAnchor="middle" fontSize="8.5" fill="#a3b1c2">σ=1</text>
      </svg>
      <label className="w-full text-xs text-slate-600 flex items-center gap-2">
        <span className="w-52">Market inefficiency θ_q−θ_m = <b className="text-yale-900">{gap.toFixed(2)}</b></span>
        <input type="range" min="0" max="0.2" step="0.005" value={gap} onChange={(e) => setGap(+e.target.value)} className="flex-1 accent-rose-600" />
      </label>
      <div className="w-full flex gap-2">
        <label className="flex-1 text-xs text-slate-600 flex items-center gap-2">
          <span className="w-16">T = <b className="text-yale-900">{T}</b></span>
          <input type="range" min="60" max="720" step="6" value={T} onChange={(e) => setT(+e.target.value)} className="flex-1 accent-yale-700" />
        </label>
        <label className="flex-1 text-xs text-slate-600 flex items-center gap-2">
          <span className="w-16">N = <b className="text-yale-900">{N}</b></span>
          <input type="range" min="5" max="40" step="5" value={N} onChange={(e) => setN(+e.target.value)} className="flex-1 accent-yale-700" />
        </label>
      </div>
      <div className={`w-full rounded-xl px-3 py-2 text-[11.5px] font-mono border ${reject ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
        J₁ = [({T}−{N}−1)/{N}]·({(thQ * thQ).toFixed(4)}−{(thM * thM).toFixed(4)})/{(1 + thM * thM).toFixed(4)} = <b>{j1.toFixed(2)}</b> vs F₅% ≈ {fCrit} ⟹ <b>{reject ? 'REJECT the model' : 'fail to reject'}</b>
      </div>
      {summaryMode && (
        <div className="w-full rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-[11px] text-amber-900">
          Every asset pricing test — FM cross-sections, GRS time-series, factor models — is ultimately a claim that <b>some portfolio is mean–variance efficient</b>. The CAPM nominates the market; FF93 nominates a mix of market, size and value portfolios. The geometry above is the whole argument.
        </div>
      )}
      <p className="text-[11px] text-slate-500 leading-snug">Rejecting α = 0 is identical to measuring how far M's ray sits below the tangency ray. Same gap, more months ⟹ bigger J₁: precision makes distance damning.</p>
    </div>
  );
}
