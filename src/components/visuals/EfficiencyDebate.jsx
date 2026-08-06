import { useState } from 'react';

/**
 * Lecture 3 — three modes:
 *  mode="triage": anomaly decision tree (risk / inefficiency / data mining).
 *  mode="factors": the three factor-hunting methods, APT vs ICAPM.
 *  mode="limits": Shleifer's defenses & rebuttals + Shleifer–Vishny spiral.
 */
export default function EfficiencyDebate({ mode = 'triage' }) {
  if (mode === 'factors') return <Factors />;
  if (mode === 'limits') return <Limits />;
  return <Triage />;
}

function Card({ tone, title, children }) {
  const cls = { navy: 'bg-yale-50 border-yale-100 text-yale-900', amber: 'bg-amber-50 border-amber-200 text-amber-900', rose: 'bg-rose-50 border-rose-200 text-rose-900', teal: 'bg-teal-50 border-teal-200 text-teal-900', slate: 'bg-slate-50 border-slate-200 text-slate-700' }[tone];
  return (
    <div className={`rounded-xl border px-3 py-2 ${cls}`}>
      <div className="text-xs font-bold">{title}</div>
      <div className="text-[11px] leading-snug">{children}</div>
    </div>
  );
}

function Triage() {
  const [step, setStep] = useState(0);
  const STEPS = [
    { q: 'You found a characteristic-sorted strategy with a Sharpe ratio above the market\'s. First checkpoint?', a: 'Costs', body: 'Subtract transactions costs: spreads, market impact, taxes, and the liquidity you won\'t have when you need it. Many "anomalies" die right here — efficiency is defined net of costs (Grossman–Stiglitz).' },
    { q: 'It survives costs. Second checkpoint?', a: 'Risk', body: 'When does it lose? If payoffs concentrate in recessions — when consumption and marginal utility say you need money most — the premium is fair pay, not free lunch. Beware the peso problem: the disaster justifying the premium may not have happened in your sample yet.' },
    { q: 'No risk story fits. Third checkpoint?', a: 'Data mining', body: 'How many strategies were tried before this one "worked"? A hundred random predictors produce about five significant t-stats by construction. Only out-of-sample evidence — new periods, new markets — discriminates.' },
    { q: 'It survives all three. Now what?', a: 'Inefficiency — with homework', body: 'To claim mispricing you still owe: documented psychology behind the error, evidence that biased traders move prices, and an account of why arbitrage fails to correct it (next slide: limits to arbitrage).' },
  ];
  const s = STEPS[step];
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-3">
      <div className="w-full flex gap-1">
        {STEPS.map((x, i) => (
          <button key={i} onClick={() => setStep(i)} className={`flex-1 h-1.5 rounded-full ${i <= step ? 'bg-yale-700' : 'bg-slate-200'}`} aria-label={`step ${i + 1}`} />
        ))}
      </div>
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 flex flex-col gap-2">
        <div className="text-[11px] text-slate-500">{s.q}</div>
        <div className="text-lg font-black text-yale-900">{step + 1} · {s.a}</div>
        <div className="text-xs text-slate-600 leading-snug">{s.body}</div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setStep((x) => Math.max(0, x - 1))} className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200">← Back</button>
        <button onClick={() => setStep((x) => Math.min(3, x + 1))} className="px-3 py-1.5 rounded-lg bg-yale-700 text-white text-xs font-semibold hover:bg-yale-800">Next checkpoint →</button>
      </div>
    </div>
  );
}

