import { useState } from 'react';

const OUTCOMES = [
  { id: 'hh', label: 'H₁H₂', inB: true },
  { id: 'ht', label: 'H₁T₂', inB: true },
  { id: 'th', label: 'T₁H₂', inB: false },
  { id: 'tt', label: 'T₁T₂', inB: false },
];

export default function SampleSpaceShrinker() {
  const [conditionOn, setConditionOn] = useState(false);

  const active = conditionOn ? OUTCOMES.filter((o) => o.inB) : OUTCOMES;
  const activeCount = active.length;

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <p className="text-sm font-semibold text-slate-700">
        Two fair coins — sample space 𝒮
      </p>

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        {OUTCOMES.map((outcome) => {
          const kept = !conditionOn || outcome.inB;
          return (
            <div
              key={outcome.id}
              className={`rounded-xl border-2 px-4 py-3 font-mono text-center text-sm font-bold transition-all duration-500 ${
                kept
                  ? 'border-yale-500 bg-yale-50 text-yale-800 scale-100 opacity-100'
                  : 'border-slate-200 bg-slate-100 text-slate-500 scale-95 opacity-30 line-through'
              }`}
            >
              {outcome.label}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setConditionOn((v) => !v)}
        className={`px-5 py-2.5 rounded-full text-sm font-semibold border-2 transition ${
          conditionOn
            ? 'border-slate-300 bg-white text-slate-600'
            : 'border-yale-600 bg-yale-600 text-white hover:bg-yale-500'
        }`}
      >
        {conditionOn ? 'Remove condition' : 'Apply condition: 1st coin is Heads'}
      </button>

      <div className="w-full max-w-sm rounded-xl bg-white border border-slate-200 px-4 py-3 text-center">
        <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">
          Outcomes we still consider
        </p>
        <p className="text-2xl font-bold text-yale-700 tabular-nums">{activeCount}</p>
        <p className="text-xs text-slate-500 mt-1">
          {conditionOn
            ? 'T₁H₂ and T₁T₂ are ruled out — the first coin cannot be Tails.'
            : 'All 4 fine outcomes are still possible.'}
        </p>
      </div>
    </div>
  );
}
