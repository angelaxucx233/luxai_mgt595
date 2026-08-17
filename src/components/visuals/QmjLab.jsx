import { useState } from 'react';

/**
 * Lecture 6 — Asness–Frazzini–Pedersen, Quality Minus Junk.
 *  mode="score":   Gordon P/B decomposition → the four components; price-of-quality R².
 *  mode="results": deciles + QMJ factor + flight-to-quality + hypothesis triage.
 *  mode="verdict": closing synthesis cards for the lecture.
 */
export default function QmjLab({ mode = 'score' }) {
  if (mode === 'results') return <Results />;
  if (mode === 'verdict') return <Verdict />;
  return <Score />;
}

const COMPS = [
  { k: 'Profitability', d: 'Gross profits, margins, earnings, accruals, cash flows — average rank across all of them.', c: '#00356b' },
  { k: 'Growth', d: 'Prior five-year growth in each profitability measure.', c: '#0f766e' },
  { k: 'Safety', d: 'Return-based (low beta, low vol) and fundamental (low leverage, stable profits, low credit risk).', c: '#d97706' },
  { k: 'Payout', d: 'Fraction of profits returned to shareholders — free cash flow can breed agency problems (Jensen 1986).', c: '#7c3aed' },
];

function Score() {
  const [sel, setSel] = useState(0);
  return (
    <div className="w-full max-w-lg flex flex-col gap-2.5">
      <svg viewBox="0 0 400 74" className="w-full">
        <text x="200" y="18" textAnchor="middle" fontSize="12" fill="#0f172a" fontWeight="700">
          P/B = <tspan fill="#00356b">profitability</tspan> × <tspan fill="#7c3aed">payout</tspan> / (<tspan fill="#d97706">required return</tspan> − <tspan fill="#0f766e">growth</tspan>)
        </text>
        <text x="200" y="42" textAnchor="middle" fontSize="9" fill="#64748b">Gordon’s growth model, rewritten — the four things worth paying more for</text>
        <text x="200" y="62" textAnchor="middle" fontSize="10" fill="#0f172a" fontWeight="700">Quality = z( Profitability + Growth + Safety + Payout )</text>
      </svg>
      <div className="grid grid-cols-4 gap-1.5">
        {COMPS.map((x, i) => (
          <button key={x.k} onClick={() => setSel(i)}
            className={`rounded-lg px-1.5 py-1.5 text-[10.5px] font-semibold border transition ${sel === i ? 'text-white' : 'bg-white text-yale-900 border-yale-200 hover:border-yale-800'}`}
            style={sel === i ? { background: x.c, borderColor: x.c } : {}}>
            {x.k}
          </button>
        ))}
      </div>
      <div className="rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900 min-h-[44px]">
        <b>{COMPS[sel].k}:</b> {COMPS[sel].d} Each variable becomes a cross-sectional rank z-score, z = (r−μ)/σ, so no single accounting line dominates.
      </div>
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-[11px] text-amber-900">
        <b>The price of quality is positive — and weak.</b> Regressing price (z of market-to-book) on the quality score: the coefficient is significant in every specification, but average R² is only <b>0.05–0.31</b>. Three candidate explanations, each testable in returns: (a) the market uses <i>better</i> measures ⟹ ours shouldn’t predict returns; (b) quality is secretly <i>risky</i> ⟹ quality stocks should act risky; (c) prices <i>underreact</i> ⟹ quality predicts returns. Next slide runs the test.
      </div>
    </div>
  );
}

const RTABS = [
  { k: 'deciles', l: 'Deciles & factor' },
  { k: 'flight', l: 'Flight to quality' },
  { k: 'triage', l: 'The verdict' },
];
const DEC_ALPHA = [-0.45, -0.28, -0.16, -0.05, 0.03, 0.10, 0.18, 0.27, 0.36, 0.52]; // stylized monotone 4F alphas

