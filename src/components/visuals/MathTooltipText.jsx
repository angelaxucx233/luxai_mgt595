import { useState } from 'react';

const TERMS = [
  {
    id: 'S',
    symbol: '𝒮',
    label: 'Sample space',
    def: 'The set of every fine outcome an experiment can produce.',
  },
  {
    id: 'omega',
    symbol: 'ω',
    label: 'Outcome',
    def: 'One specific fine result — you cannot break it into smaller possibilities.',
  },
  {
    id: 'braces',
    symbol: '{ }',
    label: 'Set notation',
    def: 'Curly braces collect outcomes into a mathematical set.',
  },
];

export default function MathTooltipText() {
  const [active, setActive] = useState('S');
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

      <div className="w-full max-w-sm rounded-2xl border-2 border-yale-400 bg-yale-50 px-5 py-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-yale-600">{term.label}</p>
        <p className="text-3xl font-mono font-bold text-yale-800 my-2">{term.symbol}</p>
        <p className="text-sm text-slate-700">{term.def}</p>
      </div>

      <p className="font-mono text-sm text-slate-600 bg-white border border-slate-200 rounded-xl px-4 py-3">
        𝒮 = {'{ H₁H₂, H₁T₂, T₁H₂, T₁T₂ }'}
      </p>
    </div>
  );
}
