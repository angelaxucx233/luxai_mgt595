import { useState } from 'react';

/**
 * Lecture 7 — out-of-sample decay and the Bayesian answer.
 *  mode="decay":    McLean–Pontiff three bars (0.582/0.402/0.264) + the volume/short-interest mechanism.
 *  mode="bayes":    JKP — seven bars to 82.4%, the shrinkage ray, the global test.
 *  mode="tradable": Chen–Welch 2×2 (48/26/19/7) + the four-paper debate map.
 */
export default function DecayLab({ mode = 'decay' }) {
  if (mode === 'bayes') return <Bayes />;
  if (mode === 'tradable') return <Tradable />;
  return <Decay />;
}

const MPBARS = [
  { l: 'in sample', sub: '323 months avg.', v: 0.582, c: '#00356b', note: 'The published number: mean predictor-portfolio return across the 97 studies, inside their own samples. Selected — by author and journal alike — on this very data.' },
  { l: 'out of sample', sub: '56 months avg.', v: 0.402, c: '#0f766e', note: '−26% (headline estimate): pure STATISTICAL BIAS. This drop would have happened if nobody ever read the papers — the original t-stats were selected on the same data they were measured in.' },
  { l: 'post publication', sub: '156 months avg.', v: 0.264, c: '#d97706', note: 'A further −32%: PUBLICATION-INFORMED TRADING. Nothing statistical changes at a publication date — only that other people learn the recipe. Decay is largest for price-only, cheap-to-arbitrage predictors.' },
];

