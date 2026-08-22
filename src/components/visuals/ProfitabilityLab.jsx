import { useState } from 'react';

/**
 * Lecture 6 — Novy-Marx quality/profitability, real numbers.
 *  mode="map":    the definition zoo + quality↔value hedge structure.
 *  mode="sorts":  GP/A sorts (0.31 spread, 0.52 alpha) + Fama–MacBeth (0.75 → 1.00).
 *  mode="double": double sorts (58 vs 31, 68 vs 41), value insurance, the measure zoo verdict.
 */
export default function ProfitabilityLab({ mode = 'map' }) {
  if (mode === 'sorts') return <Sorts />;
  if (mode === 'double') return <DoubleSort />;
  return <QualityMap />;
}

const DEFS = [
  { k: 'Profitable', d: 'Gross profits, margins, earnings — Novy-Marx’s pick, and the one that survives.' },
  { k: 'Safe', d: 'Low beta, low volatility, low leverage, low credit risk — the BAB dimension.' },
  { k: 'Well governed', d: 'Management quality, shareholder friendliness.' },
  { k: 'Growing', d: 'Asset growth, earnings growth over the past five years.' },
  { k: 'High payout', d: 'Fraction of profits returned — free cash can breed agency problems (Jensen 1986).' },
  { k: 'Clean accounting', d: 'Low accruals (Sloan 1996), stable earnings — quality of the numbers themselves.' },
];

function QualityMap() {
  const [sel, setSel] = useState(0);
  return (
    <div className="w-full max-w-lg flex flex-col gap-2.5">
      <div className="grid grid-cols-3 gap-1.5">
        {DEFS.map((x, i) => (
          <button key={x.k} onClick={() => setSel(i)}
            className={`rounded-lg px-2 py-1.5 text-[11px] font-semibold border transition ${sel === i ? 'bg-yale-800 text-white border-yale-800' : 'bg-white text-yale-900 border-yale-200 hover:border-yale-800'}`}>
            {x.k}
          </button>
        ))}
      </div>
      <div className="rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900 min-h-[44px]">
        <b>{DEFS[sel].k}:</b> {DEFS[sel].d}
      </div>
      <svg viewBox="0 0 400 96" className="w-full">
        <rect x="14" y="16" width="168" height="34" rx="7" fill="#3b82f6" />
        <text x="98" y="30" textAnchor="middle" fontSize="9.5" fill="#fff" fontWeight="800">QUALITY strategies</text>
        <text x="98" y="43" textAnchor="middle" fontSize="8" fill="#bfdbfe">long good firms (expensive)</text>
        <rect x="218" y="16" width="168" height="34" rx="7" fill="#d97706" />
        <text x="302" y="30" textAnchor="middle" fontSize="9.5" fill="#fff" fontWeight="800">VALUE strategies</text>
        <text x="302" y="43" textAnchor="middle" fontSize="8" fill="#fef3c7">long cheap firms (low quality)</text>
        <path d="M 182 26 C 200 18 200 18 218 26" stroke="#e11d48" strokeWidth="1.5" fill="none" markerEnd="url(#pmArr)" />
        <path d="M 218 42 C 200 50 200 50 182 42" stroke="#e11d48" strokeWidth="1.5" fill="none" markerEnd="url(#pmArr)" />
        <defs><marker id="pmArr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#e11d48" /></marker></defs>
        <text x="200" y="68" textAnchor="middle" fontSize="9" fill="#fb7185" fontWeight="700">each is implicitly SHORT the other</text>
        <text x="200" y="84" textAnchor="middle" fontSize="8.5" fill="#a3b1c2">negatively correlated holdings ⟹ each pays off when the other bleeds: a natural hedge</text>
      </svg>
      <p className="text-[11px] text-slate-500 leading-snug">Buffett’s line is the definition: “far better to buy a wonderful business at a fair price than a fair business at a wonderful price.” Quality investing is value investing where the numerator, not the denominator, does the work.</p>
    </div>
  );
}

const SORT_RET = [0.31, 0.41, 0.52, 0.60, 0.62]; // stylized monotone quintile excess returns for shape
const SORT_LBL = ['low', '2', '3', '4', 'high'];

