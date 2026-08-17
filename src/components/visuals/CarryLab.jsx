import { useState } from 'react';
import MathTex from './MathTex.jsx';

/**
 * Lecture 9 — Koijen–Moskowitz–Pedersen, Carry: the concept.
 *  mode="concept": the decomposition + futures definition.
 *  mode="classes": per-asset-class carry formulas, clickable.
 */
export default function CarryLab({ mode = 'concept' }) {
  if (mode === 'classes') return <Classes />;
  return <Concept />;
}

function Concept() {
  const [frozen, setFrozen] = useState(true);
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="w-full grid grid-cols-3 gap-1.5 text-[11px]">
        <div className="rounded-xl border-2 border-yale-800 bg-yale-50 px-2.5 py-2 text-center">
          <div className="font-extrabold text-yale-900">carry</div>
          <div className="text-[9px] text-slate-500 leading-tight mt-0.5">observable today — no model, no history</div>
        </div>
        <div className="rounded-xl border border-yale-200 bg-white px-2.5 py-2 text-center">
          <div className="font-bold text-slate-700">+ E(Δ price)</div>
          <div className="text-[9px] text-slate-500 leading-tight mt-0.5">needs a model of expectations</div>
        </div>
        <div className="rounded-xl border border-yale-200 bg-white px-2.5 py-2 text-center">
          <div className="font-bold text-slate-700">+ surprise</div>
          <div className="text-[9px] text-slate-500 leading-tight mt-0.5">noise — unforecastable</div>
        </div>
      </div>
      <button onClick={() => setFrozen(!frozen)}
        className="rounded-full bg-yale-800 text-white px-4 py-1.5 text-[11px] font-semibold hover:bg-yale-900 transition">
        {frozen ? 'World frozen — what do you still earn?' : 'Unfreeze the world'}
      </button>
      <svg viewBox="0 0 400 116" className="w-full">
        <text x="14" y="12" fontSize="8.5" fill="#64748b">the futures version: spot S, futures F — carry is the gap, earned by convergence</text>
        <line x1="40" y1="92" x2="380" y2="92" stroke="#94a3b8" />
        <line x1="46" y1="38" x2="374" y2="38" stroke="#00356b" strokeWidth="2" strokeDasharray={frozen ? '0' : '5 3'} />
        <text x="34" y="41" textAnchor="end" fontSize="9" fill="#00356b" fontWeight="800">S</text>
        <path d={frozen ? 'M 60 66 C 160 62, 260 50, 360 39' : 'M 60 66 C 160 66, 260 66, 360 66'} fill="none" stroke="#d97706" strokeWidth="2.4" />
        <text x="34" y="69" textAnchor="end" fontSize="9" fill="#d97706" fontWeight="800">F</text>
        {frozen && (
          <>
            <line x1="360" y1="39" x2="360" y2="66" stroke="#059669" strokeWidth="0" />
            <path d="M 372 66 L 372 40" stroke="#059669" strokeWidth="1.6" markerEnd="url(#cArr)" />
            <defs><marker id="cArr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#059669" /></marker></defs>
            <text x="378" y="56" fontSize="8" fill="#059669" fontWeight="800" transform="rotate(90 378 56)">C = (S−F)/F</text>
          </>
        )}
        <text x="200" y="108" textAnchor="middle" fontSize="8.5" fill="#64748b">{frozen ? 'if S never moves, F must roll up to meet it — you collect the gap' : 'the E(Δprice) and surprise terms decide the rest — carry is only the head start'}</text>
      </svg>
      <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
        <b>The generalized expectations hypothesis:</b> carry should predict <i>nothing</i> — any visible carry should be exactly offset by expected depreciation (in FX, that’s UIP). Whether that holds, class by class, is the whole lecture. Because “most finance models have direct implications for carry strategies,” every model you’ve met gets tested at once.
      </div>
    </div>
  );
}

