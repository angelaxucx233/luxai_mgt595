import { useState } from 'react';

/**
 * Three-mode frontier explorer.
 *  mode='cal'      — one risky (S&P: E=7.9, σ=12.1) + riskless (rf=5.5); weight slider incl. leverage.
 *  mode='tworisky' — assets (σ=18,E=6) and (σ=15,E=12); ρ slider bends the feasible curve.
 *  mode='many'     — hyperbola bullet + rf + tangency ray; toggle to highlight the efficient half.
 */
export default function FrontierExplorer({ mode = 'cal' }) {
  if (mode === 'cal') return <CalMode />;
  if (mode === 'tworisky') return <TwoRiskyMode />;
  return <ManyMode />;
}

function Axes({ xmax, ymin, ymax, xlab = 'σ (%)', ylab = 'E (%)' }) {
  return (
    <>
      <line x1="45" y1="205" x2="405" y2="205" stroke="#94a3b8" />
      <line x1="45" y1="205" x2="45" y2="15" stroke="#94a3b8" />
      <text x="400" y="218" textAnchor="end" fontSize="10" fill="#64748b">{xlab}</text>
      <text x="42" y="12" textAnchor="end" fontSize="10" fill="#64748b">{ylab}</text>
    </>
  );
}

function CalMode() {
  const [w, setW] = useState(0.5);
  const rf = 5.5, Es = 7.9, Ss = 12.1;
  const E = w * Es + (1 - w) * rf;
  const S = Math.abs(w) * Ss;
  const sharpe = (Es - rf) / Ss;
  const X = (s) => 45 + (s / 18) * 360;
  const Y = (e) => 205 - ((e - 4) / 7) * 185;
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-3">
      <svg viewBox="0 0 420 222" className="w-full">
        <Axes />
        <line x1={X(0)} y1={Y(rf)} x2={X(17)} y2={Y(rf + sharpe * 17)} stroke="#d97706" strokeWidth="2.5" />
        <circle cx={X(0)} cy={Y(rf)} r="5" fill="#d97706" />
        <text x={X(0) + 8} y={Y(rf) + 14} fontSize="10" fill="#b45309" fontWeight="600">T-bills 5.5%</text>
        <circle cx={X(Ss)} cy={Y(Es)} r="5" fill="#00356b" />
        <text x={X(Ss)} y={Y(Es) - 10} textAnchor="middle" fontSize="10" fill="#00356b" fontWeight="700">S&amp;P 500</text>
        <circle cx={X(S)} cy={Y(E)} r="6" fill="#e11d48" stroke="white" strokeWidth="1.5" />
        <text x={X(S) + 9} y={Y(E) + 4} fontSize="10" fill="#e11d48" fontWeight="700">you</text>
      </svg>
      <label className="w-full flex items-center gap-3 text-sm text-slate-700">
        <span className="w-40">w in S&amp;P = {(w * 100).toFixed(0)}%</span>
        <input type="range" min={0} max={1.5} step={0.05} value={w}
          onChange={(e) => setW(Number(e.target.value))} className="flex-1 accent-yale-600" />
      </label>
      <div className="grid grid-cols-3 gap-2 w-full text-center text-xs">
        <div className="rounded-lg bg-yale-50 p-2"><p className="text-slate-500">E[R_p]</p><p className="font-bold text-yale-700 tabular-nums">{E.toFixed(2)}%</p></div>
        <div className="rounded-lg bg-yale-50 p-2"><p className="text-slate-500">σ_p</p><p className="font-bold text-yale-700 tabular-nums">{S.toFixed(2)}%</p></div>
        <div className="rounded-lg bg-amber-50 p-2"><p className="text-slate-500">Sharpe (slope)</p><p className="font-bold text-amber-700 tabular-nums">{sharpe.toFixed(3)}</p></div>
      </div>
      {w > 1 && (
        <p className="text-xs text-rose-600 font-medium">
          Leverage: {((w - 1) * 100).toFixed(0)}% borrowed at r_f — the T-bill position is −{((w - 1) * 100).toFixed(0)}%.
        </p>
      )}
    </div>
  );
}

