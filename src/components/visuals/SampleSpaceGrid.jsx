import { useState } from 'react';

const OUTCOMES = [
  { id: 'hh', label: 'H₁H₂', atLeastOneH: true, secondH: true },
  { id: 'ht', label: 'H₁T₂', atLeastOneH: true, secondH: false },
  { id: 'th', label: 'T₁H₂', atLeastOneH: true, secondH: true },
  { id: 'tt', label: 'T₁T₂', atLeastOneH: false, secondH: false },
];

const CONDITIONS = [
  { id: 'none', label: 'Show all', test: () => true },
  { id: 'atLeastOneH', label: 'At least one Heads', test: (o) => o.atLeastOneH },
  { id: 'secondH', label: '2nd coin is Heads', test: (o) => o.secondH },
];

export default function SampleSpaceGrid() {
  const [condition, setCondition] = useState('none');
  const rule = CONDITIONS.find((c) => c.id === condition) ?? CONDITIONS[0];

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="flex flex-wrap gap-2 justify-center">
        {CONDITIONS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCondition(c.id)}
            className={`px-3 py-2 rounded-full text-xs font-semibold border transition ${
              condition === c.id
                ? 'border-yale-600 bg-yale-600 text-white'
                : 'border-slate-300 bg-white text-slate-600'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        {OUTCOMES.map((o) => {
          const inEvent = rule.test(o);
          return (
            <div
              key={o.id}
              className={`rounded-xl border-2 px-3 py-3 font-mono text-center font-bold transition-all duration-300 ${
                inEvent
                  ? 'border-amber-500 bg-amber-50 text-amber-900 scale-105 shadow-sm'
                  : 'border-slate-200 bg-slate-50 text-slate-400 opacity-50'
              }`}
            >
              {o.label}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-slate-500 text-center max-w-sm">
        An <strong className="text-slate-700">event</strong> is a subset of 𝒮 — the outcomes that
        satisfy a rule.
      </p>
    </div>
  );
}