const CLS = [
  { k: 'Currencies', f: 'C \\propto r_f^* - r_f', d: 'F = S(1+r_f)/(1+r_f*): covered parity makes the futures discount equal the interest differential. Carry = the classic FX carry.', ex: 'AUD deposits at 7.09% funded by JPY at 0.87% → C ≈ 6.2%.' },
  { k: 'Equities', f: 'C = E(D)/S - r_f', d: 'F = S(1+r_f) − E(D): dividends make the futures cheap. Gordon: E(R) − r_f = (D/S − r_f) + g — carry is the observable half of the equity premium (Lecture 1 callback).', ex: 'Dividend yield 4%, cash 1% → equity carry 3%.' },
  { k: 'Commodities', f: 'C = \\delta - r_f', d: 'F = S(1 + r_f − δ): the convenience yield δ pulls futures below spot. Positive carry = backwardation; negative = contango.', ex: 'Oil in backwardation with δ = 6%, cash 2% → C = 4%.' },
  { k: 'Bonds', f: 'C \\approx (y_T - r_f) - D\\cdot(y_{T-1} - y_T)', d: 'Slope plus roll-down: you earn the curve above cash AND the price gain from aging into a lower yield. Slope trades = differences of two carries; Treasuries/credit get duration-adjusted (C/D).', ex: 'y₁₀ = 4%, cash 2%, D = 7, roll −0.1% → C = 2.0 + 0.7 = 2.7%.' },
  { k: 'Options', f: 'C \\approx [-\\theta + \\nu\\cdot(\\sigma_{T-1} - \\sigma_T)]/F', d: 'Theta decay plus the roll down the volatility term structure — an option’s “yield” if the surface never moves.', ex: 'Selling rich short-dated puts harvests both terms — with tails attached.' },
];

function Classes() {
  const [sel, setSel] = useState(3);
  const c = CLS[sel];
  return (
    <div className="w-full max-w-lg flex flex-col gap-2.5">
      <div className="grid grid-cols-5 gap-1">
        {CLS.map((x, i) => (
          <button key={x.k} onClick={() => setSel(i)}
            className={`rounded-lg px-1 py-1.5 text-[9.5px] font-semibold border transition ${sel === i ? 'bg-yale-800 text-white border-yale-800' : 'bg-white text-yale-900 border-yale-200 hover:border-yale-800'}`}>{x.k}</button>
        ))}
      </div>
      <div className="rounded-xl border border-yale-200 bg-white px-3 py-2.5">
        <div className="text-center rounded-lg bg-yale-900 text-white text-[13px] py-2"><MathTex tex={c.f} /></div>
        <div className="text-[11px] text-slate-600 mt-2 leading-snug">{c.d}</div>
        <div className="text-[10.5px] text-yale-800 mt-1.5 rounded-lg bg-yale-50 border border-yale-100 px-2.5 py-1.5"><b>Example:</b> {c.ex}</div>
      </div>
      {sel === 3 && (
        <svg viewBox="0 0 400 96" className="w-full">
          <text x="14" y="11" fontSize="8.5" fill="#64748b">the two bond-carry pieces on an upward-sloping curve</text>
          <line x1="40" y1="80" x2="380" y2="80" stroke="#94a3b8" />
          <path d="M 48 72 C 140 52, 260 38, 372 32" fill="none" stroke="#00356b" strokeWidth="2.2" />
          <circle cx="330" cy="35" r="3.5" fill="#00356b" />
          <circle cx="296" cy="39" r="3.5" fill="#059669" />
          <text x="336" y="30" fontSize="8" fill="#00356b" fontWeight="700">you, today (10yr)</text>
          <text x="288" y="54" fontSize="8" fill="#059669" fontWeight="700">you, next year (9yr, lower yield)</text>
          <text x="70" y="66" fontSize="8" fill="#d97706" fontWeight="700">slope: y₁₀ − r_f</text>
          <text x="200" y="93" textAnchor="middle" fontSize="8" fill="#64748b">maturity → · roll-down = price gain from sliding left along the curve</text>
        </svg>
      )}
      <p className="text-[11px] text-slate-500 leading-snug">One formula generates all five: write the forward price, ask what it implies must happen for you to break even, and carry is what you collect when it doesn’t. Portfolios: rank assets by carry within each class, long the top, short the bottom, a dollar each side.</p>
    </div>
  );
}
