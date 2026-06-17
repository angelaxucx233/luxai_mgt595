import { useState } from 'react';

const TERMS = [
  {
    id: 'X',
    symbol: 'X',
    label: 'Random variable',
    def: 'The number of successes in n independent trials — e.g., how many heads when you toss n coins.',
  },
  {
    id: 'n',
    symbol: 'n',
    label: 'Number of trials',
    def: 'How many independent trials you run. Each trial has the same success probability p.',
  },
  {
    id: 'p',
    symbol: 'p',
    label: 'Success probability',
    def: 'The chance of success on any single trial. For a fair coin, p = ½.',
  },
  {
    id: 'k',
    symbol: 'k',
    label: 'Success count',
    def: 'The exact number of successes you want — P(X = k) asks for precisely k successes (not “at least” or “at most”).',
  },
];

function TallParentheses({ children }) {
  return (
    <span className="inline-flex items-stretch text-slate-400">
      <svg
        className="w-3 shrink-0 self-stretch min-h-[2.5rem]"
        viewBox="0 0 14 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M12 2 Q3 50 12 98"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
      <span className="flex items-center gap-1.5 px-1 py-0.5">{children}</span>
      <svg
        className="w-3 shrink-0 self-stretch min-h-[2.5rem]"
        viewBox="0 0 14 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M2 2 Q11 50 2 98"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

function PmfFormula({ highlight }) {
  const hl = (id, node) =>
    highlight === id ? (
      <span className="text-yale-300 underline decoration-yale-400/80 decoration-2 underline-offset-4">
        {node}
      </span>
    ) : (
      node
    );

  return (
    <div className="font-mono text-base md:text-lg text-yale-100 flex flex-wrap items-center justify-center gap-x-2 gap-y-3 leading-relaxed">
      <span>P(</span>
      {hl('X', <span className="font-bold">X</span>)}
      <span>=</span>
      {hl('k', <span className="font-bold">k</span>)}
      <span>) =</span>

      <span className="inline-flex flex-col items-center">
        <span>{hl('n', <span className="font-bold">n</span>)}!</span>
        <span className="w-full border-t border-yale-400/60 my-0.5" aria-hidden />
        <TallParentheses>
          {hl('k', <span className="font-bold">k</span>)}!
          <span className="text-slate-500">×</span>
          (<span>{hl('n', <span className="font-bold">n</span>)}</span>
          <span>−</span>
          {hl('k', <span className="font-bold">k</span>)})!
        </TallParentheses>
      </span>

      <span>×</span>
      <span>
        {hl('p', <span className="font-bold">p</span>)}
        <sup>{hl('k', <span className="font-bold">k</span>)}</sup>
      </span>
      <span>×</span>
      <span>
        (1 − {hl('p', <span className="font-bold">p</span>)})
        <sup>
          {hl('n', <span className="font-bold">n</span>)}
          <span>−</span>
          {hl('k', <span className="font-bold">k</span>)}
        </sup>
      </span>
    </div>
  );
}

export default function BinomialPmfExplainer() {
  const [active, setActive] = useState('X');
  const term = TERMS.find((t) => t.id === active) ?? TERMS[0];

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="flex gap-2 flex-wrap justify-center">
        {TERMS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(t.id)}
            className={`px-4 py-2 rounded-xl font-mono text-lg font-bold border-2 transition ${
              active === t.id
                ? 'border-yale-500 bg-yale-50 text-yale-800'
                : 'border-slate-200 bg-white text-slate-600 hover:border-yale-300'
            }`}
          >
            {t.symbol}
          </button>
        ))}
      </div>

      <div className="w-full max-w-lg rounded-2xl border-2 border-yale-400 bg-yale-50 px-4 py-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-yale-600 text-center mb-3">
          Binomial probability mass function
        </p>
        <PmfFormula highlight={active} />
      </div>

      <p className="text-sm text-slate-200 text-center max-w-md px-4 py-3 rounded-xl bg-slate-900/90 border border-yale-500/25 leading-relaxed">
        <span className="font-semibold text-yale-300">{term.label} ({term.symbol}): </span>
        {term.def}
      </p>
    </div>
  );
}
