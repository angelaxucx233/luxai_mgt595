import { useState } from 'react';

/**
 * Lecture 8 — Moskowitz, Asset Pricing and Sports Betting.
 *  mode="lab":     why betting markets are the clean laboratory + the three contracts.
 *  mode="results": H1–H4 framework + the full-reversal finding.
 *  mode="verdict": uncertainty interaction + generalization scorecard.
 */
export default function SportsLab({ mode = 'lab' }) {
  if (mode === 'results') return <Results />;
  if (mode === 'verdict') return <Verdict />;
  return <Lab />;
}

const CONTRACTS = [
  { k: 'Spread', ex: '$110 on team A at −N points', pay: [['A wins by > N (“cover”)', '$210'], ['wins by exactly N (“push”)', '$110'], ['otherwise (“fail”)', '$0']], note: 'Risk 110 to win 100 — the 10-point asymmetry is the vig, the bookmaker’s trading cost.' },
  { k: 'Moneyline', ex: '$100 on team A listed at −$M', pay: [['A wins', '$M + 100'], ['tie', 'max(M, 100)'], ['A loses', '$0']], note: 'Bet on the winner outright; M scales with how heavy the favorite is.' },
  { k: 'Over/Under', ex: '$110 on total points over T', pay: [['total > T', '$210'], ['total = T', '$110'], ['total < T', '$0']], note: 'A bet on the sum, not the winner — characteristics enter as team sums.' },
];

