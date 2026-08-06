import { useState } from 'react';

/**
 * Lecture 8 — Asness–Moskowitz–Pedersen, Value and Momentum Everywhere.
 *  mode="map":        the uniform measures across asset classes.
 *  mode="results":    stylized everywhere-strip + the Japan card.
 *  mode="comovement": global factor structure + liquidity-risk loadings.
 */
export default function EverywhereLab({ mode = 'map' }) {
  if (mode === 'results') return <Results />;
  if (mode === 'comovement') return <Comovement />;
  return <MeasureMap />;
}

const CLASSES = [
  { k: 'Stocks (4 regions)', mom: 'return t−12 → t−2', val: 'book-to-price', note: 'US, UK, Japan, Continental Europe; top ~37.5% of names = 96–98% of market cap.' },
  { k: 'Country indices', mom: 'return t−12 → t−2', val: 'aggregate book-to-price', note: 'MSCI country equity indices — value and momentum on whole countries.' },
  { k: 'Bonds', mom: 'return t−12 → t−2', val: 'real yield (yield − E[inflation])', note: '\u201cBook\u201d = cash flows discounted at expected inflation; Consensus Economics forecasts.' },
  { k: 'Currencies', mom: 'return t−12 → t−2', val: '5-yr excess-return reversal', note: 'Deviation from UIP over 5 years ≈ change in PPP if real rates are constant.' },
  { k: 'Commodities', mom: 'return t−12 → t−2', val: 'spot price of 5 years ago ÷ today', note: '\u201cBook\u201d = average spot 4.5–5.5 years back — long-run reversal recast as cheapness.' },
];

