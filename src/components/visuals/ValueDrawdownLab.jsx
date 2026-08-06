import { useState } from 'react';

/**
 * Lecture 4 — the 2017–20 value drawdown (AQR).
 *  mode="patience": P(underperform cash) = Φ(−SR·√h), interactive.
 *  mode="spread": stylized value-spread timeline + suspect elimination.
 *  mode="verdict": DFA-vs-LSV closing cards.
 */
export default function ValueDrawdownLab({ mode = 'patience' }) {
  if (mode === 'spread') return <Spread />;
  if (mode === 'verdict') return <Verdict />;
  return <Patience />;
}

// standard normal CDF (Zelen & Severo approximation)
function phi(z) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}

function Patience() {
  const [sr, setSr] = useState(0.4);
  const [h, setH] = useState(1);
  const p = phi(-sr * Math.sqrt(h)) * 100;
  const landmarks = [
    { h: 1, p: phi(-sr) * 100 },
    { h: 5, p: phi(-sr * Math.sqrt(5)) * 100 },
    { h: 10, p: phi(-sr * Math.sqrt(10)) * 100 },
    { h: 20, p: phi(-sr * Math.sqrt(20)) * 100 },
  ];
  const X = (hh) => 30 + ((hh - 0.5) / 24.5) * 355;
  const Y = (pp) => 128 - (pp / 50) * 112;
  const curve = [];
  for (let hh = 0.5; hh <= 25; hh += 0.5) curve.push(`${X(hh)},${Y(phi(-sr * Math.sqrt(hh)) * 100)}`);
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <svg viewBox="0 0 400 146" className="w-full">
        <line x1="30" y1="128" x2="392" y2="128" stroke="#94a3b8" /><line x1="30" y1="128" x2="30" y2="10" stroke="#94a3b8" />
        <text x="34" y="12" fontSize="8.5" fill="#64748b">P(lose to cash) %</text>
        <text x="388" y="140" textAnchor="end" fontSize="8.5" fill="#64748b">horizon (years)</text>
        <polyline points={curve.join(' ')} fill="none" stroke="#00356b" strokeWidth="2.4" />
        {landmarks.map((l) => (
          <g key={l.h}>
            <circle cx={X(l.h)} cy={Y(l.p)} r="3.5" fill="#d97706" stroke="#00356b" />
            <text x={X(l.h)} y={Y(l.p) - 7} textAnchor="middle" fontSize="8.5" fill="#b45309" fontWeight="700">{l.h}y: {l.p.toFixed(0)}%</text>
          </g>
        ))}
        <circle cx={X(h)} cy={Y(p)} r="5" fill="#e11d48" stroke="white" strokeWidth="1.5" />
      </svg>
      <div className="w-full flex gap-3">
        <label className="flex-1 text-xs text-slate-600 flex items-center gap-2">
          <span className="w-24">SR = <b className="text-yale-900">{sr.toFixed(2)}</b></span>
          <input type="range" min="0.1" max="1.0" step="0.05" value={sr} onChange={(e) => setSr(+e.target.value)} className="flex-1 accent-yale-700" />
        </label>
        <label className="flex-1 text-xs text-slate-600 flex items-center gap-2">
          <span className="w-24">h = <b className="text-yale-900">{h}</b> yr</span>
          <input type="range" min="1" max="25" step="1" value={h} onChange={(e) => setH(+e.target.value)} className="flex-1 accent-amber-600" />
        </label>
      </div>
      <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11.5px] text-yale-900 font-mono">
        P(underperform cash, {h}yr) = Φ(−{sr.toFixed(2)}·√{h}) = <b>{p.toFixed(1)}%</b>
      </div>
      <p className="text-[11px] text-slate-500 leading-snug">At SR = 0.4 — roughly the US market\u2019s own — you lose to cash ≈34% of years and ≈10% of decades. Every drawdown (all four value measures fell ≈−50% over 2017–20, the worst run since 1825) is either a broken premium or an ordinary draw of an unbroken one. This curve is the base rate.</p>
    </div>
  );
}

// stylized spread timeline (percentile of history)
const SPREAD = [
  [1988, 55], [1990, 58], [1992, 50], [1994, 48], [1996, 52], [1998, 72], [1999, 90], [2000, 97],
  [2001, 80], [2003, 55], [2005, 48], [2007, 52], [2009, 70], [2011, 55], [2013, 50], [2015, 55],
  [2017, 68], [2018, 80], [2019, 92], [2020, 99], [2021, 95], [2022, 88], [2023, 85],
];
const SUSPECTS = [
  ['Mega-caps / FANGs', 'Drop the largest 10%, all of tech-media-telecom, or the most-expensive decile — the spread barely moves (both series near the 90th percentile).'],
  ['Intangibles', 'Drop the high-intangible names — still historically wide.'],
  ['Deserved cheapness', 'Profitability, ROA, margin and 5-yr growth gaps between cheap and expensive stayed within their normal ranges.'],
  ['Recessions & crashes', 'Value shows little sensitivity to NBER recessions or the 10 worst market drawdowns.'],
  ['Interest rates', 'Correlation rose (≈0.1 → 0.5) but rates explain only 15–30% of the move (Maloney–Moskowitz 2020).'],
];

