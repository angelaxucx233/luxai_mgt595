import { useMemo, useState } from 'react';

/**
 * Lecture 3 — two modes:
 *  mode="dcf": price = expected discounted dividends; sliders + news shock.
 *  mode="car": event-study CAR paths — efficient/underreact/overreact + real Keown–Pinkerton overlay.
 */
export default function EventStudyLab({ mode = 'dcf' }) {
  if (mode === 'car') return <Car />;
  return <Dcf />;
}

function Dcf() {
  const [div, setDiv] = useState(5);      // next-year dividend, $
  const [g, setG] = useState(2);          // growth %
  const [r, setR] = useState(8);          // discount %
  const [shock, setShock] = useState(0);  // % dividend news
  const dEff = div * (1 + shock / 100);
  const price = r > g ? (dEff / ((r - g) / 100)) : Infinity;
  const base = r > g ? (div / ((r - g) / 100)) : Infinity;

  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-3">
      <div className="w-full grid grid-cols-1 gap-2">
        <Slider label={`Next dividend d = $${div.toFixed(1)}`} min={1} max={10} step={0.5} value={div} set={setDiv} accent="accent-yale-700" />
        <Slider label={`Growth g = ${g.toFixed(1)}%`} min={0} max={5} step={0.25} value={g} set={setG} accent="accent-teal-600" />
        <Slider label={`Discount rate r = ${r.toFixed(1)}%`} min={5} max={14} step={0.25} value={r} set={setR} accent="accent-rose-600" />
      </div>
      <div className="w-full flex items-center gap-3">
        <div className="flex-1 rounded-2xl bg-yale-900 text-white px-4 py-3 text-center">
          <div className="text-[10px] uppercase tracking-wider text-yale-100/70">Price = E[Σ dₜ/(1+r)ᵗ] = d/(r−g)</div>
          <div className="text-3xl font-black font-mono">${Number.isFinite(price) ? price.toFixed(2) : '∞'}</div>
          {shock !== 0 && <div className={`text-xs font-bold ${shock > 0 ? 'text-emerald-300' : 'text-rose-300'}`}>news repriced: {shock > 0 ? '+' : ''}{(price - base).toFixed(2)} — instantly, no drift</div>}
        </div>
        <div className="flex flex-col gap-1.5">
          <button onClick={() => setShock(15)} className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700">Good news +15%</button>
          <button onClick={() => setShock(-15)} className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700">Bad news −15%</button>
          <button onClick={() => setShock(0)} className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200">Reset</button>
        </div>
      </div>
      <p className="text-[11px] text-slate-500 leading-snug">Two ways a price can move: cash-flow news (the buttons) and discount-rate news (the r slider). Efficiency says either kind is incorporated <i>immediately</i> and by the <i>right amount</i> — and note the fine print: deciding what "right" means required a pricing model.</p>
    </div>
  );
}

// Real Keown–Pinkerton path (downsampled from the deck's figure)
const KP = [[-120, -1.8], [-105, -2.6], [-90, -1.3], [-75, -2.6], [-60, -2.2], [-48, -3.4], [-40, -3.2], [-33, -2.2], [-27, -1.1], [-21, -0.1], [-17, 1.3], [-13, 2.9], [-10, 4.2], [-7, 6.2], [-4, 8.6], [-2, 9.5], [-1, 10.7], [0, 12.0], [1, 25.6], [3, 26.0], [6, 24.6], [10, 26.6], [14, 27.2], [18, 26.0], [22, 27.0], [26, 26.4], [30, 27.2]];

function Car() {
  const [path, setPath] = useState('efficient');
  const [showReal, setShowReal] = useState(true);
  const X = (d) => 26 + ((d + 130) / 165) * 360;
  const Y = (c) => 158 - ((c + 8) / 42) * 140;

  const model = useMemo(() => {
    const pts = [];
    for (let d = -130; d <= 32; d += 2) {
      let c = 0;
      if (d >= 0) {
        if (path === 'efficient') c = 20;
        else if (path === 'under') c = 8 + 12 * Math.min(1, d / 28);
        else c = 28 - 10 * Math.min(1, d / 28);
      }
      pts.push(`${X(d)},${Y(c)}`);
    }
    return pts.join(' ');
  }, [path]);

  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="flex flex-wrap gap-1.5 justify-center">
        {[['efficient', 'Efficient: jump, then flat'], ['under', 'Underreaction: drift'], ['over', 'Overreaction: reversal']].map(([id, name]) => (
          <button key={id} onClick={() => setPath(id)}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border ${path === id ? 'bg-yale-700 text-white border-yale-700' : 'bg-white text-yale-900 border-yale-200 hover:bg-yale-50'}`}>{name}</button>
        ))}
        <button onClick={() => setShowReal((s) => !s)}
          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border ${showReal ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-amber-700 border-amber-300'}`}>1981 takeover data {showReal ? '✓' : ''}</button>
      </div>
      <svg viewBox="0 0 400 176" className="w-full">
        <line x1="26" y1="158" x2="392" y2="158" stroke="#94a3b8" /><line x1="26" y1="158" x2="26" y2="12" stroke="#94a3b8" />
        <line x1={X(-130)} y1={Y(0)} x2={X(32)} y2={Y(0)} stroke="#e2e8f0" />
        <line x1={X(0)} y1="158" x2={X(0)} y2="14" stroke="#e11d48" strokeDasharray="4 3" strokeWidth="1.4" />
        <text x={X(0)} y="10" textAnchor="middle" fontSize="8.5" fill="#e11d48" fontWeight="700">announcement</text>
        <text x="30" y="12" fontSize="8.5" fill="#64748b">CAR (%)</text>
        <text x="388" y="170" textAnchor="end" fontSize="8.5" fill="#64748b">days relative to event</text>
        <polyline points={model} fill="none" stroke="#00356b" strokeWidth="2.4" />
        {showReal && <polyline points={KP.map(([d, c]) => `${X(d)},${Y(c)}`).join(' ')} fill="none" stroke="#d97706" strokeWidth="2" strokeDasharray="1 0" opacity="0.9" />}
        {showReal && <text x={X(-58)} y={Y(-2.4) + 12} fontSize="8.5" fill="#b45309" fontWeight="700">Keown–Pinkerton (JF 1981)</text>}
      </svg>
      <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
        {path === 'efficient' && 'The semi-strong signature: everything public is priced by the close of day 0. The real data (amber) matches it after the announcement — the flat tail is the evidence.'}
        {path === 'under' && 'Underreaction: the price keeps drifting after the news — a trading rule (buy on announcement) would profit. Momentum stories live here.'}
        {path === 'over' && 'Overreaction: the initial move exceeds fundamentals and reverses — contrarian stories live here.'}
      </div>
      <p className="text-[11px] text-slate-500 leading-snug">The amber run-up <i>before</i> day 0 is information leaking through insider trading and anticipation — a strong-form violation, not a semi-strong one.</p>
    </div>
  );
}

function Slider({ label, min, max, step, value, set, accent }) {
  return (
    <label className="text-xs text-slate-600 flex items-center gap-2">
      <span className="w-44">{label}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(+e.target.value)} className={`flex-1 ${accent}`} />
    </label>
  );
}
