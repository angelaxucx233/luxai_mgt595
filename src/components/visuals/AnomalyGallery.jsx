import { useState } from 'react';

/** Lecture 3 — four exhibits with the deck's original data. */
export default function AnomalyGallery() {
  const [tab, setTab] = useState('size');
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="flex gap-1.5 flex-wrap justify-center">
        {[['size', 'Size'], ['jan', 'January'], ['contrarian', 'Contrarian'], ['momvalue', 'Momentum & Value']].map(([id, name]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border ${tab === id ? 'bg-yale-700 text-white border-yale-700' : 'bg-white text-yale-900 border-yale-200 hover:bg-yale-50'}`}>{name}</button>
        ))}
      </div>
      {tab === 'size' && <Size />}
      {tab === 'jan' && <January />}
      {tab === 'contrarian' && <Contrarian />}
      {tab === 'momvalue' && <MomValue />}
    </div>
  );
}

const SIZE = [
  ['Smallest', 19.8, 1.17, 9.7], ['2', 17.8, 1.19, 23.2], ['3', 16.1, 1.15, 41.4], ['4', 15.4, 1.17, 68.0], ['5', 16.0, 1.11, 109.8],
  ['6', 14.5, 1.05, 178.9], ['7', 14.4, 1.04, 291.4], ['8', 14.8, 1.03, 502.3], ['9', 13.0, 1.01, 902.1], ['Largest', 11.9, 0.95, 3983.0],
];
function Size() {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full rounded-xl border border-slate-200 overflow-hidden text-[11px]">
        <div className="grid grid-cols-4 bg-yale-900 text-white font-semibold"><div className="px-2 py-1">Decile</div><div className="px-2 py-1 text-right">Return %/yr</div><div className="px-2 py-1 text-right">β</div><div className="px-2 py-1 text-right">Cap $m</div></div>
        {SIZE.map(([n, r, b, c], i) => (
          <div key={n} className={`grid grid-cols-4 border-t border-slate-100 font-mono ${i === 0 || i === 9 ? 'bg-amber-50 font-bold' : 'bg-white'}`}>
            <div className="px-2 py-1">{n}</div>
            <div className="px-2 py-1 text-right text-yale-900">{r.toFixed(1)}</div>
            <div className="px-2 py-1 text-right text-slate-600">{b.toFixed(2)}</div>
            <div className="px-2 py-1 text-right text-slate-500">{c.toLocaleString()}</div>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-slate-500 leading-snug">Hawawini–Keim (1995), VW NYSE/AMEX deciles, 1951–89. An 8-point return spread against a 0.22 beta spread — with a 6% premium, beta explains ≈1.3 points of the 7.9. Mispricing, or a missing risk factor?</p>
    </div>
  );
}

const JAN = [['Jan', 0.70], ['Feb', 0.28], ['Mar', 0.21], ['Apr', 0.13], ['May', 0.15], ['Jun', 0.10], ['Jul', 0.18], ['Aug', 0.14], ['Sep', 0.17], ['Oct', -0.05], ['Nov', 0.05], ['Dec', 0.13]];
function January() {
  const Y = (v) => 118 - (v / 0.75) * 100;
  return (
    <div className="w-full flex flex-col gap-2">
      <svg viewBox="0 0 400 138" className="w-full">
        <line x1="18" y1={Y(0)} x2="392" y2={Y(0)} stroke="#94a3b8" />
        {JAN.map(([m, v], i) => (
          <g key={m}>
            <rect x={22 + i * 31} y={v >= 0 ? Y(v) : Y(0)} width="24" height={Math.abs(Y(v) - Y(0))} fill={i === 0 ? '#d97706' : '#00356b'} rx="2" />
            <text x={34 + i * 31} y="132" textAnchor="middle" fontSize="8" fill="#64748b">{m}</text>
            {i === 0 && <text x={34} y={Y(v) - 5} textAnchor="middle" fontSize="9" fill="#b45309" fontWeight="800">0.70%</text>}
          </g>
        ))}
      </svg>
      <p className="text-[11px] text-slate-500 leading-snug">Small-firm premium by calendar month. January towers over everything — and <b>3/4 of it lands in the first five trading days</b>. Suspects: tax-loss selling (weakened by international evidence), window dressing, new-year capital. The efficiency question: why doesn't buying in December front-run it away? (Cousins: negative Mondays, the weekend effect, turn-of-month and pre-holiday returns — Lakonishok–Smidt 1988.)</p>
    </div>
  );
}

function Contrarian() {
  const X = (m) => 22 + (m / 60) * 366;
  const Y = (c) => 108 - ((c + 0.15) / 0.5) * 92;
  const loser = [], winner = [];
  for (let m = 0; m <= 60; m += 2) {
    loser.push(`${X(m)},${Y(0.33 * (1 - Math.exp(-m / 16)))}`);
    winner.push(`${X(m)},${Y(-0.105 * (1 - Math.exp(-m / 14)))}`);
  }
  return (
    <div className="w-full flex flex-col gap-2">
      <svg viewBox="0 0 400 126" className="w-full">
        <line x1="22" y1={Y(0)} x2="390" y2={Y(0)} stroke="#e2e8f0" strokeDasharray="4 3" />
        <line x1="22" y1="112" x2="390" y2="112" stroke="#94a3b8" /><line x1="22" y1="112" x2="22" y2="8" stroke="#94a3b8" />
        <polyline points={loser.join(' ')} fill="none" stroke="#00356b" strokeWidth="2.4" />
        <polyline points={winner.join(' ')} fill="none" stroke="#e11d48" strokeWidth="2.4" />
        <text x={X(38)} y={Y(0.30) - 5} fontSize="9.5" fill="#00356b" fontWeight="700">Past losers: +0.30</text>
        <text x={X(38)} y={Y(-0.10) + 13} fontSize="9.5" fill="#e11d48" fontWeight="700">Past winners: −0.10</text>
        <text x="386" y="124" textAnchor="end" fontSize="8.5" fill="#64748b">months after formation (0–60)</text>
      </svg>
      <p className="text-[11px] text-slate-500 leading-snug">DeBondt–Thaler (1985): rank on the past 3 years, then watch the next 5. The bottom decile beats the top by ≈40 cumulative points. Overreaction — or are fallen angels just riskier? Past returns are noisy proxies for expected returns, which pushed researchers toward D/P and E/P.</p>
    </div>
  );
}

function MomValue() {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="rounded-xl bg-yale-50 border border-yale-100 px-3 py-2">
        <div className="text-xs font-bold text-yale-900">Momentum (3–12 months)</div>
        <p className="text-[11px] text-yale-900/90 leading-snug">Recent relative winners keep beating recent losers — the <i>opposite</i> sign of contrarian at the opposite horizon. Underreaction to news, or risk? Reconciling both facts needs a story with short-run continuation and long-run reversal.</p>
      </div>
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-2">
        <div className="text-xs font-bold text-amber-900">Value vs growth</div>
        <p className="text-[11px] text-amber-900/90 leading-snug">High B/M, C/P, E/P portfolios dramatically outperform their glamour opposites. Rational reading: a distress factor — value stocks are fallen angels bearing recession risk. Irrational reading: crowds stampede into glamour, depressing its future returns, while neglect cheapens value.</p>
      </div>
      <p className="text-[11px] text-slate-500 leading-snug">Every exhibit in this gallery gets the same triage: risk, inefficiency, or data mining. FF93 bottled size and value into SMB and HML; momentum resisted the bottling — next lecture.</p>
    </div>
  );
}
