import { useState } from 'react';

/** SML in beta space. Drag an asset's beta and forecast return; alpha readout. */
export default function SmlExplorer({ showDerivation = false }) {
  const rf = 3, mkt = 9; // percent
  const prem = mkt - rf;
  const [beta, setBeta] = useState(1.4);
  const [forecast, setForecast] = useState(12);
  const required = rf + beta * prem;
  const alpha = forecast - required;

  const X = (b) => 45 + (b / 2.2) * 360;
  const Y = (e) => 200 - ((e - 0) / 18) * 185;

  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-3">
      {showDerivation && (
        <div className="w-full rounded-xl bg-yale-50 border border-yale-100 p-3 text-xs text-yale-900 font-mono flex flex-col gap-1">
          <p>Tangency: (E[rᵢ]−r_f)/Cov(rᵢ,R_T) equal ∀ i — apply to T itself:</p>
          <p>(E[rᵢ]−r_f)/Cov(rᵢ,R_T) = (E[R_T]−r_f)/Var(R_T)</p>
          <p>⟹ E[rᵢ] = r_f + βᵢ(E[R_T]−r_f), &nbsp;βᵢ = Cov/Var</p>
          <p className="font-bold">Equilibrium: T = the market ⟹ E[rᵢ] = r_f + βᵢ(E[R_M]−r_f)</p>
        </div>
      )}
      <svg viewBox="0 0 420 218" className="w-full">
        <line x1="45" y1="200" x2="405" y2="200" stroke="#94a3b8" />
        <line x1="45" y1="200" x2="45" y2="15" stroke="#94a3b8" />
        <text x="400" y="213" textAnchor="end" fontSize="10" fill="#a3b1c2">β</text>
        <text x="42" y="12" textAnchor="end" fontSize="10" fill="#a3b1c2">E[r] (%)</text>
        {/* SML */}
        <line x1={X(0)} y1={Y(rf)} x2={X(2.2)} y2={Y(rf + 2.2 * prem)} stroke="#3b82f6" strokeWidth="2.5" />
        <text x={X(1.9)} y={Y(rf + 1.9 * prem) - 8} fontSize="11" fill="#93b8e8" fontWeight="700">SML</text>
        {/* rf and market */}
        <circle cx={X(0)} cy={Y(rf)} r="5" fill="#d97706" />
        <text x={X(0) + 7} y={Y(rf) + 13} fontSize="10" fill="#f59e0b" fontWeight="600">r_f = 3%</text>
        <circle cx={X(1)} cy={Y(mkt)} r="5" fill="#d97706" stroke="#3b82f6" strokeWidth="1" />
        <text x={X(1) + 8} y={Y(mkt) + 12} fontSize="10" fill="#f59e0b" fontWeight="600">market (β=1)</text>
        {/* asset */}
        <line x1={X(beta)} y1={Y(required)} x2={X(beta)} y2={Y(forecast)} stroke={alpha >= 0 ? '#059669' : '#e11d48'} strokeWidth="2" strokeDasharray="4 3" />
        <circle cx={X(beta)} cy={Y(forecast)} r="6" fill={alpha >= 0 ? '#059669' : '#e11d48'} stroke="white" strokeWidth="1.5" />
        <text x={X(beta) + 9} y={Y(forecast) + 4} fontSize="10" fill={alpha >= 0 ? '#047857' : '#be123c'} fontWeight="700">your asset</text>
      </svg>
      <label className="w-full flex items-center gap-3 text-sm text-slate-200">
        <span className="w-40">β = {beta.toFixed(2)}</span>
        <input type="range" min={0} max={2.2} step={0.05} value={beta}
          onChange={(e) => setBeta(Number(e.target.value))} className="flex-1 accent-yale-600" />
      </label>
      <label className="w-full flex items-center gap-3 text-sm text-slate-200">
        <span className="w-40">Forecast = {forecast.toFixed(1)}%</span>
        <input type="range" min={0} max={17} step={0.1} value={forecast}
          onChange={(e) => setForecast(Number(e.target.value))} className="flex-1 accent-yale-600" />
      </label>
      <div className="grid grid-cols-2 gap-2 w-full text-center text-xs">
        <div className="rounded-lg bg-yale-50 p-2">
          <p className="text-slate-500">CAPM requires</p>
          <p className="font-bold text-yale-700 tabular-nums">{required.toFixed(1)}%</p>
        </div>
        <div className={`rounded-lg p-2 ${alpha >= 0 ? 'bg-emerald-50' : 'bg-rose-50'}`}>
          <p className="text-slate-500">α = forecast − required</p>
          <p className={`font-bold tabular-nums ${alpha >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
            {alpha >= 0 ? '+' : ''}{alpha.toFixed(1)}% {alpha > 0.05 ? '· undervalued' : alpha < -0.05 ? '· overvalued' : '· fairly priced'}
          </p>
        </div>
      </div>
    </div>
  );
}