function Sorts() {
  const [view, setView] = useState('sorts');
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="flex gap-1.5">
        {[['sorts', 'Decile sorts'], ['fm', 'Fama–MacBeth']].map(([k, l]) => (
          <button key={k} onClick={() => setView(k)}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold border ${view === k ? 'bg-yale-800 text-white border-yale-800' : 'bg-white text-yale-900 border-yale-200'}`}>{l}</button>
        ))}
      </div>
      {view === 'sorts' ? (
        <>
          <svg viewBox="0 0 400 150" className="w-full">
            <text x="14" y="12" fontSize="8.5" fill="#a3b1c2">excess return by GP/A quintile (shape) — and the headline spread</text>
            {SORT_RET.map((v, i) => (
              <g key={i}>
                <rect x={26 + i * 44} y={118 - v * 130} width="32" height={v * 130} fill="#3b82f6" opacity={0.45 + i * 0.13} rx="3" />
                <text x={42 + i * 44} y={118 - v * 130 - 5} textAnchor="middle" fontSize="8" fill="#66b2ff" fontWeight="700">{v.toFixed(2)}</text>
                <text x={42 + i * 44} y="132" textAnchor="middle" fontSize="8.5" fill="#a3b1c2">{SORT_LBL[i]}</text>
              </g>
            ))}
            <g>
              <rect x="266" y={118 - 0.31 * 130} width="42" height={0.31 * 130} fill="#059669" rx="3" />
              <text x="287" y={118 - 0.31 * 130 - 5} textAnchor="middle" fontSize="9" fill="#34d399" fontWeight="800">0.31</text>
              <text x="287" y="132" textAnchor="middle" fontSize="8" fill="#a3b1c2">H−L /mo</text>
              <text x="287" y="143" textAnchor="middle" fontSize="7.5" fill="#cbd5e1">t = 2.49</text>
              <rect x="330" y={118 - 0.52 * 130} width="42" height={0.52 * 130} fill="#d97706" rx="3" />
              <text x="351" y={118 - 0.52 * 130 - 5} textAnchor="middle" fontSize="9" fill="#d97706" fontWeight="800">0.52</text>
              <text x="351" y="132" textAnchor="middle" fontSize="8" fill="#a3b1c2">FF3 alpha</text>
              <text x="351" y="143" textAnchor="middle" fontSize="7.5" fill="#cbd5e1">t = 4.49</text>
            </g>
          </svg>
          <div className="w-full rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-[11px] text-amber-900">
            <b>The alpha exceeds the spread.</b> High-GP/A firms are growth-like (negative HML loading, bigger caps), so the three-factor model expects them to <i>underperform</i> — risk adjustment makes the anomaly bigger. Same wrong-way mechanism as momentum.
          </div>
        </>
      ) : (
        <>
          <svg viewBox="0 0 400 150" className="w-full">
            <text x="14" y="12" fontSize="8.5" fill="#a3b1c2">Fama–MacBeth slope on gross profitability (×10²)</text>
            <line x1="30" y1="120" x2="386" y2="120" stroke="#94a3b8" />
            <g>
              <rect x="90" y={120 - 0.75 * 110} width="70" height={0.75 * 110} fill="#3b82f6" rx="4" />
              <text x="125" y={120 - 0.75 * 110 - 6} textAnchor="middle" fontSize="10" fill="#93b8e8" fontWeight="800">0.75</text>
              <text x="125" y="134" textAnchor="middle" fontSize="8.5" fill="#a3b1c2">straight</text>
              <text x="125" y="145" textAnchor="middle" fontSize="7.5" fill="#cbd5e1">t = 5.49</text>
            </g>
            <g>
              <rect x="230" y={120 - 1.0 * 110} width="70" height={1.0 * 110} fill="#059669" rx="4" />
              <text x="265" y={120 - 1.0 * 110 - 6} textAnchor="middle" fontSize="10" fill="#34d399" fontWeight="800">1.00</text>
              <text x="265" y="134" textAnchor="middle" fontSize="8.5" fill="#a3b1c2">industry-demeaned</text>
              <text x="265" y="145" textAnchor="middle" fontSize="7.5" fill="#cbd5e1">t = 8.99</text>
            </g>
          </svg>
          <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
            <b>Survives everything.</b> Earnings and free cash flow do not drive it out; log(B/M), size, and momentum controls leave it intact — and comparing firms <i>within</i> industries strengthens it. The premium attaches to productivity itself.
          </div>
        </>
      )}
      <p className="text-[11px] text-slate-500 leading-snug">GP/A = (revenues − COGS)/assets: the cleanest accounting measure — further down the income statement, the numbers get managed.</p>
    </div>
  );
}

const DTABS = [
  { k: 'double', l: 'Double sorts' },
  { k: 'insure', l: 'Value insurance' },
  { k: 'zoo', l: 'The measure zoo' },
];

function DoubleSort() {
  const [tab, setTab] = useState('double');
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="flex gap-1.5">
        {DTABS.map((t) => (
          <button key={t.k} onClick={() => setTab(t.k)}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold border ${tab === t.k ? 'bg-yale-800 text-white border-yale-800' : 'bg-white text-yale-900 border-yale-200'}`}>{t.l}</button>
        ))}
      </div>
      {tab === 'double' && (
        <>
          <svg viewBox="0 0 400 148" className="w-full">
            <text x="14" y="12" fontSize="8.5" fill="#a3b1c2">spread, bp/month — unconditional vs controlling for the other</text>
            <line x1="26" y1="118" x2="390" y2="118" stroke="#94a3b8" />
            {[
              { x: 50, v: 31, c: '#94a3b8', l: 'profitability, raw' },
              { x: 130, v: 58, c: '#3b82f6', l: 'profitability | B/M' },
              { x: 230, v: 41, c: '#94a3b8', l: 'value, raw' },
              { x: 310, v: 68, c: '#d97706', l: 'value | GP/A' },
            ].map((b) => (
              <g key={b.l}>
                <rect x={b.x} y={118 - b.v * 1.35} width="52" height={b.v * 1.35} fill={b.c} rx="4" />
                <text x={b.x + 26} y={118 - b.v * 1.35 - 5} textAnchor="middle" fontSize="10" fill={b.c} fontWeight="800">{b.v}</text>
                <text x={b.x + 26} y="131" textAnchor="middle" fontSize="7.5" fill="#a3b1c2">{b.l}</text>
              </g>
            ))}
            <text x="200" y="145" textAnchor="middle" fontSize="8.5" fill="#fb7185" fontWeight="700">controlling for each characteristic WIDENS the other’s spread</text>
          </svg>
          <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
            Because quality and cheapness are negatively correlated, each hides the other in raw sorts. The joint 50/50 strategy roughly <b>doubles the Sharpe ratio</b> of either leg: 0.65–0.78 vs the market’s 0.41 — with far shallower drawdowns.
          </div>
        </>
      )}
      {tab === 'insure' && (
        <>
          <svg viewBox="0 0 400 130" className="w-full">
            <text x="14" y="12" fontSize="8.5" fill="#a3b1c2">trailing 5-yr Sharpe (stylized shape of Novy-Marx’s figure)</text>
            <line x1="20" y1="70" x2="392" y2="70" stroke="#e2e8f0" />
            <path d="M 24 60 C 80 30, 130 34, 170 24 C 220 12, 260 58, 310 88 C 340 104, 370 96, 388 84" fill="none" stroke="#3b82f6" strokeWidth="2.2" />
            <path d="M 24 78 C 80 96, 130 92, 170 104 C 220 116, 260 66, 310 40 C 340 26, 370 36, 388 46" fill="none" stroke="#d97706" strokeWidth="2.2" />
            <text x="150" y="24" fontSize="8.5" fill="#93b8e8" fontWeight="700">profitability</text>
            <text x="300" y="34" fontSize="8.5" fill="#d97706" fontWeight="700">value</text>
            <text x="196" y="124" textAnchor="middle" fontSize="8.5" fill="#a3b1c2">late-1990s: profitability soars while value bleeds — and vice versa after</text>
          </svg>
          <div className="w-full rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-[11px] text-emerald-900">
            <b>Value insurance.</b> The two series are strongly negatively related: profitability’s best runs are value’s worst. The 50/50 mix is far more stable than either leg — this is why a growth-like factor belongs in a value shop.
          </div>
        </>
      )}
      {tab === 'zoo' && (
        <>
          <div className="w-full grid grid-cols-2 gap-1.5 text-[10.5px]">
            {[
              ['Graham’s 7 criteria (1934)', 'size, liquidity, 10yr earnings, 20yr dividends, growth, P/E≤15, P/B≤1.5'],
              ['Greenblatt magic formula', 'ROIC + earnings yield (EBIT/EV), best combined ranks'],
              ['Sloan accruals (1996)', 'earnings quality — cash vs accrual earnings'],
              ['Piotroski F-score (2000)', 'nine binary financial-strength signals'],
              ['Defensive (FP, Ang et al.)', 'low beta, low volatility — MKT loading −0.66 (t −20.4)'],
              ['Gross profitability (NM)', '(rev − COGS)/assets — the survivor'],
            ].map(([k, d], i) => (
              <div key={k} className={`rounded-lg border px-2 py-1.5 ${i === 5 ? 'bg-yale-800 text-white border-yale-800' : 'bg-white border-yale-200 text-yale-900'}`}>
                <div className="font-bold">{k}</div>
                <div className={i === 5 ? 'text-blue-100' : 'text-slate-500'}>{d}</div>
              </div>
            ))}
          </div>
          <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
            <b>Spanning verdict (Novy-Marx 2014):</b> all measures have <i>some</i> power — in small caps, and with value — but only gross profitability earns significant standalone returns, and its alpha survives every spanning regression (2.34–4.62%/yr). It subsumes most of the others. Carry one quality signal: this one.
          </div>
        </>
      )}
    </div>
  );
}
