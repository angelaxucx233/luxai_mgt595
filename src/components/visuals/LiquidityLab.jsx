import { useState } from 'react';
import MathTex from './MathTex.jsx';

/**
 * Lecture 10 — liquidity level, liquidity risk, spirals, and the course capstone.
 *  mode="pricing": sources of illiquidity + mu*c pricing + clientele + LOOP callbacks.
 *  mode="lcapm":   Acharya–Pedersen four betas, clickable.
 *  mode="spirals": BP spiral diagram + run-for-the-exit price path.
 *  mode="crises":  2005 / 2007 / 2010 / GFC cases + funding measures.
 *  mode="verdict": the practitioner's stack (course capstone).
 */
export default function LiquidityLab({ mode = 'pricing' }) {
  if (mode === 'lcapm') return <Lcapm />;
  if (mode === 'spirals') return <Spirals />;
  if (mode === 'crises') return <Crises />;
  if (mode === 'verdict') return <Verdict />;
  return <Pricing />;
}

function Pricing() {
  const [tab, setTab] = useState('sources');
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="flex gap-1.5">
        {[['sources', 'Why trading costs'], ['price', 'How it prices'], ['loop', 'One-price scandals']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold border ${tab === k ? 'bg-yale-800 text-white border-yale-800' : 'bg-white text-yale-900 border-yale-200'}`}>{l}</button>
        ))}
      </div>
      {tab === 'sources' && (
        <div className="w-full grid grid-cols-2 gap-1.5 text-[10.5px]">
          {[
            ['Exogenous costs', 'Fees, order processing, transaction taxes — paid on every trade.'],
            ['Demand pressure', 'Need to sell now; the buyer isn’t here yet — search takes time.'],
            ['Inventory risk', 'The market maker who bridges you bears price risk, and charges.'],
            ['Private information', 'Whoever fills you might know something — adverse selection is priced in the spread.'],
            ['Search & negotiation', 'OTC: find a counterparty, then haggle — trade fast at a discount or slowly at cost.'],
          ].map(([h, d], i) => (
            <div key={h} className={`rounded-xl border border-yale-200 bg-white px-2.5 py-1.5 ${i === 4 ? 'col-span-2' : ''}`}>
              <div className="font-bold text-yale-900">{h}</div>
              <div className="text-slate-600 leading-snug">{d}</div>
            </div>
          ))}
        </div>
      )}
      {tab === 'price' && (
        <>
          <div className="w-full rounded-xl border border-yale-200 bg-white px-3 py-2 text-center text-[12px]">
            <span className="text-slate-500">price = PV(cash flows) − PV(all future trading costs) ⟹ </span>
            <span className="font-bold text-yale-900"><MathTex tex="E(R) = r_f + \text{risk premium} + \mu c" /></span>
          </div>
          <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
            <b>The clientele twist:</b> impatient investors crowd into liquid assets; patient investors hold the illiquid ones — and earn a premium calibrated to the <i>marginal</i> (frequent) trader’s μ, more than their own amortized costs. Illiquidity is a tax on the impatient and a subsidy to patience. Fine print: with perfect borrowing everyone would just hold forever — <b>funding constraints are what make market liquidity priced at all</b>. Remember that for the spirals.
          </div>
        </>
      )}
      {tab === 'loop' && (
        <div className="w-full flex flex-col gap-1.5 text-[11px]">
          {[
            ['On-the-run vs off-the-run Treasuries', 'Identical cash flows; the newly issued bond trades rich because it trades easily — μ·c made visible.'],
            ['3Com / Palm (Lecture 3)', 'The “impossible” stub value: shorting Palm was nearly impossible — a liquidity/shorting cost, not free money.'],
            ['Restricted vs common shares · put-call parity', 'Same claims, different tradability, different prices — each gap is a trading-cost term, priced.'],
          ].map(([h, d]) => (
            <div key={h} className="rounded-xl border border-yale-200 bg-white px-3 py-2">
              <div className="font-bold text-yale-900">{h}</div>
              <div className="text-slate-600 mt-0.5">{d}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const BETAS = [
  { k: '\\operatorname{cov}(R_i, R_m)', sign: '+', name: 'Standard market beta', d: 'The one you’ve had since Lecture 1 — return co-movement with the market.', worst: 'high-beta anything', col: '#3b82f6' },
  { k: '\\operatorname{cov}(c_i, c_m)', sign: '+', name: 'Commonality in liquidity', d: 'Your costs rise when everyone’s do — you pay up to exit exactly when exits are crowded. Raises required return.', worst: 'assets whose spreads blow out in liquidity crunches', col: '#e11d48' },
  { k: '-\\operatorname{cov}(R_i, c_m)', sign: '−', name: 'Return when markets seize', d: 'An asset that pays off when aggregate liquidity dries up is a hedge — investors accept less return. (Enters with a minus sign.)', worst: 'assets that crater in every liquidity event', col: '#059669' },
  { k: '-\\operatorname{cov}(c_i, R_m)', sign: '−', name: 'Costs in down markets', d: 'Staying cheap to sell in a downturn is precious; costs that explode as prices fall must pay in advance.', worst: 'small caps, EM — spreads widen exactly in crashes', col: '#d97706' },
];

function Lcapm() {
  const [sel, setSel] = useState(1);
  const b = BETAS[sel];
  return (
    <div className="w-full max-w-lg flex flex-col gap-2.5">
      <div className="w-full rounded-xl border border-yale-200 bg-white px-3 py-2 text-center text-[11.5px]">
        <span className="text-slate-500">CAPM for what you keep: </span>
        <span className="font-bold text-yale-900"><MathTex tex="E(R - c) = r_f + \beta\, E(R_m - c_m - r_f)" /></span>
        <div className="text-[10px] text-slate-500 mt-0.5">expand the covariance and gross required returns pick up E(c) plus four betas:</div>
      </div>
      <div className="grid grid-cols-4 gap-1">
        {BETAS.map((x, i) => (
          <button key={x.k} onClick={() => setSel(i)}
            className={`rounded-lg px-1 py-1.5 text-center border transition ${sel === i ? 'text-white' : 'bg-white text-yale-900 border-yale-200'}`}
            style={sel === i ? { background: x.col, borderColor: x.col } : {}}>
            <div className="text-[10px] font-bold [&_.katex]:text-[1.15em]"><MathTex tex={x.k} /></div>
            <div className="text-[11px] font-extrabold">{x.sign}</div>
          </button>
        ))}
      </div>
      <div className="rounded-xl border px-3 py-2 text-[11px] bg-white" style={{ borderColor: b.col }}>
        <div className="font-bold" style={{ color: b.col }}>{b.name}</div>
        <div className="text-slate-600 mt-0.5">{b.d}</div>
        <div className="text-[10px] text-slate-500 mt-1"><b>Worst offenders:</b> {b.worst}</div>
      </div>
      <div className="rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
        <b>Calibrated (Acharya–Pedersen):</b> the three liquidity risks together ≈ <b>1.1%/yr</b>, on top of <b>3.5%/yr</b> for the liquidity <i>level</i> E(c). Emerging markets, where every beta is ugly at once: local liquidity risk priced at <b>85 bp per month</b> (Bekaert–Harvey–Lundblad).
      </div>
    </div>
  );
}

function Spirals() {
  const [tab, setTab] = useState('wheel');
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="flex gap-1.5">
        {[['wheel', 'The spiral'], ['exit', 'Run for the exit']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold border ${tab === k ? 'bg-yale-800 text-white border-yale-800' : 'bg-white text-yale-900 border-yale-200'}`}>{l}</button>
        ))}
      </div>
      {tab === 'wheel' ? (
        <>
          <svg viewBox="0 0 400 176" className="w-full">
            <defs><marker id="spArr" markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 z" fill="#e11d48" /></marker></defs>
            <rect x="140" y="8" width="120" height="30" rx="8" fill="#0f172a" />
            <text x="200" y="27" textAnchor="middle" fontSize="9" fill="#fff" fontWeight="800">initial losses</text>
            <rect x="272" y="66" width="118" height="34" rx="8" fill="#e11d48" />
            <text x="331" y="80" textAnchor="middle" fontSize="8.5" fill="#fff" fontWeight="800">positions cut</text>
            <text x="331" y="92" textAnchor="middle" fontSize="7" fill="#fecdd3">margin calls · risk limits</text>
            <rect x="140" y="134" width="120" height="34" rx="8" fill="#d97706" />
            <text x="200" y="148" textAnchor="middle" fontSize="8.5" fill="#fff" fontWeight="800">prices move away</text>
            <text x="200" y="160" textAnchor="middle" fontSize="7" fill="#fef3c7">from fundamentals</text>
            <rect x="10" y="66" width="118" height="34" rx="8" fill="#7c3aed" />
            <text x="69" y="80" textAnchor="middle" fontSize="8.5" fill="#fff" fontWeight="800">margins ↑ · risk mgmt ↓</text>
            <text x="69" y="92" textAnchor="middle" fontSize="7" fill="#ede9fe">vol ↑, liquidity ↓, lenders flinch</text>
            <path d="M 252 38 C 290 44, 316 52, 328 62" fill="none" stroke="#e11d48" strokeWidth="2" markerEnd="url(#spArr)" />
            <path d="M 322 104 C 300 120, 280 130, 264 138" fill="none" stroke="#e11d48" strokeWidth="2" markerEnd="url(#spArr)" />
            <path d="M 136 140 C 106 130, 86 118, 74 104" fill="none" stroke="#e11d48" strokeWidth="2" markerEnd="url(#spArr)" />
            <path d="M 76 62 C 92 50, 116 42, 136 36" fill="none" stroke="#e11d48" strokeWidth="2" markerEnd="url(#spArr)" />
            <text x="200" y="108" textAnchor="middle" fontSize="8" fill="#a3b1c2">loss spiral · margin spiral · risk-management spiral</text>
          </svg>
          <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
            <b>Liquidity is manufactured by leveraged speculators</b> — and their leverage is the vulnerability. Funding drives market liquidity, market liquidity feeds back into margins, and one loss can turn the wheel until a new equilibrium. Corollaries you’ve already met: commonality (the +cov(c,cₘ) beta), liquidity co-moving with volatility and with the market, flight to quality — and Lecture 9’s carry unwinds, which are this machine running in FX.
          </div>
        </>
      ) : (
        <>
          <svg viewBox="0 0 400 128" className="w-full">
            <text x="14" y="12" fontSize="8.5" fill="#a3b1c2">theoretical price path when everyone runs for the exit</text>
            <line x1="26" y1="40" x2="392" y2="40" stroke="#e2e8f0" strokeDasharray="4 3" />
            <text x="30" y="34" fontSize="7.5" fill="#cbd5e1">start</text>
            <path d="M 30 42 C 90 52, 150 78, 210 96 L 214 96 C 224 74, 232 62, 244 56 C 290 52, 340 53, 388 54" fill="none" stroke="#3b82f6" strokeWidth="2.6" />
            <text x="110" y="88" fontSize="8" fill="#a3b1c2">smoother than a random walk (sellers queue)</text>
            <text x="258" y="44" fontSize="8" fill="#34d399" fontWeight="700">sudden rebound — the fingerprint</text>
            <text x="330" y="70" fontSize="8" fill="#fb7185" fontWeight="700">ends lower: capital left</text>
            <circle cx="212" cy="96" r="3.5" fill="#e11d48" />
          </svg>
          <div className="w-full rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-[11px] text-amber-900">
            <b>Three testable signatures:</b> the decline is smooth (forced sellers exit sequentially), the rebound is <i>sudden</i> (fundamental news doesn’t un-happen — only forced selling exhausts), and the resting price is lower than the start (some investors never came back). Learn the fingerprint; the next slide finds it in the wild three times.
          </div>
        </>
      )}
    </div>
  );
}

