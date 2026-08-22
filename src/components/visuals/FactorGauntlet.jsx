import { useState } from 'react';

/**
 * Lecture 7 — the four-criteria gauntlet applied to value and momentum, and the course verdict.
 *  mode="gauntlet": criteria cards + value tab (five constructions, OOS bars) + momentum tab (16-grid, OOS bars).
 *  mode="verdict":  citation concentration + the closing rule.
 */
export default function FactorGauntlet({ mode = 'gauntlet' }) {
  if (mode === 'verdict') return <Verdict />;
  return <Gauntlet />;
}

const MOM_GRID = [
  [1.10, 2.29, 2.69, 3.53],
  [2.44, 3.07, 3.76, 3.36],
  [3.03, 3.78, 3.47, 2.89],
  [3.74, 3.40, 2.95, 2.25],
]; // rows: 3/6/9/12-month lookback; cols: 3/6/9/12-month hold

function Gauntlet() {
  const [tab, setTab] = useState('value');
  const [view, setView] = useState('robust');
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="w-full grid grid-cols-4 gap-1 text-[9.5px] text-center">
        {[['1', 't ≥ 3 originally'], ['2', 'robust to spec'], ['3', 'out of sample'], ['4', 'a real story']].map(([n, l]) => (
          <div key={n} className="rounded-lg bg-yale-800 text-white px-1 py-1"><b>{n}.</b> {l}</div>
        ))}
      </div>
      <div className="flex gap-1.5">
        {[['value', 'Value'], ['mom', 'Momentum']].map(([k, l]) => (
          <button key={k} onClick={() => { setTab(k); setView('robust'); }}
            className={`rounded-full px-3.5 py-1 text-[11px] font-semibold border ${tab === k ? 'bg-yale-800 text-white border-yale-800' : 'bg-white text-yale-900 border-yale-200'}`}>{l}</button>
        ))}
        <button onClick={() => setView(view === 'robust' ? 'oos' : 'robust')}
          className="rounded-full px-3.5 py-1 text-[11px] font-semibold border bg-white text-emerald-700 border-emerald-300">
          {view === 'robust' ? 'show out-of-sample →' : '← show robustness'}
        </button>
      </div>

      {tab === 'value' && view === 'robust' && (
        <>
          <svg viewBox="0 0 400 142" className="w-full">
            <text x="14" y="12" fontSize="8.5" fill="#a3b1c2">avg return %/yr, 1951–2014 — five constructions and the composite</text>
            <line x1="26" y1="112" x2="392" y2="112" stroke="#94a3b8" />
            {[
              ['B/P', 3.6], ['E/P', 5.3], ['CF/P', 4.5], ['D/P', 1.8], ['LT-rev', 2.5], ['Composite', 3.5],
            ].map(([l, v], i) => (
              <g key={l}>
                <rect x={34 + i * 60} y={112 - v * 17} width="44" height={v * 17} fill={i === 5 ? '#d97706' : '#3b82f6'} rx="4" />
                <text x={56 + i * 60} y={112 - v * 17 - 5} textAnchor="middle" fontSize="9.5" fill={i === 5 ? '#d97706' : '#66b2ff'} fontWeight="800">{v.toFixed(1)}</text>
                <text x={56 + i * 60} y="125" textAnchor="middle" fontSize="8" fill="#a3b1c2">{l}</text>
              </g>
            ))}
            <text x="200" y="139" textAnchor="middle" fontSize="8.5" fill="#34d399" fontWeight="700">every construction positive — and the composite ≈ the average of its parts, not the max</text>
          </svg>
          <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
            <b>Criterion 2, passed.</b> Book, earnings, cash flow, dividends, and long-term reversal all pick up the same premium; the weakest (D/P) still earns 1.8%. Value is a property of cheapness itself, not of one lucky ratio. Criteria 1 and 4: original t-stats clear 3, and value carries <i>two</i> live stories — risk (distress, prolonged droughts) and behavioral (neglect, extrapolation) — each making further testable predictions.
          </div>
        </>
      )}
      {tab === 'value' && view === 'oos' && (
        <>
          <svg viewBox="0 0 400 162" className="w-full">
            <text x="14" y="12" fontSize="8.5" fill="#a3b1c2">value t-stats in and out of sample, 1/1920–2/2017</text>
            <g transform="translate(0, 22)">
            <line x1="26" y1="112" x2="392" y2="112" stroke="#94a3b8" />
            {[
              ['US stocks · OOS', 3.62, '#3b82f6'], ['non-US · full', 4.49, '#0f766e'], ['non-US · OOS', 2.93, '#d97706'],
            ].map(([l, v, c], i) => (
              <g key={l}>
                <rect x={58 + i * 116} y={112 - v * 18} width="76" height={v * 18} fill={c} rx="4" />
                <text x={96 + i * 116} y={112 - v * 18 - 5} textAnchor="middle" fontSize="10.5" fill={c} fontWeight="800">{v.toFixed(2)}</text>
                <text x={96 + i * 116} y="125" textAnchor="middle" fontSize="8" fill="#a3b1c2">{l}</text>
              </g>
            ))}
            <line x1="26" y1={112 - 3 * 18} x2="392" y2={112 - 3 * 18} stroke="#e11d48" strokeWidth="1.3" strokeDasharray="5 4" />
            <text x="380" y={112 - 3 * 18 - 4} textAnchor="end" fontSize="8" fill="#fb7185" fontWeight="700">t = 3</text>
          
            </g>
          </svg>
          <div className="w-full rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-[11px] text-emerald-900">
            <b>Criterion 3, passed.</b> Before and after the original sample in the US: t = 3.62. In countries never used to discover it: 4.49 full-sample, 2.93 out of sample — essentially at the t = 3 bar. The premium is not confined to the data that found it.
          </div>
        </>
      )}
      {tab === 'mom' && view === 'robust' && (
        <>
          <svg viewBox="0 0 400 176" className="w-full">
            <text x="14" y="12" fontSize="8.5" fill="#a3b1c2">t-stats of 16 momentum constructions, 1965–1989 — lookback × holding period</text>
            <g transform="translate(0, 22)">
            <line x1="26" y1="118" x2="392" y2="118" stroke="#94a3b8" />
            {MOM_GRID.flatMap((row, r) => row.map((v, cIdx) => {
              const i = r * 4 + cIdx;
              const fail = v < 2;
              return (
                <g key={i}>
                  <rect x={30 + i * 22.6} y={118 - v * 26} width="17" height={v * 26} fill={fail ? '#94a3b8' : '#3b82f6'} rx="2" opacity={fail ? 0.6 : 0.85} />
                  <text x={38.5 + i * 22.6} y={118 - v * 26 - 3} textAnchor="middle" fontSize="6.2" fill={fail ? '#94a3b8' : '#66b2ff'} fontWeight="700">{v.toFixed(2)}</text>
                </g>
              );
            }))}
            <line x1="26" y1={118 - 2 * 26} x2="392" y2={118 - 2 * 26} stroke="#e11d48" strokeWidth="1.3" strokeDasharray="5 4" />
            <text x="388" y={118 - 2 * 26 - 4} textAnchor="end" fontSize="8" fill="#fb7185" fontWeight="700">t = 2</text>
            {['3mo look-back', '6mo', '9mo', '12mo'].map((l, i) => (
              <text key={l} x={75 + i * 90.4} y="131" textAnchor="middle" fontSize="7.5" fill="#a3b1c2">{l}</text>
            ))}
            <text x="200" y="146" textAnchor="middle" fontSize="8.5" fill="#34d399" fontWeight="700">15 of 16 clear t = 2 — the single failure is the 3-month/3-month cell (1.10), in grey</text>
          
            </g>
          </svg>
          <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
            <b>Criterion 2, passed.</b> Four look-backs × four holding periods, on a 25-year sample ending in 1989: every combination but the shortest-shortest clears t = 2. The result is a property of the <i>signal</i>, not of one formation/holding pair. Criterion 4: risk (winners’ cost of capital shifts) and behavioral (underreaction, then delayed overreaction, reversing long term) stories both live.
          </div>
        </>
      )}
      {tab === 'mom' && view === 'oos' && (
        <>
          <svg viewBox="0 0 400 138" className="w-full">
            <text x="14" y="12" fontSize="8.5" fill="#a3b1c2">momentum t-stats in and out of sample, 1/1920–2/2017</text>
            <line x1="26" y1="112" x2="392" y2="112" stroke="#94a3b8" />
            {[
              ['US stocks · OOS', 2.78, '#3b82f6'], ['non-US · full', 4.49, '#0f766e'], ['non-US · OOS', 5.99, '#d97706'],
            ].map(([l, v, c], i) => (
              <g key={l}>
                <rect x={58 + i * 116} y={112 - v * 14.5} width="76" height={v * 14.5} fill={c} rx="4" />
                <text x={96 + i * 116} y={112 - v * 14.5 - 5} textAnchor="middle" fontSize="10.5" fill={c} fontWeight="800">{v.toFixed(2)}</text>
                <text x={96 + i * 116} y="125" textAnchor="middle" fontSize="8" fill="#a3b1c2">{l}</text>
              </g>
            ))}
            <line x1="26" y1={112 - 3 * 14.5} x2="392" y2={112 - 3 * 14.5} stroke="#e11d48" strokeWidth="1.3" strokeDasharray="5 4" />
            <text x="380" y={112 - 3 * 14.5 - 4} textAnchor="end" fontSize="8" fill="#fb7185" fontWeight="700">t = 3</text>
          </svg>
          <div className="w-full rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-[11px] text-emerald-900">
            <b>The most convincing number in the lecture.</b> Momentum’s non-US <i>out-of-sample</i> t-stat (5.99) exceeds its full-sample one (4.49). No selection bias, no data mining, no publication filter can manufacture strength in a sample nobody selected. Momentum did not merely survive leaving home — it got stronger.
          </div>
        </>
      )}
    </div>
  );
}