function Spread() {
  const [checked, setChecked] = useState([]);
  const X = (yr) => 26 + ((yr - 1988) / 35) * 366;
  const Y = (pct) => 118 - ((pct - 40) / 62) * 100;
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <svg viewBox="0 0 400 132" className="w-full">
        <line x1="26" y1="118" x2="392" y2="118" stroke="#94a3b8" /><line x1="26" y1="118" x2="26" y2="10" stroke="#94a3b8" />
        <line x1="26" y1={Y(50)} x2="392" y2={Y(50)} stroke="#e2e8f0" strokeDasharray="4 3" />
        <text x="30" y={Y(50) - 3} fontSize="7.5" fill="#94a3b8">median</text>
        <polyline points={SPREAD.map(([y, v]) => `${X(y)},${Y(v)}`).join(' ')} fill="none" stroke="#00356b" strokeWidth="2.4" />
        <circle cx={X(2000)} cy={Y(97)} r="4" fill="#d97706" stroke="#00356b" />
        <text x={X(2000)} y={Y(97) - 7} textAnchor="middle" fontSize="8" fill="#b45309" fontWeight="700">2000 tech bubble</text>
        <circle cx={X(2020)} cy={Y(99)} r="5" fill="#e11d48" stroke="white" strokeWidth="1.5" />
        <text x={X(2020) - 6} y={Y(99) + 14} textAnchor="end" fontSize="8" fill="#e11d48" fontWeight="800">2020: 99th pct</text>
        {[1990, 2000, 2010, 2020].map((y) => <text key={y} x={X(y)} y="130" textAnchor="middle" fontSize="7.5" fill="#64748b">{y}</text>)}
        <text x="30" y="12" fontSize="8.5" fill="#64748b">value spread (percentile of history) — stylized after AQR</text>
      </svg>
      <div className="w-full flex flex-col gap-1">
        {SUSPECTS.map(([name, body], i) => (
          <button key={name} onClick={() => setChecked((c) => (c.includes(i) ? c : [...c, i]))}
            className={`w-full text-left rounded-lg border px-2.5 py-1.5 text-[11px] transition-colors ${checked.includes(i) ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-white border-yale-200 text-yale-900 hover:bg-yale-50'}`}>
            <span className={`font-bold ${checked.includes(i) ? 'line-through' : ''}`}>{name}</span>
            {checked.includes(i) && <span className="ml-2 text-rose-600 font-black no-underline">RULED OUT</span>}
            {checked.includes(i) && <div className="text-slate-500">{body}</div>}
          </button>
        ))}
      </div>
      {checked.length === SUSPECTS.length && (
        <div className="w-full rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-[11px] text-amber-900">
          <b>What survives: re-pricing.</b> Justifying the 2020 spread required expensive firms to out-grow cheap ones by <b>80–110% over five years</b> — bigger than any differential ever realized. LSV\u2019s extrapolation error at full scale; last analog: 1999–2000. Recovery began Nov 2020 (post-2000 recoveries ran +75–108%); spreads in 2023–24 were still 80th–90th percentile.
        </div>
      )}
      <p className="text-[11px] text-slate-500 leading-snug">Click each suspect to put it on trial. A widening spread <i>is</i> the drawdown; a wide spread is the forward-looking setup.</p>
    </div>
  );
}

function Verdict() {
  return (
    <div className="w-full max-w-lg flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-yale-50 border border-yale-100 px-3 py-2">
          <div className="text-xs font-bold text-yale-900">Reads as behavioral (LSV)</div>
          <p className="text-[11px] text-yale-900/90 leading-snug">A re-pricing, not fundamentals; spreads <i>predict</i> returns; a near-replay of 1999–2000; the mistake visibly widened, then corrected.</p>
        </div>
        <div className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-2">
          <div className="text-xs font-bold text-amber-900">Reads as risk (FF)</div>
          <p className="text-[11px] text-amber-900/90 leading-snug">A genuine premium can go negative for a decade; in real time you can\u2019t tell a bad draw from a vanished premium; the spread could be a time-varying <i>price of risk</i>.</p>
        </div>
      </div>
      <div className="rounded-xl bg-white border border-slate-200 px-3 py-2 text-[11px] text-slate-700">
        <b>The commercial twin:</b> Dimensional (DFA) sells value as risk you\u2019re <i>paid to bear</i>; LSV Asset Management sells it as a <i>mistake you exploit</i>. Their portfolios are ≈<b>0.98 correlated</b> — same stocks, opposite stories. The story isn\u2019t decoration: it decides whether the client is still invested in November 2020 when the recovery starts.
      </div>
      <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-[11px] text-emerald-900">
        <b>The investor\u2019s job, either way:</b> size the exposure to <i>survive</i> the −50% stretch, treat the valuation spread (not recent returns) as the forward signal, and lean in when it\u2019s wide.
      </div>
    </div>
  );
}