const CASES = [
  { k: 'Quant event · Aug 2007', d: 'Funding trouble at a few quant funds forces selling of the crowded value-momentum book. The spiral completes inside US large caps — the most liquid stocks on earth — and stays invisible to anyone not holding the long/short portfolio: indexes barely moved.', beta: 'commonality: cov(cᵢ,cₘ) — crowding is portfolio-space, not asset-space', col: '#3b82f6' },
  { k: 'Convertible bonds · 2005', d: 'Redemptions force convert desks to sell; converts cheapen against their own theoretical values; the cheapening causes losses, more redemptions, fired desks (Mitchell–Pedersen–Pulvino). Slow-moving capital eventually arrived — and was paid.', beta: 'return sensitivity to liquidity: cov(Rᵢ,cₘ)', col: '#0f766e' },
  { k: 'Flash crash · May 6, 2010', d: 'Between 2 and 3 PM, liquidity provision withdraws in minutes; prices carve the run-for-exit V at high frequency — smooth cascade, sudden rebound — and close lower.', beta: 'the spiral itself, at machine speed', col: '#d97706' },
  { k: 'GFC spillover · 2007–08', d: 'Subprime credit → US quant equity → global quant books (Japan) → currency carry. Markets with no cash-flow links crash together because they share funders — Lecture 9’s co-movement result at planetary scale.', beta: 'funding commonality across everything one balance sheet touches', col: '#e11d48' },
];

