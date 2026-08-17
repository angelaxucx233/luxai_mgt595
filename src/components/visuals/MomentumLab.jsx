import { useState } from 'react';

/**
 * Lecture 5 — Jegadeesh–Titman + Moskowitz–Grinblatt, real numbers.
 *  mode="horizons": Sharpe by look-back period, clickable.
 *  mode="deciles": the decile ladder with raw-return / FF-alpha toggle.
 *  mode="decompose": the three profit channels with signs.
 *  mode="industry": MG Table 1 bars.
 */
export default function MomentumLab({ mode = 'horizons' }) {
  if (mode === 'deciles') return <Deciles />;
  if (mode === 'decompose') return <Decompose />;
  if (mode === 'industry') return <Industry />;
  return <Horizons />;
}

const HORIZONS = [
  { m: 1, sr: -0.82, note: 'Short-term reversal (Jegadeesh 1990; Lehmann 1990): last month’s winners lose — partly bid–ask bounce and liquidity provision.' },
  { m: 3, sr: 0.18, note: 'Continuation begins.' },
  { m: 6, sr: 0.46, note: 'The classic JT ranking window.' },
  { m: 12, sr: 0.58, note: 'The sweet spot — the standard UMD factor skips the most recent month and ranks on t−12:t−2.' },
  { m: 24, sr: 0.10, note: 'Profits dissipate after about a year.' },
  { m: 36, sr: -0.42, note: 'Reversal territory — DeBondt–Thaler’s horizon.' },
  { m: 60, sr: -0.58, note: 'Long-term losers now win: the contrarian effect from Lecture 3.' },
];

function Horizons() {
  const [sel, setSel] = useState(3);
  const h = HORIZONS[sel];
  const X = (i) => 42 + i * 51;
  const Y = (v) => 78 - v * 62;
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <svg viewBox="0 0 400 158" className="w-full">
        <line x1="24" y1={Y(0)} x2="392" y2={Y(0)} stroke="#94a3b8" />
        <text x="26" y="12" fontSize="8.5" fill="#64748b">annual Sharpe of buy-past-winners</text>
        {HORIZONS.map((x, i) => (
          <g key={x.m} onClick={() => setSel(i)} className="cursor-pointer">
            <rect x={X(i) - 17} y={x.sr >= 0 ? Y(x.sr) : Y(0)} width="34" height={Math.abs(Y(x.sr) - Y(0))}
              fill={x.sr >= 0 ? '#00356b' : '#e11d48'} opacity={sel === i ? 1 : 0.55} rx="3" />
            <text x={X(i)} y={x.sr >= 0 ? Y(x.sr) - 4 : Y(x.sr) + 12} textAnchor="middle" fontSize="8.5"
              fill={x.sr >= 0 ? '#00356b' : '#e11d48'} fontWeight="800">{x.sr.toFixed(2)}</text>
            <text x={X(i)} y="152" textAnchor="middle" fontSize="8.5" fill="#64748b">{x.m}mo</text>
          </g>
        ))}
      </svg>
      <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
        <b>{h.m}-month look-back (Sharpe {h.sr.toFixed(2)}):</b> {h.note}
      </div>
      <p className="text-[11px] text-slate-500 leading-snug">Reversal, continuation, reversal: any theory of momentum must explain why the sign of predictability flips twice with the horizon. Profits dissipate after ~1 year and reverse after 2–3 — a temporary price effect.</p>
    </div>
  );
}

const DECILES = [0.46, 0.09, 1.05, 1.12, 1.15, 1.18, 1.21, 1.30, 1.41, 1.63];
const ALPHAS = [-0.67, -0.32, -0.22, -0.12, -0.07, 0.10, 0.19, 0.33, 0.52, 0.87];

function Deciles() {
  const [view, setView] = useState('raw');
  const data = view === 'raw' ? DECILES : ALPHAS;
  const lo = Math.min(...data, 0), hi = Math.max(...data);
  const X = (i) => 36 + i * 37;
  const Y = (v) => 112 - ((v - lo) / (hi - lo)) * 96;
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="flex gap-1.5">
        <button onClick={() => setView('raw')} className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border ${view === 'raw' ? 'bg-yale-700 text-white border-yale-700' : 'bg-white text-yale-900 border-yale-200'}`}>Raw returns (1965–2008)</button>
        <button onClick={() => setView('alpha')} className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border ${view === 'alpha' ? 'bg-yale-700 text-white border-yale-700' : 'bg-white text-yale-900 border-yale-200'}`}>3-factor alphas (1927–2012)</button>
      </div>
      <svg viewBox="0 0 400 140" className="w-full">
        <line x1="24" y1={Y(0)} x2="392" y2={Y(0)} stroke="#94a3b8" />
        {data.map((v, i) => (
          <g key={i}>
            <rect x={X(i) - 14} y={v >= 0 ? Y(v) : Y(0)} width="28" height={Math.abs(Y(v) - Y(0))}
              fill={v >= 0 ? '#00356b' : '#e11d48'} rx="2.5" />
            <text x={X(i)} y={v >= 0 ? Y(v) - 4 : Y(v) + 11} textAnchor="middle" fontSize="8" fill={v >= 0 ? '#00356b' : '#e11d48'} fontWeight="700">{v.toFixed(2)}</text>
            <text x={X(i)} y="134" textAnchor="middle" fontSize="8" fill="#64748b">{i === 0 ? 'P1' : i === 9 ? 'P10' : i + 1}</text>
          </g>
        ))}
      </svg>
      <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
        {view === 'raw'
          ? <span><b>10 − 1 = 1.17%/month (~14%/yr).</b> Nearly monotone up the ladder. Construction: rank on past 6–12mo, overlapping 6/6 windows so only 1/6 of weights turn over each month.</span>
          : <span><b>WML alpha = 1.53%/month, t = 5.93.</b> Losers load like small distressed value (s=0.51, h=0.38), so the model predicts they should earn MORE — adjustment pushes the wrong way and the anomaly grows. R² up to 0.94: the factors price the variation, not the mean.</span>}
      </div>
    </div>
  );
}