const CITES = [
  ['Value', 72.1], ['Size', 58.1], ['Momentum', 33.1], ['Beta', 19.4], ['FSQ', 18.3],
  ['Reversal', 14.1], ['LIQ', 10.8], ['Default', 7.7], ['ESG', 7.1], ['LIQ Risk', 6.5], ['17 more…', 5.2],
];

function Verdict() {
  return (
    <div className="w-full max-w-lg flex flex-col gap-2.5">
      <svg viewBox="0 0 400 140" className="w-full">
        <text x="14" y="12" fontSize="8.5" fill="#a3b1c2">citations by factor (thousands, Google Scholar)</text>
        <line x1="26" y1="112" x2="392" y2="112" stroke="#94a3b8" />
        {CITES.map(([l, v], i) => (
          <g key={l}>
            <rect x={30 + i * 33} y={112 - v * 1.28} width="26" height={v * 1.28} fill={i < 5 ? '#3b82f6' : '#94a3b8'} rx="3" opacity={i < 5 ? 0.95 : 0.55} />
            <text x={43 + i * 33} y={112 - v * 1.28 - 4} textAnchor="middle" fontSize="7" fill={i < 5 ? '#66b2ff' : '#94a3b8'} fontWeight="700">{v.toFixed(1)}</text>
            <text x={43 + i * 33} y="124" textAnchor="middle" fontSize="6" fill="#a3b1c2">{l}</text>
          </g>
        ))}
        <text x="200" y="137" textAnchor="middle" fontSize="8.5" fill="#d97706" fontWeight="700">≈ 90% of all factor citations sit in the first five bars</text>
      </svg>
      <div className="rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
        <b>Impact-weighted, the field already knows.</b> Value, size, momentum, beta, and quality dominate attention — and they are precisely the factors that clear the gauntlet. The equal-weighted index of survivors carries <b>t &gt; 11</b>: over a trillion random trials to fake, against the field’s ~400. Time wasted on data-mined factors is smaller than the zoo’s size suggests.
      </div>
      <div className="rounded-xl bg-yale-800 text-white px-3 py-2 text-[11.5px]">
        <b>The rule to leave the course with:</b> before believing a factor exists, demand a t-stat ≥ 3, robustness to specification, out-of-sample evidence in time and geography, and an economic story. Then size every position so that being wrong is survivable. Most factors don’t matter — <b>a few really do.</b>
      </div>
      <p className="text-[11px] text-slate-500 leading-snug">Straight replication remains the harshest lens — Hou, Xue &amp; Zhang: 64% of 447 anomalies fail at 5%, 85% at t = 3 — which is exactly why the handful that passes everything is worth the entire zoo.</p>
    </div>
  );
}