function Decay() {
  const [tab, setTab] = useState('bars');
  const [sel, setSel] = useState(0);
  const b = MPBARS[sel];
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="flex gap-1.5">
        {[['bars', 'The three regimes'], ['mech', 'The mechanism']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold border ${tab === k ? 'bg-yale-800 text-white border-yale-800' : 'bg-white text-yale-900 border-yale-200'}`}>{l}</button>
        ))}
      </div>
      {tab === 'bars' ? (
        <>
          <svg viewBox="0 0 400 150" className="w-full">
            <text x="14" y="12" fontSize="8.5" fill="#64748b">mean monthly portfolio return (%), 97 predictors — McLean &amp; Pontiff Table I</text>
            <line x1="26" y1="118" x2="392" y2="118" stroke="#94a3b8" />
            {MPBARS.map((x, i) => (
              <g key={x.l} onClick={() => setSel(i)} className="cursor-pointer">
                <rect x={50 + i * 118} y={118 - x.v * 165} width="76" height={x.v * 165} fill={x.c} opacity={sel === i ? 1 : 0.55} rx="4" />
                <text x={88 + i * 118} y={118 - x.v * 165 - 6} textAnchor="middle" fontSize="10.5" fill={x.c} fontWeight="800">{x.v.toFixed(3)}</text>
                <text x={88 + i * 118} y="131" textAnchor="middle" fontSize="8" fill="#64748b">{x.l}</text>
                <text x={88 + i * 118} y="141" textAnchor="middle" fontSize="7" fill="#94a3b8">{x.sub}</text>
              </g>
            ))}
            <text x="147" y="26" fontSize="8.5" fill="#0f766e" fontWeight="700">−26%: statistical bias</text>
            <text x="262" y="44" fontSize="8.5" fill="#d97706" fontWeight="700">−32% more: arbitrage</text>
          </svg>
          <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900 min-h-[58px]">
            <b>{b.l}:</b> {b.note}
          </div>
        </>
      ) : (
        <>
          <svg viewBox="0 0 400 132" className="w-full">
            <text x="14" y="12" fontSize="8.5" fill="#64748b">predictor-portfolio coefficients — post-sample vs post-publication (Table VI)</text>
            <line x1="26" y1="108" x2="392" y2="108" stroke="#94a3b8" />
            {[
              { l: 'trading volume', a: 0.092, b: 0.187 },
              { l: 'short − long short interest', a: 0.166, b: 0.315 },
            ].map((r, i) => (
              <g key={r.l}>
                <rect x={64 + i * 180} y={108 - r.a * 270} width="56" height={r.a * 270} fill="#94a3b8" rx="3" />
                <text x={92 + i * 180} y={108 - r.a * 270 - 4} textAnchor="middle" fontSize="8.5" fill="#64748b" fontWeight="700">{r.a.toFixed(3)}</text>
                <rect x={128 + i * 180} y={108 - r.b * 270} width="56" height={r.b * 270} fill="#e11d48" rx="3" />
                <text x={156 + i * 180} y={108 - r.b * 270 - 4} textAnchor="middle" fontSize="8.5" fill="#e11d48" fontWeight="800">{r.b.toFixed(3)}</text>
                <text x={124 + i * 180} y="121" textAnchor="middle" fontSize="8" fill="#64748b">{r.l}</text>
              </g>
            ))}
            <text x="200" y="131" textAnchor="middle" fontSize="7.5" fill="#94a3b8">grey = post-sample · red = post-publication · equality rejected at p = 0.000 · variance: unchanged</text>
          </svg>
          <div className="w-full rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-[11px] text-rose-800">
            <b>You can watch the arbitrageurs arrive.</b> After publication, turnover in the predictor portfolios roughly doubles and shorting of the short leg roughly doubles — while return variance doesn’t budge. That is trading against the signal, not a change in the signal’s risk. (And 12 of the 97 predictors never replicated at all, even in their own samples.)
          </div>
        </>
      )}
      <p className="text-[11px] text-slate-500 leading-snug">The design is the insight: comparing in-sample vs post-sample vs post-publication splits “it was never real” from “it was real and the market ate it.” Both are true — in roughly equal parts.</p>
    </div>
  );
}

const SEVEN = [
  { l: 'HXZ raw returns', v: 35.0, c: '#e11d48', note: 'Hou–Xue–Zhang’s headline: “most anomalies fail.” Decile spreads, pure value weights, raw returns.' },
  { l: 'JKP construction', v: 55.6, c: '#94a3b8', note: '+9.2 capped value weights (Nokia was 70% of Finland’s market cap in 1999!), +5.0 one-month holding, +8.3 longer sample, −6.0 from JKP’s own MORE conservative terciles, +4.1 details.' },
  { l: 'drop never-claimed', v: 61.3, c: '#94a3b8', note: '34 factors’ original papers never claimed a significant alpha. You cannot fail to replicate a claim that was never made.' },
  { l: 'CAPM alphas', v: 82.4, c: '#00356b', note: 'Theory speaks to risk-ADJUSTED returns. A low-beta factor with negative raw return and positive alpha is BAB working, not failing. Still pure OLS — nothing Bayesian yet.' },
  { l: 'BY adjustment', v: 75.6, c: '#d97706', note: 'The HLZ-style frequentist correction: points untouched, intervals widened to an implied t of 2.7. It dents but does not overturn.' },
  { l: 'Bayes, US', v: 82.4, c: '#0f766e', note: 'Empirical Bayes: zero-alpha prior, severity estimated from the data. Shrinkage down and precision up exactly offset.' },
  { l: 'Bayes, global', v: 82.4, c: '#0f766e', note: '93 countries of confirmation. World-ex-US alpha = 0.079 + 0.67×US alpha (R² 0.37) — same magnitudes, shorter samples. No publication bias is possible in countries nobody selected.' },
];

function Bayes() {
  const [tab, setTab] = useState('bars');
  const [sel, setSel] = useState(3);
  const [kap, setKap] = useState(0.9);
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="flex gap-1.5">
        {[['bars', 'The seven bars'], ['shrink', 'Shrinkage'], ['world', 'The world test']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold border ${tab === k ? 'bg-yale-800 text-white border-yale-800' : 'bg-white text-yale-900 border-yale-200'}`}>{l}</button>
        ))}
      </div>
      {tab === 'bars' && (
        <>
          <svg viewBox="0 0 400 148" className="w-full">
            <text x="14" y="12" fontSize="8.5" fill="#64748b">replication rate (%) — JKP Figure 1</text>
            <line x1="26" y1="112" x2="392" y2="112" stroke="#94a3b8" />
            {SEVEN.map((x, i) => (
              <g key={x.l} onClick={() => setSel(i)} className="cursor-pointer">
                <rect x={32 + i * 51} y={112 - x.v * 1.06} width="40" height={x.v * 1.06} fill={x.c} opacity={sel === i ? 1 : 0.5} rx="3" />
                <text x={52 + i * 51} y={112 - x.v * 1.06 - 4} textAnchor="middle" fontSize="8.5" fill={x.c} fontWeight="800">{x.v.toFixed(1)}</text>
                <text x={52 + i * 51} y="124" textAnchor="middle" fontSize="6.4" fill="#64748b">{x.l.split(' ')[0]}</text>
                <text x={52 + i * 51} y="132" textAnchor="middle" fontSize="6.4" fill="#94a3b8">{x.l.split(' ').slice(1).join(' ')}</text>
              </g>
            ))}
          </svg>
          <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900 min-h-[62px]">
            <b>{SEVEN[sel].l} — {SEVEN[sel].v}%:</b> {SEVEN[sel].note}
          </div>
        </>
      )}
      {tab === 'shrink' && (
        <>
          <svg viewBox="0 0 400 132" className="w-full">
            <line x1="36" y1="112" x2="392" y2="112" stroke="#94a3b8" />
            <line x1="36" y1="112" x2="36" y2="10" stroke="#94a3b8" />
            <text x="392" y="126" textAnchor="end" fontSize="8" fill="#64748b">reported alpha α̂</text>
            <text x="14" y="16" fontSize="8" fill="#64748b" transform="rotate(0)">E(α|α̂)</text>
            <line x1="36" y1="112" x2="380" y2="14" stroke="#e2e8f0" strokeWidth="1.4" strokeDasharray="4 3" />
            <text x="330" y="18" fontSize="7.5" fill="#94a3b8">45°: believe the backtest</text>
            <line x1="36" y1="112" x2="380" y2={112 - kap * 98} stroke="#00356b" strokeWidth="2.4" />
            <text x="340" y={112 - kap * 98 + (kap > 0.6 ? 14 : -6)} fontSize="9" fill="#00356b" fontWeight="800">κ = {kap.toFixed(2)}</text>
            <circle cx="278" cy={112 - kap * 69} r="4.5" fill="#d97706" />
            <text x="278" y={112 - kap * 69 - 9} textAnchor="middle" fontSize="8" fill="#d97706" fontWeight="700">0.70 reported → {(0.70 * kap).toFixed(2)} believed</text>
          </svg>
          <div className="w-full flex items-center gap-2 text-[11px] text-yale-900">
            <span className="whitespace-nowrap font-semibold">shrinkage κ</span>
            <input type="range" min="0.1" max="1" step="0.01" value={kap} onChange={(e) => setKap(parseFloat(e.target.value))} className="flex-1 accent-yale-800" />
            <span className="w-10 text-right font-mono font-bold">{kap.toFixed(2)}</span>
          </div>
          <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
            E(α|α̂) = κ·α̂, κ = 1/(1+σ²/(τ²T)) — the prior is worth σ²/τ² months of zero alpha. JKP’s US calibration: κ ≈ 0.90. <b>The testable prediction:</b> regress OOS alphas on in-sample alphas — Bayes predicts slope κ &lt; 1 with intercept ≥ 0; pure alpha-hacking predicts slope 0. The data: slopes 0.26–0.57 (t up to 5.3) — hacking rejected, but below the 0.90 no-hacking benchmark: the strongest alphas were partly mined or arbitraged.
          </div>
        </>
      )}
      {tab === 'world' && (
        <>
          <svg viewBox="0 0 400 140" className="w-full">
            <text x="14" y="12" fontSize="8.5" fill="#64748b">replication rate (%) by region — OLS vs BY vs Bayes-all-data</text>
            <line x1="26" y1="112" x2="392" y2="112" stroke="#94a3b8" />
            {[
              { l: 'US', o: 82.4, b: 75.6, e: 81.5 },
              { l: 'Developed ex-US', o: 60.5, b: 31.1, e: 80.7 },
              { l: 'Emerging', o: 56.3, b: 37.0, e: 79.8 },
            ].map((r, i) => (
              <g key={r.l}>
                {[['o', '#94a3b8'], ['b', '#e11d48'], ['e', '#0f766e']].map(([k, c], j) => (
                  <g key={k}>
                    <rect x={44 + i * 124 + j * 30} y={112 - r[k] * 1.05} width="24" height={r[k] * 1.05} fill={c} rx="2.5" />
                    <text x={56 + i * 124 + j * 30} y={112 - r[k] * 1.05 - 3} textAnchor="middle" fontSize="7" fill={c} fontWeight="800">{r[k].toFixed(0)}</text>
                  </g>
                ))}
                <text x={88 + i * 124} y="124" textAnchor="middle" fontSize="7.5" fill="#64748b">{r.l}</text>
              </g>
            ))}
            <text x="200" y="137" textAnchor="middle" fontSize="7.5" fill="#94a3b8">grey OLS · red Benjamini–Yekutieli · green empirical Bayes (all global data)</text>
          </svg>
          <div className="w-full rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-[11px] text-emerald-900">
            <b>Shorter samples are the whole story abroad.</b> Point estimates match the US (the scatter hugs the 45° line); only the intervals are wider. The flat BY hurdle destroys short samples (60.5 → 31.1); the Bayesian model borrows exactly the incremental strength from global evidence (→ 80.7). And factors BY rejects but Bayes keeps go on to earn <b>IR ≈ 1</b> out of sample — the correction’s cost, priced.
          </div>
        </>
      )}
      <p className="text-[11px] text-slate-500 leading-snug">The zoo is 13 themes (Value’s within-cluster correlation: 0.81; Seasonality’s: 0.04); replication holds from mega-caps (77.3%) to micro (85.7%). Bayesian FDR: 0.1%. Expected fraction of true factors: 94%.</p>
    </div>
  );
}