function Decompose() {
  const [sel, setSel] = useState(2);
  const TERMS = [
    { name: 'σ²μ — dispersion in true means', v: 0.35, sign: '+', color: '#64748b', note: 'Conrad–Kaul: if true expected returns differ permanently, past winners have higher means by construction — no predictability needed. Rejected empirically by MG and Grundy–Martin, but it’s the null every decomposition must beat.' },
    { name: 'σ²β·Cov(F,F₋₁) — factor timing', v: -0.25, sign: '−', color: '#e11d48', note: 'Betting the factor continues. But the market’s own autocovariance is NEGATIVE at these horizons — this channel fights momentum. Whatever drives the profits, it isn’t riding the market.' },
    { name: 'avg Cov(εt, εt−1) — own autocovariance', v: 0.72, sign: '+', color: '#00356b', note: 'JT’s verdict: delayed reaction to firm-specific news. The tell against the lead–lag alternative: skipping a week between ranking and holding should mute a lead–lag effect — profits instead GROW. Puzzle: firm-specific drift is diversifiable… so why hasn’t arbitrage eaten it?' },
  ];
  const t = TERMS[sel];
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <svg viewBox="0 0 400 96" className="w-full">
        <line x1="200" y1="10" x2="200" y2="86" stroke="#94a3b8" />
        {TERMS.map((x, i) => (
          <g key={x.name} onClick={() => setSel(i)} className="cursor-pointer">
            <rect x={x.v >= 0 ? 200 : 200 + x.v * 220} y={14 + i * 25} width={Math.abs(x.v) * 220} height="17"
              fill={x.color} opacity={sel === i ? 1 : 0.5} rx="3" />
            <text x={x.v >= 0 ? 204 + x.v * 220 : 196 + x.v * 220} y={26 + i * 25} fontSize="9.5" fontWeight="800"
              fill={x.color} textAnchor={x.v >= 0 ? 'start' : 'end'}>{x.sign}</text>
          </g>
        ))}
        <text x="200" y="8" textAnchor="middle" fontSize="8" fill="#64748b">contribution to E[π] (illustrative magnitudes, real signs)</text>
      </svg>
      <div className="w-full rounded-xl border px-3 py-2 text-[11px]" style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
        <b style={{ color: t.color }}>{t.name}:</b> <span className="text-slate-700">{t.note}</span>
      </div>
      <div className="w-full rounded-lg bg-yale-50 border border-yale-100 px-3 py-1.5 text-[10.5px] text-yale-900 font-mono text-center">
        E[π] = σ²μ + σ²β·Cov(F,F₋₁) + (1/N)ΣCov(εⱼₜ, εⱼ,ₜ₋₁)
      </div>
    </div>
  );
}

const MG = [
  { name: 'Raw individual WML', v: 0.43, t: 4.65, sig: true },
  { name: 'Size & B/M adjusted', v: 0.29, t: 3.34, sig: true },
  { name: 'Industry-neutral', v: 0.08, t: 0.91, sig: false },
  { name: 'Industry momentum', v: 0.43, t: 4.24, sig: true },
  { name: 'Random “industries”', v: -0.05, t: -1.09, sig: false },
];

function Industry() {
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <svg viewBox="0 0 400 148" className="w-full">
        <line x1="150" y1="8" x2="150" y2="128" stroke="#94a3b8" />
        {MG.map((x, i) => (
          <g key={x.name}>
            <text x="146" y={24 + i * 25} textAnchor="end" fontSize="8.5" fill="#475569">{x.name}</text>
            <rect x={x.v >= 0 ? 150 : 150 + x.v * 480} y={15 + i * 25} width={Math.abs(x.v) * 480} height="15"
              fill={x.sig ? '#00356b' : '#94a3b8'} rx="3" />
            <text x={x.v >= 0 ? 154 + x.v * 480 : 146 + x.v * 480} y={26 + i * 25} fontSize="9" fontWeight="800"
              fill={x.sig ? '#00356b' : '#64748b'} textAnchor={x.v >= 0 ? 'start' : 'end'}>{x.v.toFixed(2)} (t {x.t.toFixed(2)}){x.sig ? '' : ' ✗'}</text>
          </g>
        ))}
        <text x="152" y="142" fontSize="8" fill="#64748b">%/month, (6,6) strategy — Moskowitz & Grinblatt (1999), Table 1</text>
      </svg>
      <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
        Neutralize industries and individual momentum <b>collapses</b> (0.43 → 0.08, t = 0.91). Buy past-winning <b>industries</b> and you keep the full 0.43. The control that clinches it: <b>randomly assigned</b> industries earn nothing — real industry structure carries the effect, not the act of grouping. Share attributable to industry: (0.43−0.08)/0.43 ≈ 81%.
      </div>
      <p className="text-[11px] text-slate-500 leading-snug">Dissent: Grundy–Martin (2000) find both channels positive. Practical corollary either way: a momentum book is a stack of correlated sector bets — less diversified than its stock count suggests.</p>
    </div>
  );
}