function Crises() {
  const [sel, setSel] = useState(0);
  const c = CASES[sel];
  return (
    <div className="w-full max-w-lg flex flex-col gap-2.5">
      <div className="grid grid-cols-4 gap-1">
        {CASES.map((x, i) => (
          <button key={x.k} onClick={() => setSel(i)}
            className={`rounded-lg px-1 py-1.5 text-[9px] font-bold border transition ${sel === i ? 'text-white' : 'bg-white text-yale-900 border-yale-200'}`}
            style={sel === i ? { background: x.col, borderColor: x.col } : {}}>{x.k.split('·')[0]}</button>
        ))}
      </div>
      <div className="rounded-xl border bg-white px-3 py-2 text-[11px]" style={{ borderColor: c.col }}>
        <div className="font-bold" style={{ color: c.col }}>{c.k}</div>
        <div className="text-slate-600 mt-0.5 leading-snug">{c.d}</div>
        <div className="text-[10px] mt-1.5 rounded-lg bg-slate-50 border border-slate-200 px-2 py-1 text-slate-600"><b>LCAPM beta stressed:</b> {c.beta}</div>
      </div>
      <div className="rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
        <b>Watch the funders, not just the market:</b> TED spread, LIBOR–repo, on-the-run minus off-the-run, VIX, dealer surveys — market liquidity dies where funding liquidity dies first. Pricing recap: level ≈ 3.5%/yr, risk ≈ 1.1%/yr, and 85 bp/<i>month</i> locally in emerging markets.
      </div>
    </div>
  );
}