const CW = [
  { l: 'Through 2005 · all stocks', v: 48, pos: 99, x: 0, y: 0, c: '#00356b', note: 'The published environment: median anomaly earns 48 bp/month and 99% of anomalies are positive. This is the world the papers describe.' },
  { l: 'Through 2005 · top 90% cap', v: 26, pos: 92, x: 1, y: 0, c: '#0f766e', note: 'Impose only the investable universe (top 3,000 stocks / 90% of cap): roughly −½. Microcaps carried a lot of the published returns.' },
  { l: 'Post-2005 · all stocks', v: 19, pos: 80, x: 0, y: 1, c: '#d97706', note: 'Impose only the modern era (decimalization, algorithmic trading): about −60%. Markets got faster and cheaper to arbitrage.' },
  { l: 'Post-2005 · top 90% cap', v: 7, pos: 67, x: 1, y: 1, c: '#e11d48', note: 'Both constraints — the actual situation of a large-cap manager today: 7 bp/month, median t = 0.45, before costs. “Useless to non-micro-cap portfolio managers in the 21st century.”' },
];

function Tradable() {
  const [tab, setTab] = useState('grid');
  const [sel, setSel] = useState(0);
  const c = CW[sel];
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="flex gap-1.5">
        {[['grid', 'The 2×2'], ['debate', 'Four papers, one debate']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold border ${tab === k ? 'bg-yale-800 text-white border-yale-800' : 'bg-white text-yale-900 border-yale-200'}`}>{l}</button>
        ))}
      </div>
      {tab === 'grid' ? (
        <>
          <svg viewBox="0 0 400 158" className="w-full">
            <text x="132" y="14" textAnchor="middle" fontSize="8.5" fill="#64748b" fontWeight="700">all stocks</text>
            <text x="298" y="14" textAnchor="middle" fontSize="8.5" fill="#64748b" fontWeight="700">top 90% mkt cap</text>
            <text x="48" y="52" textAnchor="middle" fontSize="8.5" fill="#64748b" fontWeight="700">thru 2005</text>
            <text x="48" y="118" textAnchor="middle" fontSize="8.5" fill="#64748b" fontWeight="700">post 2005</text>
            {CW.map((q, i) => (
              <g key={q.l} onClick={() => setSel(i)} className="cursor-pointer">
                <rect x={66 + q.x * 166} y={22 + q.y * 66} width="132" height="56" rx="8"
                  fill={q.c} opacity={sel === i ? 0.95 : 0.55} />
                <text x={132 + q.x * 166} y={48 + q.y * 66} textAnchor="middle" fontSize="15" fill="#fff" fontWeight="800">{q.v} bp</text>
                <text x={132 + q.x * 166} y={64 + q.y * 66} textAnchor="middle" fontSize="8" fill="#fff" opacity="0.9">{q.pos}% positive</text>
              </g>
            ))}
            <text x="132" y="152" textAnchor="middle" fontSize="8" fill="#d97706" fontWeight="700">era alone: −60%</text>
            <text x="298" y="152" textAnchor="middle" fontSize="8" fill="#e11d48" fontWeight="700">together: −85%</text>
          </svg>
          <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900 min-h-[58px]">
            <b>{c.l}:</b> {c.note}
          </div>
        </>
      ) : (
        <>
          <div className="w-full grid grid-cols-2 gap-1.5 text-[10.5px]">
            {[
              ['Harvey–Liu–Zhu', 'Much of the zoo is multiple-testing NOISE: at 316 factors, t = 2 is the expected best draw. 132–158 of 296 false.', '#00356b'],
              ['McLean–Pontiff', 'Part noise, part LEARNING: −26% out of sample, a further −32% after publication, with volume and shorting doubling.', '#0f766e'],
              ['Jensen–Kelly–Pedersen', 'It REPLICATES: 82.4% with sensible construction, alphas, and a Bayesian prior. Decay ≈ predicted shrinkage.', '#d97706'],
              ['Chen–Welch', 'Real but UNTRADABLE where capital lives: 7 bp/month post-2005 in the top-90% universe; combos net ≈ 0 (250–380 bp gross → 0–20 net).', '#e11d48'],
            ].map(([h, d, col]) => (
              <div key={h} className="rounded-lg border bg-white px-2 py-1.5" style={{ borderColor: col }}>
                <div className="font-bold" style={{ color: col }}>{h}</div>
                <div className="text-slate-600">{d}</div>
              </div>
            ))}
          </div>
          <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
            <b>Not mutually exclusive.</b> A factor can be statistically real, shrink out of sample exactly as Bayes predicts, and be arbitraged below costs precisely where capital can act. Excluded from all four: factor timing, machine-learning combinations, alternative data — the modern frontier lives outside this debate.
          </div>
        </>
      )}
      <p className="text-[11px] text-slate-500 leading-snug">Chen &amp; Welch grant the anomalies were real: “they were, however, traded away.” Statistical significance and economic implementability are different properties — the course’s final distinction.</p>
    </div>
  );
}
