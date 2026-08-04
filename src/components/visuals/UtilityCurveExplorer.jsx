import { useState } from 'react';

/**
 * Concave utility u(W)=sqrt(W). Fair 50/50 gamble around mean 100.
 * Slider widens the spread; shows u(E[W]), E[u(W)], CE and risk premium.
 */
export default function UtilityCurveExplorer({ showFamilies = false }) {
  const [spread, setSpread] = useState(50); // W = 100 ± spread
  const mean = 100;
  const wl = mean - spread;
  const wh = mean + spread;
  const u = (w) => Math.sqrt(w);
  const uL = u(wl);
  const uH = u(wh);
  const eU = 0.5 * (uL + uH);
  const uMean = u(mean);
  const ce = eU * eU; // inverse of sqrt
  const pi = mean - ce;

  // SVG scales: W in [0, 200] -> x in [40, 380]; u in [0, 15] -> y in [210, 20]
  const X = (w) => 40 + (w / 200) * 340;
  const Y = (v) => 210 - (v / 15) * 190;
  const curve = Array.from({ length: 81 }, (_, i) => {
    const w = (i / 80) * 200;
    return `${i === 0 ? 'M' : 'L'}${X(w).toFixed(1)},${Y(u(w)).toFixed(1)}`;
  }).join(' ');

  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-3">
      <svg viewBox="0 0 420 240" className="w-full">
        <line x1="40" y1="210" x2="400" y2="210" stroke="#94a3b8" strokeWidth="1" />
        <line x1="40" y1="210" x2="40" y2="15" stroke="#94a3b8" strokeWidth="1" />
        <path d={curve} fill="none" stroke="#00356b" strokeWidth="2.5" />
        {/* chord */}
        <line x1={X(wl)} y1={Y(uL)} x2={X(wh)} y2={Y(uH)} stroke="#b45309" strokeWidth="1.5" strokeDasharray="5 4" />
        <circle cx={X(wl)} cy={Y(uL)} r="4" fill="#00356b" />
        <circle cx={X(wh)} cy={Y(uH)} r="4" fill="#00356b" />
        {/* E[u] on chord (red) and u(E[W]) on curve (gold) */}
        <line x1={X(mean)} y1="210" x2={X(mean)} y2={Y(uMean)} stroke="#cbd5e1" strokeDasharray="3 3" />
        <line x1={X(ce)} y1="210" x2={X(ce)} y2={Y(eU)} stroke="#e11d48" strokeDasharray="3 3" />
        <circle cx={X(mean)} cy={Y(eU)} r="5" fill="#e11d48" />
        <circle cx={X(mean)} cy={Y(uMean)} r="5" fill="#d97706" stroke="#00356b" strokeWidth="1" />
        {/* pi bracket */}
        <line x1={X(ce)} y1="222" x2={X(mean)} y2="222" stroke="#b45309" strokeWidth="2" />
        <text x={(X(ce) + X(mean)) / 2} y="236" textAnchor="middle" fontSize="11" fill="#b45309" fontWeight="700">
          π = {pi.toFixed(1)}
        </text>
        <text x={X(wl)} y="225" textAnchor="middle" fontSize="10" fill="#64748b">W_L</text>
        <text x={X(wh)} y="225" textAnchor="middle" fontSize="10" fill="#64748b">W_H</text>
        <text x={X(mean) + 4} y={Y(uMean) - 8} fontSize="10" fill="#d97706" fontWeight="600">u(E[W])</text>
        <text x={X(mean) + 8} y={Y(eU) + 12} fontSize="10" fill="#e11d48" fontWeight="600">E[u(W)]</text>
        <text x={X(ce)} y="207" textAnchor="end" fontSize="10" fill="#e11d48">CE</text>
        <text x="398" y="224" textAnchor="end" fontSize="10" fill="#64748b">wealth W</text>
        <text x="36" y="14" textAnchor="end" fontSize="10" fill="#64748b">u(W)</text>
      </svg>

      <label className="w-full flex items-center gap-3 text-sm text-slate-700">
        <span className="whitespace-nowrap">Gamble spread ±${spread}</span>
        <input
          type="range" min={5} max={95} value={spread}
          onChange={(e) => setSpread(Number(e.target.value))}
          className="flex-1 accent-yale-600"
        />
      </label>

      <div className="grid grid-cols-3 gap-2 w-full text-center text-xs">
        <div className="rounded-lg bg-yale-50 p-2">
          <p className="text-slate-500">E[W]</p>
          <p className="font-bold text-yale-700 tabular-nums">${mean}</p>
        </div>
        <div className="rounded-lg bg-yale-50 p-2">
          <p className="text-slate-500">CE</p>
          <p className="font-bold text-yale-700 tabular-nums">${ce.toFixed(1)}</p>
        </div>
        <div className="rounded-lg bg-amber-50 p-2">
          <p className="text-slate-500">Risk premium π</p>
          <p className="font-bold text-amber-700 tabular-nums">${pi.toFixed(1)}</p>
        </div>
      </div>

      {showFamilies && (
        <div className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700 grid grid-cols-2 gap-x-4 gap-y-1">
          <p><span className="font-semibold text-yale-700">Quadratic</span> W − (b/2)W² · closed-form MV</p>
          <p><span className="font-semibold text-yale-700">CRRA</span> W^(1−γ)/(1−γ) · constant relative RA</p>
          <p><span className="font-semibold text-yale-700">CARA</span> −e^(−αW) · clean with normal returns</p>
          <p><span className="font-semibold text-yale-700">Log</span> ln W · CRRA with γ = 1 (Kelly)</p>
        </div>
      )}
    </div>
  );
}