function Verdict() {
  const STACK = [
    ['L1–2', 'the machinery', 'diversification math, estimation risk, the CAPM null'],
    ['L3', 'the burden of proof', 'efficiency, joint hypothesis, first anomalies'],
    ['L4–6', 'the candidates', 'value · momentum · quality & BAB'],
    ['L7', 'the gauntlet', 't ≥ 3 · robustness · out-of-sample · a story'],
    ['L8–9', 'everywhere + the pillars', 'V&M in all classes · trend · the sports lab · carry'],
    ['L10', 'the bill', 'E(TC)-aware construction · liquidity level & risk · spiral-survivable sizing'],
  ];
  return (
    <div className="w-full max-w-lg flex flex-col gap-1.5 text-[11px]">
      <div className="flex flex-col gap-1">
        {STACK.map(([l, h, d], i) => (
          <div key={l} className={`rounded-lg border px-3 py-1.5 flex items-center gap-2.5 ${i === 5 ? 'border-yale-800 bg-yale-50' : 'border-yale-200 bg-white'}`}>
            <div className="text-[10px] font-extrabold text-white bg-yale-800 rounded-full px-2 py-0.5 shrink-0">{l}</div>
            <div><b className="text-yale-900">{h}</b><span className="text-slate-500"> — {d}</span></div>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-yale-900">
        <b>Grossman–Stiglitz, finally quantitative:</b> markets stay exactly inefficient enough to pay for their own correction — and the cost of correcting now has numbers: ~11 bp a trade for the patient, linear impact for the forced, 3.5% + 1.1% for illiquidity, and a spiral for the over-levered. The anomalies that survive are precisely those whose correction is expensive in these specific ways. Trade patiently, size survivably, and collect what the impatient leave behind.
      </div>
    </div>
  );
}