function Factors() {
  const [m, setM] = useState(0);
  const METHODS = [
    { name: '1 · Statistical', theory: 'APT-consistent', pro: 'Best factor estimates — PCA takes the top eigenvectors of the covariance matrix (max-variance orthogonal portfolios); ~3–5 factors suffice.', con: 'Anonymous factors — no economics, no ICAPM link — and in small samples the procedure fits noise (overfitting).', ex: 'Roll–Ross (1980); Connor–Korajczyk (1988).' },
    { name: '2 · Macro variables', theory: 'ICAPM-consistent', pro: 'Named, intuitive state variables. CRR (1986) five: industrial production, ΔE[inflation], unexpected inflation, default premium, term premium. MP premium ≈14.1%/yr; the market index goes insignificant beside them.', con: 'Surprises are hard to measure; macro series need not drive the covariance matrix — awkward for CRR\'s own APT framing.', ex: 'Chen–Roll–Ross (1986); Chan–Chen–Hsieh (1985).' },
    { name: '3 · Characteristics', theory: 'ICAPM-flavored', pro: 'Uses returns (clean surprises), tolerates changing covariances — and empirically the strongest: SMB and HML absorb most anomalies.', con: 'Data-mining and mispricing worries: sorted portfolios may bottle a behavioral effect, not a risk — awkward for FF\'s own ICAPM framing.', ex: 'Fama–French (1993, 1996).' },
  ];
  const x = METHODS[m];
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-3">
      <div className="flex gap-1.5">
        {METHODS.map((mm, i) => (
          <button key={mm.name} onClick={() => setM(i)} className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border ${m === i ? 'bg-yale-700 text-white border-yale-700' : 'bg-white text-yale-900 border-yale-200 hover:bg-yale-50'}`}>{mm.name}</button>
        ))}
      </div>
      <div className="w-full flex flex-col gap-2">
        <div className="text-center text-[11px] font-bold text-slate-500 uppercase tracking-wide">{x.theory}</div>
        <Card tone="teal" title="Advantage">{x.pro}</Card>
        <Card tone="rose" title="Disadvantage">{x.con}</Card>
        <Card tone="slate" title="Classic papers">{x.ex}</Card>
      </div>
      <Card tone="amber" title="The theory scoreboard">APT: factor structure + no arbitrage ⟹ E[r] linear in loadings, factors anonymous. ICAPM: state variables investors hedge, factors named. Notice both classic empirical papers motivate their method with the <b>other</b> theory — Lux will press you on why that\u2019s uncomfortable.</Card>
    </div>
  );
}

function Limits() {
  const [rebut, setRebut] = useState(false);
  const DEF = [
    ['Investors are rational', 'Psychology says otherwise: framing, loss aversion, over- and under-reaction are documented in experiments and markets.'],
    ['Irrationality is random and cancels', 'Errors are correlated — whole crowds make the same mistake in the same direction at the same time.'],
    ['Arbitrageurs erase what\u2019s left', 'Arbitrage is limited: imperfect substitutes, drawdown risk, short horizons, costs, and short-sale constraints.'],
  ];
  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-3">
      <button onClick={() => setRebut((r) => !r)} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${rebut ? 'bg-rose-600 text-white' : 'bg-yale-700 text-white'}`}>
        {rebut ? 'Showing Shleifer\u2019s rebuttals — click for the defenses' : 'Showing the classical defenses — click to rebut'}
      </button>
      <div className="w-full flex flex-col gap-2">
        {DEF.map(([d, r], i) => (
          <Card key={i} tone={rebut ? 'rose' : 'navy'} title={`${i + 1} · ${rebut ? 'Rebuttal' : 'Defense'}`}>{rebut ? r : d}</Card>
        ))}
      </div>
      <Card tone="amber" title="Shleifer–Vishny (1997): the funding spiral">Arbitrageurs manage other people\u2019s money. When mispricing <b>widens</b>, their marks show losses — clients pull capital — positions get cut — the mispricing widens further. Arbitrage capacity is scarcest exactly when expected returns are highest.</Card>
      <Card tone="slate" title="And always: data mining">Regress returns on 100 random series and ≈5 come back \u201csignificant.\u201d A glorious backtest is the <i>beginning</i> of the argument, not the end — demand out-of-sample proof.</Card>
    </div>
  );
}