function Results() {
  const [tab, setTab] = useState('deciles');
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="flex gap-1.5">
        {RTABS.map((t) => (
          <button key={t.k} onClick={() => setTab(t.k)}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold border ${tab === t.k ? 'bg-yale-800 text-white border-yale-800' : 'bg-white text-yale-900 border-yale-200'}`}>{t.l}</button>
        ))}
      </div>
      {tab === 'deciles' && (
        <>
          <svg viewBox="0 0 400 132" className="w-full">
            <text x="14" y="12" fontSize="8.5" fill="#64748b">4-factor alpha by quality decile (shape) — junk → quality</text>
            <line x1="20" y1="82" x2="320" y2="82" stroke="#94a3b8" />
            {DEC_ALPHA.map((v, i) => (
              <rect key={i} x={26 + i * 29} y={v >= 0 ? 82 - v * 88 : 82} width="21" height={Math.abs(v) * 88}
                fill={v >= 0 ? '#00356b' : '#e11d48'} opacity={0.5 + i * 0.05} rx="2.5" />
            ))}
            <text x="36" y="126" fontSize="8" fill="#64748b">P1 junk</text>
            <text x="286" y="126" fontSize="8" fill="#64748b">P10 quality</text>
            <g>
              <rect x="336" y="20" width="56" height="86" rx="6" fill="#f0f7ff" stroke="#bfdbfe" />
              <text x="364" y="36" textAnchor="middle" fontSize="8" fill="#64748b">H−L 4F α</text>
              <text x="364" y="54" textAnchor="middle" fontSize="12" fill="#00356b" fontWeight="800">0.97</text>
              <text x="364" y="66" textAnchor="middle" fontSize="7.5" fill="#94a3b8">%/mo, t 8.55</text>
              <text x="364" y="84" textAnchor="middle" fontSize="8" fill="#64748b">H−L beta</text>
              <text x="364" y="99" textAnchor="middle" fontSize="10.5" fill="#059669" fontWeight="800">−0.38</text>
            </g>
          </svg>
          <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
            <b>QMJ the factor:</b> 4-factor alpha <b>0.66%/mo (t = 10.2)</b> in the US, 0.45 (t = 5.5) globally, IR positive in every country but one — with <b>negative</b> MKT, SMB, and HML loadings. Safe, big, growth-like stocks earning high returns: “any theory of size and value can get into trouble here.”
          </div>
        </>
      )}
      {tab === 'flight' && (
        <>
          <svg viewBox="0 0 400 130" className="w-full">
            <text x="14" y="12" fontSize="8.5" fill="#64748b">QMJ return vs market return — negative and convex (stylized scatter)</text>
            <line x1="30" y1="70" x2="392" y2="70" stroke="#e2e8f0" />
            <line x1="200" y1="18" x2="200" y2="112" stroke="#e2e8f0" />
            {[[-14,7.2],[-11,5.4],[-9,4.6],[-7,3.1],[-5,2.2],[-4,1.4],[-3,1.1],[-2,0.6],[-1,0.4],[0,0.1],[1,-0.2],[2,-0.4],[3,-0.5],[4,-0.7],[5,-0.6],[6,-0.9],[8,-0.8],[10,-1.0],[12,-0.8]].map(([m, q], i) => (
              <circle key={i} cx={200 + m * 13} cy={70 - q * 7.4} r="3" fill="#00356b" opacity="0.6" />
            ))}
            <path d="M 20 16 C 120 52, 240 76, 388 80" fill="none" stroke="#d97706" strokeWidth="2" strokeDasharray="5 4" />
            <text x="52" y="30" fontSize="8.5" fill="#059669" fontWeight="700">crash months: QMJ’s best</text>
            <text x="330" y="104" fontSize="8" fill="#64748b">market return →</text>
          </svg>
          <div className="w-full rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-[11px] text-emerald-900">
            <b>Flight to quality.</b> QMJ delivers its best returns in sharp market declines — the relation is negative and convex. A risk premium is compensation for doing badly in bad times; QMJ does the opposite. Whatever pays this factor, it is not crash risk.
          </div>
        </>
      )}
      {tab === 'triage' && (
        <>
          <div className="w-full flex flex-col gap-1.5 text-[11px]">
            {[
              ['(a) Market uses better measures', 'Then OUR measures shouldn’t predict returns. They do — alpha t-stat of 10.', false],
              ['(b) Quality is hidden risk', 'Then quality stocks should act risky. They’re safer — negative beta, gains in distress.', false],
              ['(c) Prices underreact to quality', 'Consistent with everything — including analysts, whose implied returns FALL with quality while realized returns RISE.', true],
            ].map(([h, d, win]) => (
              <div key={h} className={`rounded-lg border px-3 py-2 ${win ? 'bg-emerald-50 border-emerald-300' : 'bg-rose-50 border-rose-200 opacity-80'}`}>
                <div className={`font-bold ${win ? 'text-emerald-800' : 'text-rose-700 line-through'}`}>{h}</div>
                <div className="text-slate-600">{d}</div>
              </div>
            ))}
          </div>
          <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
            <b>Graham–Dodd over efficiency</b> — with the standing joint-hypothesis caveat. Bonus: put QMJ on the right-hand side and it <i>resurrects the size effect</i> and helps price private equity — and Warren Buffett (next slide).
          </div>
        </>
      )}
    </div>
  );
}

function Verdict() {
  return (
    <div className="w-full max-w-lg flex flex-col gap-2">
      {[
        { h: 'Profitability', d: 'One clean ratio predicts returns, insures value, and subsumes the quality zoo. Spanning alpha 2.3–4.6%/yr in every specification.', c: '#00356b' },
        { h: 'Betting Against Beta', d: 'Leverage constraints flatten the SML in every asset class; Sharpe 0.75; losses timed to funding shocks; holdings sorted by constraint.', c: '#0f766e' },
        { h: 'Quality Minus Junk', d: 'Alpha 0.66%/mo (t 10.2) with negative risk loadings and flight-to-quality gains — the opposite shape of a risk premium.', c: '#d97706' },
        { h: 'The synthesis', d: 'Together they recover the size effect, absorb a swath of accounting anomalies, and explain roughly half of Buffett. The lean: constraints + behavior — Graham–Dodd, formalized.', c: '#7c3aed' },
      ].map((x) => (
        <div key={x.h} className="rounded-xl border bg-white px-3 py-2 text-[11px]" style={{ borderColor: x.c }}>
          <div className="font-bold" style={{ color: x.c }}>{x.h}</div>
          <div className="text-slate-600">{x.d}</div>
        </div>
      ))}
      <div className="rounded-xl bg-yale-800 text-white px-3 py-2 text-[11px]">
        <b>The skeptic’s question, teed up for Lecture 7:</b> hundreds of factors have been published and most are noise. Of 296 significant published factors, 132–158 are likely false. What test would these three have to pass — and do they?
      </div>
    </div>
  );
}