function TwoRiskyMode() {
  const [rho, setRho] = useState(0.5);
  const a1 = { s: 18, e: 6 }, a2 = { s: 15, e: 12 };
  const pts = Array.from({ length: 101 }, (_, i) => {
    const w1 = i / 100;
    const w2 = 1 - w1;
    const v = w1 * w1 * a1.s ** 2 + w2 * w2 * a2.s ** 2 + 2 * w1 * w2 * rho * a1.s * a2.s;
    return { s: Math.sqrt(Math.max(0, v)), e: w1 * a1.e + w2 * a2.e };
  });
  // MVP (leftmost)
  const mvp = pts.reduce((m, p) => (p.s < m.s ? p : m), pts[0]);
  const X = (s) => 45 + (s / 22) * 360;
  const Y = (e) => 205 - ((e - 4) / 10) * 185;
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${X(p.s).toFixed(1)},${Y(p.e).toFixed(1)}`).join(' ');
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-3">
      <svg viewBox="0 0 420 222" className="w-full">
        <Axes />
        <path d={path} fill="none" stroke="#00356b" strokeWidth="2.5" />
        <circle cx={X(a1.s)} cy={Y(a1.e)} r="5" fill="#00356b" />
        <text x={X(a1.s) + 8} y={Y(a1.e) + 4} fontSize="10" fill="#00356b" fontWeight="600">Asset 1 (18, 6)</text>
        <circle cx={X(a2.s)} cy={Y(a2.e)} r="5" fill="#00356b" />
        <text x={X(a2.s) + 8} y={Y(a2.e) - 6} fontSize="10" fill="#00356b" fontWeight="600">Asset 2 (15, 12)</text>
        <circle cx={X(mvp.s)} cy={Y(mvp.e)} r="5" fill="#d97706" />
        <text x={X(mvp.s) - 8} y={Y(mvp.e) + 4} textAnchor="end" fontSize="10" fill="#b45309" fontWeight="700">MVP</text>
      </svg>
      <label className="w-full flex items-center gap-3 text-sm text-slate-700">
        <span className="w-28">ρ = {rho.toFixed(2)}</span>
        <input type="range" min={-1} max={1} step={0.05} value={rho}
          onChange={(e) => setRho(Number(e.target.value))} className="flex-1 accent-yale-600" />
      </label>
      <p className="text-xs text-slate-500 text-center">
        MVP: σ ≈ {mvp.s.toFixed(1)}%, E ≈ {mvp.e.toFixed(1)}%. {rho <= -0.999 ? 'At ρ = −1 the hedge is perfect: σ = 0 at w₁ = 15/33 ≈ 45.5%.' : 'Lower ρ bends the curve further left.'}
      </p>
    </div>
  );
}

function ManyMode() {
  const [showEff, setShowEff] = useState(true);
  // Hyperbola in sigma-space, symmetric about E=10: (E-10)^2 = 1.6*(sigma^2 - 64)/... use lecture-style shape
  // Use: sigma(E) = sqrt(64 + (E-10)^2 / 0.4)  -> MVP at (8, 10)
  const sig = (e) => Math.sqrt(64 + ((e - 10) ** 2) / 0.4);
  const rf = 5;
  // tangency: maximize (E - rf)/sig(E) numerically
  let T = { e: 10, s: sig(10), sh: (10 - rf) / sig(10) };
  for (let e = 10; e <= 16; e += 0.01) {
    const sh = (e - rf) / sig(e);
    if (sh > T.sh) T = { e, s: sig(e), sh };
  }
  const X = (s) => 45 + (s / 22) * 360;
  const Y = (e) => 205 - ((e - 3) / 13) * 185;
  const upper = [], lower = [];
  for (let e = 10; e <= 15.5; e += 0.1) upper.push(`${e === 10 ? 'M' : 'L'}${X(sig(e)).toFixed(1)},${Y(e).toFixed(1)}`);
  for (let e = 10; e >= 4.5; e -= 0.1) lower.push(`${Math.abs(e - 10) < 0.001 ? 'M' : 'L'}${X(sig(e)).toFixed(1)},${Y(e).toFixed(1)}`);
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-3">
      <svg viewBox="0 0 420 222" className="w-full">
        <Axes />
        <path d={lower.join(' ')} fill="none" stroke={showEff ? '#94a3b8' : '#00356b'} strokeWidth="2" strokeDasharray={showEff ? '4 3' : 'none'} />
        <path d={upper.join(' ')} fill="none" stroke={showEff ? '#e11d48' : '#00356b'} strokeWidth={showEff ? 3 : 2} />
        {/* CAL ray */}
        <line x1={X(0)} y1={Y(rf)} x2={X(21)} y2={Y(rf + T.sh * 21)} stroke="#d97706" strokeWidth="2.5" />
        <circle cx={X(0)} cy={Y(rf)} r="5" fill="#d97706" />
        <text x={X(0) + 7} y={Y(rf) + 13} fontSize="10" fill="#b45309" fontWeight="700">r_f</text>
        <circle cx={X(8)} cy={Y(10)} r="5" fill="#d97706" />
        <text x={X(8) - 8} y={Y(10) + 4} textAnchor="end" fontSize="10" fill="#b45309" fontWeight="700">MVP</text>
        <circle cx={X(T.s)} cy={Y(T.e)} r="6" fill="#d97706" stroke="#00356b" strokeWidth="1.5" />
        <text x={X(T.s) + 9} y={Y(T.e)} fontSize="11" fill="#00356b" fontWeight="800">T</text>
        {showEff && <text x={X(17)} y={Y(15.2)} fontSize="10" fill="#e11d48" fontWeight="600">efficient frontier</text>}
        <text x={X(15)} y={Y(rf + T.sh * 15) - 8} fontSize="10" fill="#b45309" fontWeight="600">CAL</text>
      </svg>
      <button
        onClick={() => setShowEff((s) => !s)}
        className="rounded-lg border border-yale-300 px-4 py-2 text-sm font-semibold text-yale-700 hover:bg-yale-50"
      >
        {showEff ? 'Show the whole bullet' : 'Highlight the efficient half'}
      </button>
      <p className="text-xs text-slate-500 text-center">
        Only the branch above the MVP is efficient — every lower point has a same-σ twin with higher E.
        The gold ray from r_f touches the frontier at T: the max-Sharpe tangency portfolio everyone holds.
      </p>
    </div>
  );
}
