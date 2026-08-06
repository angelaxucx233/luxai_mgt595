import { useState } from 'react';

/**
 * Lecture 5 — the underreaction family, real data.
 * Tabs: PEAD (real SUE-quintile CAR lines) · Disposition · Order flow · Customer momentum (real CF drift line).
 */
export default function UnderreactionGallery() {
  const [tab, setTab] = useState('pead');
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="flex flex-wrap gap-1.5 justify-center">
        {[['pead', 'Earnings drift'], ['disp', 'Disposition'], ['flow', 'Who does it'], ['cust', 'Customer links']].map(([id, name]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border ${tab === id ? 'bg-yale-700 text-white border-yale-700' : 'bg-white text-yale-900 border-yale-200 hover:bg-yale-50'}`}>{name}</button>
        ))}
      </div>
      {tab === 'pead' && <Pead />}
      {tab === 'disp' && <Disp />}
      {tab === 'flow' && <Flow />}
      {tab === 'cust' && <Cust />}
    </div>
  );
}

// real tikz coordinates from the deck
const SUE5 = [[0, 0.9], [5, 1.5], [10, 1.7], [15, 2.2], [20, 2.5], [25, 2.9], [30, 3.1], [35, 3.5], [40, 3.6], [45, 3.9], [50, 4.0], [55, 4.1], [60, 4.3]];
const SUE4 = [[0, 0.4], [10, 0.8], [20, 1.1], [30, 1.4], [40, 1.5], [50, 1.8], [60, 1.9]];
const SUE3 = [[0, 0.1], [15, 0.0], [30, 0.2], [45, 0.1], [60, 0.3]];
const SUE2 = [[0, -0.3], [10, -0.6], [20, -0.8], [30, -1.1], [40, -1.1], [50, -1.3], [60, -1.4]];
const SUE1 = [[0, -0.7], [5, -1.2], [10, -1.5], [15, -1.9], [20, -2.2], [25, -2.5], [30, -2.6], [35, -2.9], [40, -3.0], [45, -3.2], [50, -3.3], [55, -3.3], [60, -3.5]];

function Pead() {
  const X = (d) => 34 + (d / 60) * 350;
  const Y = (v) => 70 - (v / 5) * 58;
  const line = (pts, color, w = 2.2) => (
    <polyline points={pts.map(([d, v]) => `${X(d)},${Y(v)}`).join(' ')} fill="none" stroke={color} strokeWidth={w} />
  );
  return (
    <div className="w-full flex flex-col items-center gap-2">
      <svg viewBox="0 0 400 152" className="w-full">
        <line x1="34" y1={Y(0)} x2="390" y2={Y(0)} stroke="#cbd5e1" />
        <line x1="34" y1="136" x2="34" y2="8" stroke="#94a3b8" />
        {line(SUE5, '#00356b', 2.6)}{line(SUE4, '#3b5f8a')}{line(SUE3, '#94a3b8', 1.6)}{line(SUE2, '#d97706')}{line(SUE1, '#e11d48', 2.6)}
        <text x={X(60) - 2} y={Y(4.3) - 5} textAnchor="end" fontSize="8.5" fill="#00356b" fontWeight="800">SUE 5 (best surprise): +4.3%</text>
        <text x={X(60) - 2} y={Y(-3.5) + 12} textAnchor="end" fontSize="8.5" fill="#e11d48" fontWeight="800">SUE 1 (worst): −3.5%</text>
        <text x="200" y="150" textAnchor="middle" fontSize="8" fill="#64748b">trading days after the earnings announcement</text>
        <text x="38" y="12" fontSize="8.5" fill="#64748b">cumulative return (%)</text>
      </svg>
      <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
        <b>Post-earnings-announcement drift:</b> after the announcement — when the news is fully public — prices keep drifting in the surprise\u2019s direction for ~60 trading days (Bernard–Thomas 1989). The analyst-revision version (earnings momentum) drifts for ~12 months, is <b>distinct</b> from price momentum, combines profitably with it, and appears in <b>34 markets</b>.
      </div>
    </div>
  );
}

function Disp() {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="rounded-xl bg-white border border-slate-200 px-3 py-2 text-[11px] text-slate-700">
        <b>The bias:</b> investors sell winners too early and ride losers too long — mental accounting anchors on the purchase price, and prospect theory makes people risk-averse over gains (sell!) and risk-seeking over losses (hold and hope). That selling pressure on winners and reluctant supply from losers slows the price\u2019s adjustment to news: <b>underreaction, mechanically produced</b>.
      </div>
      <div className="rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
        <b>Frazzini (2006) makes it measurable</b> — the capital-gains overhang g = (P − RP)/P, with the reference price RP built from mutual-fund holdings. Prediction: drift is worst when the news and the holders\u2019 paper position <i>align</i> (bad news + holders under water; good news + holders in the money).
      </div>
      <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-[11px] text-emerald-900">
        <b>The result:</b> when news and overhang align, the long-short post-event drift runs <b>2.1–2.5%/month</b>; when they conflict, it largely <b>vanishes</b>. Survives controls for ownership, turnover, characteristics, SUE, and analyst revisions — a micro-foundation for momentum with its own alpha.
      </div>
    </div>
  );
}

function Flow() {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="rounded-xl bg-white border border-slate-200 px-3 py-2 text-[11px] text-slate-700">
        <b>The forensic tool (Lee–Ready 1991):</b> sign each trade buyer- or seller-initiated by comparing its price to the bid–ask midpoint; classify trades small vs large by dollar cutoffs. Small trades proxy for <i>individuals</i>, large for <i>institutions</i>. Imbalance = (buys − sells)/(buys + sells), computed separately by size.
      </div>
      <div className="rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
        <b>Hvidkjaer\u2019s finding:</b> among past <b>winners</b>, initial small-trade <i>buying</i> pressure slowly converts into intense <i>selling</i> pressure over the following year — underreaction, then delayed reaction, by small traders. <b>Large-trade imbalances show no such pattern</b> and little effect on subsequent returns.
      </div>
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-[11px] text-amber-900">
        <b>Why it matters:</b> the drift isn\u2019t an anonymous market failure — the order flow points at less-sophisticated individual investors as the marginal slow reactors, exactly whom the behavioral models require.
      </div>
    </div>
  );
}

// real CF Figure 3 recreation coordinates
const CF = [[-2, 0], [-1, 0], [0, 3.9], [1, 4.6], [2, 5.2], [3, 5.8], [4, 6.4], [6, 7.3], [8, 7.9], [10, 8.4], [12, 8.6]];

function Cust() {
  const X = (m) => 40 + ((m + 2) / 14) * 344;
  const Y = (v) => 108 - (v / 9.5) * 92;
  return (
    <div className="w-full flex flex-col items-center gap-2">
      <svg viewBox="0 0 400 138" className="w-full">
        <line x1="40" y1={Y(0)} x2="388" y2={Y(0)} stroke="#cbd5e1" />
        <line x1={X(0)} y1={Y(0)} x2={X(0)} y2={Y(3.9)} stroke="#94a3b8" strokeDasharray="4 3" />
        <polyline points={CF.map(([m, v]) => `${X(m)},${Y(v)}`).join(' ')} fill="none" stroke="#00356b" strokeWidth="2.6" />
        {CF.map(([m, v]) => <circle key={m} cx={X(m)} cy={Y(v)} r="2.4" fill="#00356b" />)}
        <text x={X(0) + 4} y={Y(3.9) + 12} fontSize="8.5" fill="#00356b" fontWeight="700">+3.9% on the news month</text>
        <text x={X(12) - 2} y={Y(8.6) - 6} textAnchor="end" fontSize="8.5" fill="#d97706" fontWeight="800">+4.7% more drift over the year</text>
        <text x="200" y="134" textAnchor="middle" fontSize="8" fill="#64748b">months relative to the customer-return month</text>
        <text x="44" y="12" fontSize="8.5" fill="#64748b">supplier cumulative L/S return (%) — Cohen–Frazzini (2008), Fig. 3</text>
      </svg>
      <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
        <b>The Coastcast–Callaway parable:</b> Callaway was <b>50% of Coastcast\u2019s sales</b> — a disclosed, public link. When Callaway cut guidance and fell ~30% (July 2001), Coastcast barely moved… then drifted down for <b>weeks</b>. Systematically: sort suppliers on their principal customers\u2019 last-month return, and the long-short earns a <b>four-factor alpha of 1.38%/month (t = 3.1) — ≈18%/year</b> — surviving the FF factors and both own and industry momentum.
      </div>
      <p className="text-[11px] text-slate-500 leading-snug">Limited attention: investors underweight information that arrives via an economic link, even a publicly disclosed one. Information moves faster than prices — the family motto.</p>
    </div>
  );
}
