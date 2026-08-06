import { useState } from 'react';

/** Lecture 3 — nested information sets (weak ⊂ semi-strong ⊂ strong). Click a ring for its tests. summaryMode: closing triage card. */
export default function EfficiencyForms({ summaryMode = false }) {
  const [sel, setSel] = useState('weak');
  const FORMS = {
    weak: { name: 'Weak form', info: 'past prices (and, per Fama 1991, past-return predictability broadly: D/P, E/P, size, BE/ME…)', kills: 'Technical analysis earns nothing.', tests: 'Autocorrelation tests, variance ratios, seasonal patterns, momentum/contrarian sorts.' },
    semi: { name: 'Semi-strong form', info: 'all public information', kills: 'Fundamental analysis earns nothing once news is out.', tests: 'Event studies: average CARs around announcements; the flat post-event line is the evidence.' },
    strong: { name: 'Strong form', info: 'all information, public and private', kills: 'Even insider trading earns nothing.', tests: 'Insider-trading studies, pre-announcement run-ups (the takeover leakage rejects this form).' },
  };
  const f = FORMS[sel];

  if (summaryMode) {
    return (
      <div className="w-full max-w-lg flex flex-col gap-2">
        {[
          ['1 · Rational', 'Time-varying premia or an omitted risk factor: must explain common variation or covary with consumption states.', 'bg-yale-50 border-yale-100 text-yale-900'],
          ['2 · Irrational', 'Mispricing: needs documented psychology, price impact, AND a story for why arbitrage fails (limits: substitutes, horizons, funding spirals, shorting costs).', 'bg-amber-50 border-amber-200 text-amber-900'],
          ['3 · Chance', 'Data mining: 100 random predictors yield ≈5 "significant" t-stats. Out-of-sample tests discriminate.', 'bg-rose-50 border-rose-200 text-rose-900'],
        ].map(([h, b, cls]) => (
          <div key={h} className={`rounded-xl border px-3 py-2 ${cls}`}>
            <div className="text-xs font-bold">{h}</div>
            <div className="text-[11px] leading-snug">{b}</div>
          </div>
        ))}
        <p className="text-[11px] text-slate-500 leading-snug pt-1">Lamont–Thaler's stubs sharpen the synthesis: prices can be unambiguously wrong — no model needed — and stay wrong, because correcting them cost 119% a year. Efficiency is always a statement <i>net of costs</i>.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-3">
      <svg viewBox="0 0 300 190" className="w-full max-w-sm">
        <ellipse cx="150" cy="95" rx="142" ry="88" fill={sel === 'strong' ? '#00356b' : '#eef4fb'} opacity={sel === 'strong' ? 0.16 : 1} stroke="#00356b" strokeWidth="2" className="cursor-pointer" onClick={() => setSel('strong')} />
        <ellipse cx="150" cy="108" rx="100" ry="62" fill={sel === 'semi' ? '#0f766e' : '#e6f5f2'} opacity={sel === 'semi' ? 0.2 : 1} stroke="#0f766e" strokeWidth="2" className="cursor-pointer" onClick={() => setSel('semi')} />
        <ellipse cx="150" cy="122" rx="60" ry="38" fill={sel === 'weak' ? '#d97706' : '#fdf1df'} opacity={sel === 'weak' ? 0.3 : 1} stroke="#d97706" strokeWidth="2" className="cursor-pointer" onClick={() => setSel('weak')} />
        <text x="150" y="126" textAnchor="middle" fontSize="11" fill="#b45309" fontWeight="800" className="cursor-pointer" onClick={() => setSel('weak')}>past prices</text>
        <text x="150" y="60" textAnchor="middle" fontSize="11" fill="#0f766e" fontWeight="800" className="cursor-pointer" onClick={() => setSel('semi')}>public info</text>
        <text x="150" y="24" textAnchor="middle" fontSize="11" fill="#00356b" fontWeight="800" className="cursor-pointer" onClick={() => setSel('strong')}>all info, incl. private</text>
      </svg>
      <div className="w-full rounded-xl bg-white border border-slate-200 px-3 py-2.5 flex flex-col gap-1">
        <div className="text-xs font-bold text-yale-900">{f.name}: prices fully reflect {f.info}</div>
        <div className="text-[11px] text-slate-600"><b>Implication:</b> {f.kills}</div>
        <div className="text-[11px] text-slate-600"><b>Tests:</b> {f.tests}</div>
      </div>
      <div className="w-full rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-[11px] text-amber-900">
        <b>Grossman–Stiglitz:</b> if prices reflected everything, nobody would be paid to research — so efficiency holds only up to information + trading costs. <b>Joint hypothesis:</b> every test of these forms is simultaneously a test of your pricing model.
      </div>
    </div>
  );
}
