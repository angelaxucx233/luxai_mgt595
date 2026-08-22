import { useState } from 'react';

/**
 * Lecture 4 — FF (1996) with real GRS p-values.
 *  mode="scoreboard": test sets vs the three-factor model; click rows.
 *  mode="debate": MMV/spanning + FF-vs-LSV rebuttal cards.
 */
export default function Ff96Scoreboard({ mode = 'scoreboard' }) {
  if (mode === 'debate') return <Debate />;
  return <Scoreboard />;
}

const ROWS = [
  { name: 'E/P deciles', p: 0.59, pass: true, note: 'Alphas ≤9bp/mo. Earnings yield is HML wearing a different ratio.' },
  { name: 'C/P deciles', p: 0.90, pass: true, note: 'The cleanest pass in the paper — cash-flow yield fully absorbed.' },
  { name: '5-yr reversal (DeBondt–Thaler)', p: 0.56, pass: true, note: 'Long-term losers are value stocks by the time you buy them; HML prices the reversal.' },
  { name: 'LSV double sort: B/M × GS', p: 0.28, pass: true, note: 'The adversary’s own refined portfolios — captured.' },
  { name: 'LSV double sort: E/P × GS', p: 0.39, pass: true, note: 'Captured.' },
  { name: 'LSV double sort: C/P × GS', p: 0.41, pass: true, note: 'Captured. The hardest corner is sales growth — and the model still passes.' },
  { name: 'Momentum (t−12 : t−2)', p: 0.000, grs: 4.45, pass: false, note: 'REJECTED. Losers load high on s and h — like small distressed value — so the model predicts HIGH returns. They earn LOW: the sign flips, and risk-adjusting makes the anomaly BIGGER. Longer formation recovers (t−48:t−2 p=0.031; t−60:t−13 p=0.235).' },
];

function Scoreboard() {
  const [sel, setSel] = useState(6);
  const r = ROWS[sel];
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="w-full rounded-xl border border-slate-200 overflow-hidden">
        <div className="grid grid-cols-[1fr_78px_70px] bg-yale-900 text-white text-[10.5px] font-semibold">
          <div className="px-3 py-1.5">Test portfolios</div><div className="px-2 py-1.5 text-right">GRS p</div><div className="px-2 py-1.5 text-center">Verdict</div>
        </div>
        {ROWS.map((x, i) => (
          <button key={x.name} onClick={() => setSel(i)}
            className={`w-full grid grid-cols-[1fr_78px_70px] text-[11px] border-t border-slate-100 text-left ${sel === i ? 'bg-yale-50' : 'bg-white hover:bg-slate-50'}`}>
            <div className="px-3 py-1.5 text-slate-700">{x.name}</div>
            <div className="px-2 py-1.5 text-right font-mono font-bold text-slate-700">{x.p === 0 ? '0.000' : x.p.toFixed(2)}</div>
            <div className={`px-2 py-1.5 text-center font-black ${x.pass ? 'text-emerald-600' : 'text-rose-600'}`}>{x.pass ? 'PASS' : 'REJECT'}</div>
          </button>
        ))}
      </div>
      <div className={`w-full rounded-xl border px-3 py-2 text-[11px] ${r.pass ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'}`}>
        <b>{r.name}{r.grs ? ` (GRS F = ${r.grs})` : ''}:</b> {r.note}
      </div>
      <p className="text-[10.5px] text-slate-500">FF (1996), actual GRS p-values. “Pass” = fail to reject α = 0 jointly. The 25 size-B/M grid rejects only because R² &gt; 93% makes trivial alphas detectable.</p>
    </div>
  );
}

function Debate() {
  const [tab, setTab] = useState('mmv');
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
      <div className="flex gap-1.5">
        {[['mmv', 'Any three portfolios'], ['rebut', 'FF vs LSV'], ['open', 'Unfinished business']].map(([id, name]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border ${tab === id ? 'bg-yale-700 text-white border-yale-700' : 'bg-white text-yale-900 border-yale-200 hover:bg-yale-50'}`}>{name}</button>
        ))}
      </div>
      {tab === 'mmv' && (
        <div className="w-full flex flex-col gap-2">
          <div className="rounded-xl bg-yale-50 border border-yale-100 px-3 py-2 text-[11px] text-yale-900">
            <b>Spanning:</b> regress S, L, or H on the market alone and R² is 0.79–0.92 — real leftover variation. Regress each on the others and R² hits <b>0.98–0.99</b>: the factors are interchangeable combinations.
          </div>
          <div className="rounded-xl bg-white border border-slate-200 px-3 py-2 text-[11px] text-slate-700">
            <b>MMV reading:</b> the factors sit near the multifactor-minimum-variance frontier, so <i>any three spanning portfolios</i> price the cross-section identically — FF verify five specifications give the same average |α|. SMB and HML are the chosen pair only because their near-zero correlation makes loadings readable.
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">What’s sacred is the three-factor <i>space</i>, not the tickers SMB and HML.</p>
        </div>
      )}
      {tab === 'rebut' && (
        <div className="w-full flex flex-col gap-2">
          <div className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-[11px] text-amber-900">
            <b>1 · The Sharpe ratio.</b> HML’s Sharpe is unexceptional and it stays volatile — H underperforms L about as often as small underperforms big, or the market underperforms bills. Money pumps don’t look like this; risk factors do.
          </div>
          <div className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-[11px] text-amber-900">
            <b>2 · The timing.</b> The value premium persists for at least five years — but the earnings mean-reversion LSV’s extrapolation story leans on resolves sooner. The premium outlasts the supposed mistake.
          </div>
          <div className="rounded-xl bg-white border border-slate-200 px-3 py-2 text-[11px] text-slate-700">
            <b>Data mining cleared:</b> value-weighted NYSE construction (limits survivorship), Davis 1994 pre-1962 evidence, international replication — and the unification itself: many independent flukes wouldn’t line up under one three-factor model.
          </div>
        </div>
      )}
      {tab === 'open' && (
        <div className="w-full flex flex-col gap-2">
          <div className="rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-[11px] text-rose-900">
            <b>Name the state variable.</b> Calling HML “distress” isn’t naming the risk investors hedge — and FF concede distress barely correlates with GNP or the market. Convenient for the data; awkward for the label.
          </div>
          <div className="rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-[11px] text-rose-900">
            <b>Roll never leaves.</b> A better market proxy could absorb some of HML’s work; the true market portfolio remains unobservable.
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">The model is a triumph of description. Whether it’s a triumph of <i>risk</i> is the question Daniel and Titman attack next.</p>
        </div>
      )}
    </div>
  );
}