function MeasureMap() {
  const [sel, setSel] = useState(0);
  const c = CLASSES[sel];
  return (
    <div className="w-full max-w-lg flex flex-col gap-2.5">
      <div className="grid grid-cols-5 gap-1">
        {CLASSES.map((x, i) => (
          <button key={x.k} onClick={() => setSel(i)}
            className={`rounded-lg px-1 py-1.5 text-[9.5px] font-semibold border transition ${sel === i ? 'bg-yale-800 text-white border-yale-800' : 'bg-white text-yale-900 border-yale-200 hover:border-yale-800'}`}>
            {x.k.split(' ')[0]}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-1.5 text-[11px]">
        <div className="rounded-xl border border-yale-200 bg-white px-3 py-2">
          <div className="text-[9px] uppercase tracking-wide text-slate-400 font-bold">Momentum in {c.k}</div>
          <div className="font-bold text-yale-900 mt-0.5">{c.mom}</div>
          <div className="text-slate-500 mt-0.5">Identical in every class — no translation needed.</div>
        </div>
        <div className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2">
          <div className="text-[9px] uppercase tracking-wide text-amber-600 font-bold">Value in {c.k}</div>
          <div className="font-bold text-amber-900 mt-0.5">{c.val}</div>
          <div className="text-amber-700 mt-0.5">{c.note}</div>
        </div>
      </div>
      <div className="rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
        <b>Deliberately crude.</b> No per-market optimization is allowed: terciles, 50/50 value-momentum combos, and equal-volatility weighting across classes (commodities run ~5× the vol of bonds). If the effects only appeared with tuned signals, that would itself be the tell.
      </div>
      <p className="text-[11px] text-slate-500 leading-snug">Before this paper, the literature had nothing on value in commodities or currencies, and nothing on either effect in government bonds. The recipe above created those literatures.</p>
    </div>
  );
}

// stylized (paper-shaped) Sharpe strip: [value, momentum, combo] per setting
const STRIP = [
  { k: 'US', v: 0.4, m: 0.5, c: 0.8 }, { k: 'UK', v: 0.4, m: 0.6, c: 0.9 },
  { k: 'Europe', v: 0.4, m: 0.6, c: 0.9 }, { k: 'Japan', v: 0.8, m: 0.1, c: 0.8, jp: true },
  { k: 'Indices', v: 0.4, m: 0.4, c: 0.7 }, { k: 'Bonds', v: 0.3, m: 0.2, c: 0.4 },
  { k: 'FX', v: 0.3, m: 0.4, c: 0.6 }, { k: 'Comdty', v: 0.4, m: 0.5, c: 0.7 },
];

function Results() {
  const [sel, setSel] = useState(3);
  const s = STRIP[sel];
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <svg viewBox="0 0 400 150" className="w-full">
        <text x="14" y="12" fontSize="8.5" fill="#64748b">Sharpe ratios by setting (stylized shape of Table I) — value · momentum · 50/50</text>
        <line x1="20" y1="118" x2="392" y2="118" stroke="#94a3b8" />
        {STRIP.map((x, i) => (
          <g key={x.k} onClick={() => setSel(i)} className="cursor-pointer" opacity={sel === i ? 1 : 0.55}>
            <rect x={26 + i * 46} y={118 - x.v * 90} width="10" height={x.v * 90} fill="#d97706" rx="2" />
            <rect x={38 + i * 46} y={118 - x.m * 90} width="10" height={x.m * 90} fill="#0f766e" rx="2" />
            <rect x={50 + i * 46} y={118 - x.c * 90} width="10" height={x.c * 90} fill="#00356b" rx="2" />
            <text x={43 + i * 46} y="130" textAnchor="middle" fontSize="7.5" fill={sel === i ? '#0f172a' : '#94a3b8'} fontWeight="700">{x.k}</text>
            {x.jp && <text x={43 + i * 46} y="142" textAnchor="middle" fontSize="7" fill="#e11d48" fontWeight="800">← the puzzle</text>}
          </g>
        ))}
        <g>
          <rect x="308" y="16" width="10" height="7" fill="#d97706" rx="1.5" /><text x="322" y="23" fontSize="7.5" fill="#64748b">value</text>
          <rect x="308" y="27" width="10" height="7" fill="#0f766e" rx="1.5" /><text x="322" y="34" fontSize="7.5" fill="#64748b">momentum</text>
          <rect x="308" y="38" width="10" height="7" fill="#00356b" rx="1.5" /><text x="322" y="45" fontSize="7.5" fill="#64748b">50/50 combo</text>
        </g>
      </svg>
      {s.jp ? (
        <div className="w-full rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-[11px] text-rose-900">
          <b>\u201cNo momentum in Japan? So what?\u201d</b> Momentum\u2019s famous Japanese failure coincides with value\u2019s <i>strongest</i> run anywhere — and with V-M correlation near −0.6, a weak momentum draw during a great value draw is exactly what the joint distribution predicts. The combo performed fine. Japan is a data point <i>for</i> the framework.
        </div>
      ) : (
        <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
          <b>{s.k}:</b> both legs positive, combo higher than either — the pattern in every setting. The negative correlation means the combo\u2019s volatility collapses while its mean holds: the closest thing factor investing has to a free lunch.
        </div>
      )}
      <p className="text-[11px] text-slate-500 leading-snug">Bars are stylized to the paper\u2019s pattern (exact Table I values are image-only in the source deck); the deck\u2019s stated facts: positive everywhere, negative V-M correlation within every class, combo dominant, long/short legs roughly equal.</p>
    </div>
  );
}

function Comovement() {
  const [tab, setTab] = useState('global');
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="flex gap-1.5">
        {[['global', 'One global factor'], ['liq', 'Liquidity risk'], ['dyn', 'The dynamics']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold border ${tab === k ? 'bg-yale-800 text-white border-yale-800' : 'bg-white text-yale-900 border-yale-200'}`}>{l}</button>
        ))}
      </div>
      {tab === 'global' && (
        <>
          <svg viewBox="0 0 400 122" className="w-full">
            <text x="14" y="12" fontSize="8.5" fill="#64748b">correlation structure (schematic): every V with every V, every M with every M</text>
            {['US val', 'UK val', 'FX val', 'Cmd val'].map((l, i) => (
              <g key={l}>
                <circle cx={60 + i * 60} cy="44" r="15" fill="#d97706" opacity="0.85" />
                <text x={60 + i * 60} y="47" textAnchor="middle" fontSize="6.5" fill="#fff" fontWeight="700">{l}</text>
              </g>
            ))}
            {['US mom', 'UK mom', 'FX mom', 'Cmd mom'].map((l, i) => (
              <g key={l}>
                <circle cx={60 + i * 60} cy="94" r="15" fill="#0f766e" opacity="0.85" />
                <text x={60 + i * 60} y="97" textAnchor="middle" fontSize="6.5" fill="#fff" fontWeight="700">{l}</text>
              </g>
            ))}
            {[0, 1, 2].map((i) => (
              <g key={i}>
                <line x1={75 + i * 60} y1="44" x2={105 + i * 60} y2="44" stroke="#d97706" strokeWidth="2" />
                <line x1={75 + i * 60} y1="94" x2={105 + i * 60} y2="94" stroke="#0f766e" strokeWidth="2" />
              </g>
            ))}
            <line x1="60" y1="59" x2="60" y2="79" stroke="#e11d48" strokeWidth="1.6" strokeDasharray="4 3" />
            <text x="330" y="70" fontSize="8" fill="#e11d48" fontWeight="700">V ↔ M: negative</text>
          </svg>
          <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
            Value in one market co-moves with value in <i>every other</i> — across asset classes — and momentum ditto; the first principal component splits the whole zoo into a global value factor and a global momentum factor. A global 3-factor model prices 48 V&amp;M portfolios worldwide better than any local model. No country-specific story survives that.
          </div>
        </>
      )}
      {tab === 'liq' && (
        <>
          <svg viewBox="0 0 400 118" className="w-full">
            <text x="14" y="12" fontSize="8.5" fill="#64748b">loading on funding-liquidity shocks (everywhere portfolios)</text>
            <line x1="200" y1="24" x2="200" y2="96" stroke="#e2e8f0" />
            <g>
              <rect x="200" y="34" width="120" height="20" fill="#d97706" rx="4" />
              <text x="326" y="48" fontSize="9" fill="#d97706" fontWeight="800">value: + (t = 3.8)</text>
            </g>
            <g>
              <rect x="96" y="66" width="104" height="20" fill="#0f766e" rx="4" />
              <text x="90" y="80" textAnchor="end" fontSize="9" fill="#0f766e" fontWeight="800">momentum: − (t = −3.2)</text>
            </g>
            <text x="200" y="112" textAnchor="middle" fontSize="8.5" fill="#64748b">\u201ccheap assets get cheaper during liquidity events, but trending assets do better\u201d</text>
          </svg>
          <div className="w-full rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-[11px] text-amber-900">
            <b>Only visible everywhere.</b> In any single market the loadings drown in noise; diversify across all of them and they emerge at |t| &gt; 3. Liquidity risk helps explain value\u2019s premium and the negative V-M correlation — but momentum earns a premium while <i>hedging</i> liquidity events, which makes it more puzzling, not less. Macro risks explain little. \u201cStill far from a full explanation.\u201d
          </div>
        </>
      )}
      {tab === 'dyn' && (
        <div className="w-full flex flex-col gap-1.5 text-[11px]">
          {[
            ['Summer 1998 (LTCM)', 'Liquidity risk\u2019s importance rises sharply after the LTCM crisis — the market learned what funding shocks do to these strategies.', '#00356b'],
            ['Rising correlations', 'Over time, value and momentum become more correlated across markets and with each other — consistent with common arbitrage capital trading them globally.', '#0f766e'],
            ['Shrinking premia', 'Both become less profitable over the sample — capital chasing the published effects (McLean\u2013Pontiff\u2019s mechanism, met in Lecture 7).', '#d97706'],
          ].map(([h, d, c]) => (
            <div key={h} className="rounded-lg border bg-white px-3 py-2" style={{ borderColor: c }}>
              <div className="font-bold" style={{ color: c }}>{h}</div>
              <div className="text-slate-600">{d}</div>
            </div>
          ))}
          <div className="rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-yale-900">
            The dynamics preview Lecture 10: these footprints — liquidity sensitivity, crowding, decay — are what arbitrage capital looks like in the data.
          </div>
        </div>
      )}
    </div>
  );
}
