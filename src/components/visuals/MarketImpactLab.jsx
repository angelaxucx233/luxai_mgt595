import { useState } from 'react';

/**
 * Lecture 10 — FIM market-impact functions (REAL embedded curve data).
 *  mode="function":    total/permanent/temporary MI vs %DTV + the size histogram.
 *  mode="endogeneity": aggressive-vs-passive + inflow curves — why the sqrt bends.
 */
export default function MarketImpactLab({ mode = 'function' }) {
  if (mode === 'endogeneity') return <Endogeneity />;
  return <Fn />;
}

// REAL data (bps at %DTV = 0,1,2,3,4,5), FIM slide 77
const F = {
  total: [2.46, 9.23, 12.23, 14.60, 16.66, 18.51],
  perm: [2.25, 4.06, 5.99, 7.95, 9.91, 11.88],
  temp: [0.21, 6.90, 8.61, 9.51, 9.98, 10.19],
};
// REAL histogram (orders per %DTV bucket)
const HIST = [['0–0.5', 1405055], ['0.5–1', 236618], ['1–1.5', 121911], ['1.5–2', 76485], ['2–2.5', 52589], ['2.5–3', 37930], ['3–3.5', 28342], ['3.5–4', 21568], ['4–4.5', 17171], ['4.5–5', 13776]];

const X0 = 44, XW = 68, Y0 = 118, YS = 4.6;
const px = (i) => X0 + i * XW;
const py = (v) => Y0 - v * YS;
const path = (a) => a.map((v, i) => `${i === 0 ? 'M' : 'L'} ${px(i)} ${py(v)}`).join(' ');

function Fn() {
  const [show, setShow] = useState({ total: true, perm: true, temp: true });
  const [tab, setTab] = useState('curves');
  const toggle = (k) => setShow((s) => ({ ...s, [k]: !s[k] }));
  const SERIES = [['total', '#3b82f6', 'total MI'], ['perm', '#059669', 'permanent (linear)'], ['temp', '#e11d48', 'temporary (√, concave)']];
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="flex gap-1.5">
        {[['curves', 'The impact curves'], ['hist', 'Where trading lives']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold border ${tab === k ? 'bg-yale-800 text-white border-yale-800' : 'bg-white text-yale-900 border-yale-200'}`}>{l}</button>
        ))}
      </div>
      {tab === 'curves' ? (
        <>
          <div className="flex gap-1.5">
            {SERIES.map(([k, c, l]) => (
              <button key={k} onClick={() => toggle(k)}
                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold border transition ${show[k] ? 'text-white' : 'bg-white text-slate-500 border-slate-200'}`}
                style={show[k] ? { background: c, borderColor: c } : {}}>{l}</button>
            ))}
          </div>
          <svg viewBox="0 0 400 152" className="w-full">
            <text x="14" y="12" fontSize="8.5" fill="#a3b1c2">market impact (bps) vs trade size (% of daily volume) — real data, $1.7T of executions</text>
            <line x1={X0 - 8} y1={Y0} x2="392" y2={Y0} stroke="#94a3b8" />
            {[0, 1, 2, 3, 4, 5].map((i) => <text key={i} x={px(i)} y={Y0 + 12} textAnchor="middle" fontSize="7.5" fill="#cbd5e1">{i}%</text>)}
            {[5, 10, 15].map((v) => (
              <g key={v}><line x1={X0 - 8} y1={py(v)} x2="392" y2={py(v)} stroke="#f1f5f9" /><text x={X0 - 12} y={py(v) + 3} textAnchor="end" fontSize="7" fill="#cbd5e1">{v}</text></g>
            ))}
            {show.total && <path d={path(F.total)} fill="none" stroke="#3b82f6" strokeWidth="2.4" />}
            {show.perm && <path d={path(F.perm)} fill="none" stroke="#059669" strokeWidth="2.2" />}
            {show.temp && <path d={path(F.temp)} fill="none" stroke="#e11d48" strokeWidth="2.2" strokeDasharray="5 3" />}
            {SERIES.map(([k, c]) => show[k] && F[k].map((v, i) => <circle key={k + i} cx={px(i)} cy={py(v)} r="2.4" fill={c} />))}
            {show.total && <text x={px(5) - 4} y={py(F.total[5]) - 6} textAnchor="end" fontSize="7.5" fill="#93b8e8" fontWeight="800">18.5</text>}
            {show.perm && <text x={px(5) - 4} y={py(F.perm[5]) + 11} textAnchor="end" fontSize="7.5" fill="#34d399" fontWeight="800">11.9</text>}
            {show.temp && <text x={px(5) - 4} y={py(F.temp[5]) - 6} textAnchor="end" fontSize="7.5" fill="#fb7185" fontWeight="800">10.2</text>}
          </svg>
          <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
            <b>Two laws in one curve:</b> the <span className="text-emerald-700 font-semibold">permanent</span> component rises in a straight line (2.25 → 11.9 bp; linearity can’t be rejected) — Kyle’s information model. The <span className="text-rose-600 font-semibold">temporary</span> component does all the bending (0.2 → 10.2 bp; log-log slope 0.49 — a textbook square root; linearity easily rejected). The universal “sqrt cost model” is really a statement about the price of immediacy.
          </div>
        </>
      ) : (
        <>
          <svg viewBox="0 0 400 148" className="w-full">
            <text x="14" y="12" fontSize="8.5" fill="#a3b1c2">number of orders by trade size (% of daily volume) — real histogram</text>
            <line x1="34" y1="116" x2="392" y2="116" stroke="#94a3b8" />
            {HIST.map(([l, v], i) => {
              const h = Math.max(2, (v / 1405055) * 92);
              return (
                <g key={l}>
                  <rect x={40 + i * 35} y={116 - h} width="26" height={h} fill="#3b82f6" opacity={0.9 - i * 0.06} rx="2.5" />
                  <text x={53 + i * 35} y={112 - h} textAnchor="middle" fontSize="6.3" fill="#93b8e8" fontWeight="700">{v >= 1e6 ? '1.4M' : (v / 1000).toFixed(0) + 'k'}</text>
                  <text x={53 + i * 35} y="127" textAnchor="middle" fontSize="6.5" fill="#cbd5e1">{l}</text>
                </g>
              );
            })}
            <text x="200" y="143" textAnchor="middle" fontSize="8" fill="#a3b1c2">% of daily trading volume</text>
          </svg>
          <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
            <b>Where real trading lives:</b> 1.4 million of the orders — the overwhelming mass — were under half a percent of daily volume, in single-digit-bp territory on the curve. Trade duration clusters at 6–7 hours: the algorithms’ patience is visible in the data. Capacity constraints bind eventually — but much later than the average-trade models claimed.
          </div>
        </>
      )}
    </div>
  );
}