function Lab() {
  const [sel, setSel] = useState(0);
  const c = CONTRACTS[sel];
  return (
    <div className="w-full max-w-lg flex flex-col gap-2.5">
      <div className="grid grid-cols-2 gap-1.5 text-[11px]">
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2">
          <div className="font-bold text-emerald-800">Idiosyncratic bets</div>
          <div className="text-emerald-700 mt-0.5">Game outcomes are uncorrelated with consumption or marginal utility — <b>no risk premium can rationally exist</b> in the cross-section of bets.</div>
        </div>
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2">
          <div className="font-bold text-emerald-800">Terminal truth</div>
          <div className="text-emerald-700 mt-0.5">Every contract ends, graded by a final score no bettor’s beliefs can move — <b>mispricing must reveal itself</b> by game end.</div>
        </div>
      </div>
      <div className="flex gap-1.5">
        {CONTRACTS.map((x, i) => (
          <button key={x.k} onClick={() => setSel(i)}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold border ${sel === i ? 'bg-yale-800 text-white border-yale-800' : 'bg-white text-yale-900 border-yale-200'}`}>{x.k}</button>
        ))}
      </div>
      <div className="rounded-xl border border-yale-200 bg-white px-3 py-2 text-[11px]">
        <div className="font-bold text-yale-900">{c.k}: {c.ex}</div>
        <div className="mt-1 grid grid-cols-3 gap-1">
          {c.pay.map(([cond, p]) => (
            <div key={cond} className="rounded-lg bg-yale-50 border border-yale-100 px-2 py-1.5 text-center">
              <div className="text-[12px] font-extrabold text-yale-900">{p}</div>
              <div className="text-[8.5px] text-slate-500 leading-tight">{cond}</div>
            </div>
          ))}
        </div>
        <div className="text-slate-500 mt-1.5">{c.note}</div>
      </div>
      <p className="text-[11px] text-slate-500 leading-snug">A $500B–1T market; NBA/NFL/MLB/NHL, 1999–2013; opening line → closing line → outcome. The measures mirror finance: momentum from recent game results, value from long-term performance and payroll-to-price, size from franchise value. Sentiment moves lines; only information should predict scores.</p>
    </div>
  );
}

const HYPS = [
  { k: 'H1/H2 · No effect / efficient', b1: 'β₁ = 0 (or β₁ ≠ 0 with βT confirming)', bt: 'lines irrelevant, or moves = real information', hit: false },
  { k: 'H3 · Pure noise (total overreaction)', b1: 'β₁ ≠ 0', bt: 'βT = −β₁ — the terminal return fully refunds the move', hit: true },
  { k: 'H4 · Under-reaction', b1: 'β₁ ≠ 0', bt: 'Cov(β₁, βT) > 0 — the move continues to the end', hit: false },
];

function Results() {
  const [sel, setSel] = useState(1);
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <svg viewBox="0 0 400 118" className="w-full">
        <text x="14" y="12" fontSize="8.5" fill="#64748b">momentum contracts: return from open, through the close, to the final whistle</text>
        <line x1="30" y1="86" x2="390" y2="86" stroke="#94a3b8" />
        <path d="M 34 84 C 90 74, 140 58, 196 52" fill="none" stroke="#0f766e" strokeWidth="2.6" />
        <path d="M 196 52 C 250 58, 310 76, 384 84" fill="none" stroke="#e11d48" strokeWidth="2.6" strokeDasharray="5 3" />
        <circle cx="196" cy="52" r="3.5" fill="#0f172a" />
        <text x="112" y="44" fontSize="8.5" fill="#0f766e" fontWeight="700">open → close: lines chase the streak (β₁ &gt; 0)</text>
        <text x="292" y="102" fontSize="8.5" fill="#e11d48" fontWeight="700" textAnchor="middle">close → end: fully refunded (βT = −β₁)</text>
        <text x="196" y="40" fontSize="7.5" fill="#64748b" textAnchor="middle">closing line</text>
      </svg>
      <div className="flex flex-col gap-1 w-full">
        {HYPS.map((h, i) => (
          <button key={h.k} onClick={() => setSel(i)}
            className={`rounded-lg border px-3 py-1.5 text-left text-[11px] transition ${sel === i ? (h.hit ? 'border-rose-400 bg-rose-50' : 'border-yale-800 bg-yale-50') : 'border-yale-200 bg-white'}`}>
            <span className="font-bold text-yale-900">{h.k}</span>
            {h.hit && <span className="ml-2 rounded-full bg-rose-600 text-white text-[9px] font-bold px-2 py-0.5">what the data chose</span>}
            {sel === i && <div className="text-slate-600 mt-0.5">{h.b1} · {h.bt}</div>}
          </button>
        ))}
      </div>
      <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
        <b>The ledger:</b> momentum — strong in line moves, completely reversed by game end (replicated on BetFair). Value — same signature, weaker. Size — nothing. Magnitudes ≈ <b>1/5</b> of the financial-market analogs; net of the vig, unprofitable; and contracts sharing a characteristic <b>don’t co-move</b> — no covariance structure for any risk story to grab.
      </div>
      <div className="w-full grid grid-cols-2 gap-1.5 text-[10.5px]">
        <div className="rounded-lg border border-yale-200 bg-white px-2.5 py-1.5 text-slate-600"><b className="text-yale-900">Fama</b> (shown the measures): “Most of these make sense to me… past team record longer-term for value, shorter-term for momentum.”</div>
        <div className="rounded-lg border border-yale-200 bg-white px-2.5 py-1.5 text-slate-600"><b className="text-yale-900">Thaler</b>: “Momentum is easier. For value, since that’s my measure with DeBondt, I guess I have to like that one.”</div>
      </div>
    </div>
  );
}

function Verdict() {
  const [tab, setTab] = useState('unc');
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="flex gap-1.5">
        {[['unc', 'The uncertainty interaction'], ['gen', 'Does it generalize?']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold border ${tab === k ? 'bg-yale-800 text-white border-yale-800' : 'bg-white text-yale-900 border-yale-200'}`}>{l}</button>
        ))}
      </div>
      {tab === 'unc' ? (
        <>
          <svg viewBox="0 0 400 108" className="w-full">
            <text x="14" y="12" fontSize="8.5" fill="#64748b">overreaction theory’s prediction (DHS ’98, Rabin ’02) — confirmed in betting, then in equities</text>
            <line x1="60" y1="88" x2="380" y2="88" stroke="#94a3b8" />
            <line x1="60" y1="88" x2="60" y2="24" stroke="#94a3b8" />
            <line x1="66" y1="80" x2="372" y2="34" stroke="#0f766e" strokeWidth="2.4" />
            <line x1="66" y1="40" x2="372" y2="72" stroke="#d97706" strokeWidth="2.4" />
            <text x="330" y="28" fontSize="8.5" fill="#0f766e" fontWeight="700">momentum</text>
            <text x="330" y="84" fontSize="8.5" fill="#d97706" fontWeight="700">value</text>
            <text x="220" y="102" textAnchor="middle" fontSize="8" fill="#64748b">uncertainty → (early season · low parlay volume)</text>
          </svg>
          <div className="w-full rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
            Overreaction should be strongest where beliefs are least anchored: momentum strengthens with uncertainty, value weakens. Confirmed with two proxies (early vs late season; parlay volume — parlays cluster where bettors are most confident). Then flipped back to Wall Street: the <b>same interaction holds in US equity returns</b>. The lab generated a prediction finance had never tested — and it worked.
          </div>
        </>
      ) : (
        <div className="w-full flex flex-col gap-1.5 text-[11px]">
          <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2">
            <div className="font-bold text-emerald-800">The aggressive reading</div>
            <div className="text-emerald-700 mt-0.5">Same characteristics, similar preferences, lab evidence about generic gambles, one unifying framework — overreaction can generate value and momentum with no risk anywhere.</div>
          </div>
          <div className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2">
            <div className="font-bold text-amber-800">The cautious reading</div>
            <div className="text-amber-700 mt-0.5">Characteristics aren’t perfect matches; financial effects are ~5× larger; and financial factors have real covariance structure — room remains for the risk stories of Lectures 4–7.</div>
          </div>
          <div className="rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-yale-900">
            <b>What’s licensed either way:</b> genuine mispricing exists, and limits to arbitrage protect it — the vig here, trading costs on Wall Street. Grossman–Stiglitz in a petri dish, and the perfect bridge to Lecture 10, where the real vig gets measured.
          </div>
        </div>
      )}
    </div>
  );
}
