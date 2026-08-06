import { useState } from 'react';

/**
 * Lecture 5 — the out-of-sample and market-state evidence, real numbers.
 *  mode="oos": tabs — across time (JT windows) and across markets/asset classes (AMP).
 *  mode="states": bear/bull/recession paired bars, market vs WML.
 */
export default function MomentumEvidence({ mode = 'oos' }) {
  if (mode === 'states') return <States />;
  return <Oos />;
}

const TIME = [
  { name: 'Full 1927–2012', mean: 0.75, t: 4.85, alpha: 1.09, ta: 7.91 },
  { name: 'Pre-sample 1927–64', mean: 0.64, t: 2.60, alpha: 1.03, ta: 5.23 },
  { name: 'Original 1965–89', mean: 0.83, t: 4.03, alpha: 1.00, ta: 4.84 },
  { name: 'Post-publication 1990–2012', mean: 0.93, t: 2.85, alpha: 1.17, ta: 3.27 },
];
const ASSETS = [
  ['US stocks', 0.45], ['UK stocks', 0.47], ['Europe stocks', 0.76], ['Japan stocks', 0.12], ['Global stocks', 0.68],
  ['Equity indices', 0.63], ['Currencies', 0.32], ['Bonds', 0.17], ['Commodities', 0.51], ['EW all classes', 0.81],
];

function Oos() {
  const [tab, setTab] = useState('time');
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="flex gap-1.5">
        <button onClick={() => setTab('time')} className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border ${tab === 'time' ? 'bg-yale-700 text-white border-yale-700' : 'bg-white text-yale-900 border-yale-200'}`}>Across time</button>
        <button onClick={() => setTab('assets')} className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border ${tab === 'assets' ? 'bg-yale-700 text-white border-yale-700' : 'bg-white text-yale-900 border-yale-200'}`}>Across everything else</button>
      </div>
      {tab === 'time' && (
        <>
          <div className="w-full rounded-xl border border-slate-200 overflow-hidden text-[11px]">
            <div className="grid grid-cols-[1fr_80px_100px] bg-yale-900 text-white font-semibold">
              <div className="px-3 py-1.5">Window (VW WML)</div><div className="px-2 py-1.5 text-right">Mean (t)</div><div className="px-2 py-1.5 text-right">3F α (t)</div>
            </div>
            {TIME.map((x, i) => (
              <div key={x.name} className={`grid grid-cols-[1fr_80px_100px] border-t border-slate-100 font-mono ${i >= 1 ? 'bg-emerald-50/50' : 'bg-white'}`}>
                <div className="px-3 py-1.5 text-slate-700 font-sans">{x.name}{i >= 1 && <span className="text-emerald-700 font-bold"> · OOS</span>}</div>
                <div className="px-2 py-1.5 text-right text-yale-900 font-bold">{x.mean.toFixed(2)} <span className="text-slate-400">({x.t.toFixed(2)})</span></div>
                <div className="px-2 py-1.5 text-right text-yale-900 font-bold">{x.alpha.toFixed(2)} <span className="text-slate-400">({x.ta.toFixed(2)})</span></div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">Significant in data JT never saw (1927–64) and — remarkably — <b>strongest after publication</b>: the 1990–2012 three-factor alpha is 1.17%/month. Flukes fade when the world learns about them; this didn\u2019t.</p>
        </>
      )}
      {tab === 'assets' && (
        <>
          <svg viewBox="0 0 400 190" className="w-full">
            {ASSETS.map(([name, sr], i) => (
              <g key={name}>
                <text x="108" y={17 + i * 18} textAnchor="end" fontSize="8.5" fill="#475569">{name}</text>
                <rect x="112" y={9 + i * 18} width={sr * 320} height="12" fill={name === 'EW all classes' ? '#d97706' : sr < 0.2 ? '#94a3b8' : '#00356b'} rx="2.5" />
                <text x={116 + sr * 320} y={19 + i * 18} fontSize="8.5" fontWeight="800" fill={name === 'EW all classes' ? '#b45309' : '#00356b'}>{sr.toFixed(2)}</text>
              </g>
            ))}
            <text x="112" y="188" fontSize="8" fill="#64748b">Sharpe ratios, long-short momentum scaled to 15% vol, 1972–2010 (Asness–Moskowitz–Pedersen)</text>
          </svg>
          <p className="text-[11px] text-slate-500 leading-snug">Positive in every market and asset class. Japan is the famous weak spot (0.12) — hold that thought until the dynamic strategy resurrects it. The equal-weighted combination earns <b>0.81</b>: mutually diversifying momentum everywhere.</p>
        </>
      )}
    </div>
  );
}

const STATES = [
  { name: 'Bear markets (worst ⅓)', mkt: -4.43, wml: 1.46 },
  { name: 'Bull markets (best ⅓)', mkt: 5.17, wml: -0.03 },
  { name: 'NBER recessions', mkt: -1.59, wml: 0.89 },
  { name: 'Non-recessions', mkt: 0.94, wml: 1.16 },
];

function States() {
  const X0 = 160;
  const S = 26;
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <svg viewBox="0 0 400 158" className="w-full">
        <line x1={X0} y1="8" x2={X0} y2="138" stroke="#94a3b8" />
        {STATES.map((x, i) => (
          <g key={x.name}>
            <text x={X0 - 6} y={22 + i * 32} textAnchor="end" fontSize="8.5" fill="#475569">{x.name}</text>
            <rect x={x.mkt >= 0 ? X0 : X0 + x.mkt * S} y={12 + i * 32} width={Math.abs(x.mkt) * S} height="10" fill="#94a3b8" rx="2" />
            <text x={x.mkt >= 0 ? X0 + 4 + x.mkt * S : X0 - 4 + x.mkt * S} y={21 + i * 32} fontSize="8" fill="#64748b" fontWeight="700" textAnchor={x.mkt >= 0 ? 'start' : 'end'}>mkt {x.mkt.toFixed(2)}</text>
            <rect x={x.wml >= 0 ? X0 : X0 + x.wml * S} y={24 + i * 32} width={Math.abs(x.wml) * S} height="10" fill={x.wml >= 0 ? '#0f766e' : '#e11d48'} rx="2" />
            <text x={x.wml >= 0 ? X0 + 4 + x.wml * S : X0 - 4 + x.wml * S} y={33 + i * 32} fontSize="8" fill={x.wml >= 0 ? '#0f766e' : '#e11d48'} fontWeight="700" textAnchor={x.wml >= 0 ? 'start' : 'end'}>WML {x.wml.toFixed(2)}</text>
          </g>
        ))}
        <text x={X0} y="152" textAnchor="middle" fontSize="8" fill="#64748b">average monthly returns (%) by market state</text>
      </svg>
      <div className="w-full rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-[11px] text-rose-900">
        <b>The sign test risk cannot pass:</b> momentum earns <b>+1.46%/month in bear markets</b> and +0.89% in recessions — it pays off precisely when marginal utility is high. A risk premium is compensation for hurting in bad times; this strategy is the insurance, not the insured.
      </div>
      <p className="text-[11px] text-slate-500 leading-snug">The behavioral alternative fits where profits live — small, low-coverage stocks, concentrated in losers (bad news travels slowly) — but owes an answer on limits to arbitrage. The answer, it turns out, is crash risk: next slides. (One caution for this table: it\u2019s unconditional averages — the crashes hide inside the bear-market cell.)</p>
    </div>
  );
}