// REAL inflow vs non-inflow curves (bps at %DTV = 0..5)
const INF = { no: [1.17, 9.70, 13.35, 16.21, 18.65, 20.83], yes: [2.59, 9.75, 14.22, 18.25, 22.05, 25.70] };

function Endogeneity() {
  const [tab, setTab] = useState('inflow');
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="flex gap-1.5">
        {[['story', 'Why the bend lies'], ['inflow', 'The inflow experiment']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold border ${tab === k ? 'bg-yale-800 text-white border-yale-800' : 'bg-white text-yale-900 border-yale-200'}`}>{l}</button>
        ))}
      </div>
      {tab === 'story' ? (
        <div className="w-full flex flex-col gap-1.5 text-[11px]">
          <div className="rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-yale-900">
            <b>The selection story:</b> traders are patient exactly when they expect impact to be high, and quick only when it’s cheap — so the measured curve’s right side is populated by the lucky. “The only large trades we do quickly are those with small MI, which makes the MI function <i>look</i> concave.”
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2">
              <div className="font-bold text-emerald-800">Passive trades (25th pct aggressiveness)</div>
              <div className="text-emerald-700 mt-0.5">Follow the square root — discretion intact, selection at work.</div>
            </div>
            <div className="rounded-xl border border-rose-300 bg-rose-50 px-3 py-2">
              <div className="font-bold text-rose-800">Aggressive trades (75th pct)</div>
              <div className="text-rose-700 mt-0.5">Linear — remove the discretion (closer to market orders) and the bend straightens; the √ term is rejected.</div>
            </div>
          </div>
          <div className="rounded-xl border border-yale-200 bg-white px-3 py-2 text-slate-600">
            Third test: <b>volume-forecast errors.</b> Unexpected participation (%DTV you didn’t choose) maps the true forced-trade function — again closer to linear. Brokers, for comparison, get <i>more</i> aggressive as orders surprise them, at an increasing rate.
          </div>
        </div>
      ) : (
        <>
          <svg viewBox="0 0 400 152" className="w-full">
            <text x="14" y="12" fontSize="8.5" fill="#a3b1c2">price impact (bps) vs %DTV: new-inflow trades (forced size) vs the rest — real data</text>
            <line x1={X0 - 8} y1={Y0} x2="392" y2={Y0} stroke="#94a3b8" />
            {[0, 1, 2, 3, 4, 5].map((i) => <text key={i} x={px(i)} y={Y0 + 12} textAnchor="middle" fontSize="7.5" fill="#cbd5e1">{i}%</text>)}
            {[5, 10, 15, 20, 25].map((v) => <line key={v} x1={X0 - 8} y1={Y0 - v * 3.6} x2="392" y2={Y0 - v * 3.6} stroke="#f1f5f9" />)}
            <path d={INF.no.map((v, i) => `${i === 0 ? 'M' : 'L'} ${px(i)} ${Y0 - v * 3.6}`).join(' ')} fill="none" stroke="#3b82f6" strokeWidth="2.2" />
            <path d={INF.yes.map((v, i) => `${i === 0 ? 'M' : 'L'} ${px(i)} ${Y0 - v * 3.6}`).join(' ')} fill="none" stroke="#e11d48" strokeWidth="2.4" strokeDasharray="6 3" />
            {INF.no.map((v, i) => <circle key={'n' + i} cx={px(i)} cy={Y0 - v * 3.6} r="2.4" fill="#3b82f6" />)}
            {INF.yes.map((v, i) => <circle key={'y' + i} cx={px(i)} cy={Y0 - v * 3.6} r="2.4" fill="#e11d48" />)}
            <text x={px(5) - 4} y={Y0 - INF.yes[5] * 3.6 - 6} textAnchor="end" fontSize="7.5" fill="#fb7185" fontWeight="800">inflows 25.7</text>
            <text x={px(5) - 4} y={Y0 - INF.no[5] * 3.6 + 12} textAnchor="end" fontSize="7.5" fill="#93b8e8" fontWeight="800">other trades 20.8</text>
          </svg>
          <div className="w-full rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-[11px] text-rose-900">
            <b>Forced size, honest curve:</b> first trades from new client inflows must be done — no discretion over size. Their curve is steeper, and the square-root term goes <i>insignificant</i>; with stock and day fixed effects, inflows face a <b>linear</b> impact function. Budget √size for trading you control; budget linear for trading that controls you — redemptions, rebalances, crisis exits. Hold that thought for the spirals.
          </div>
        </>
      )}
    </div>
  );
}
