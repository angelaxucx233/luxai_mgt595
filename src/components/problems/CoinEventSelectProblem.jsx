import { useApp } from '../../context/AppContext.jsx';

const DEFAULT_OUTCOMES = [
  { id: 'hh', label: 'H₁H₂', inA: true, inB: false },
  { id: 'ht', label: 'H₁T₂', inA: true, inB: true },
  { id: 'th', label: 'T₁H₂', inA: false, inB: true },
  { id: 'tt', label: 'T₁T₂', inA: false, inB: true },
];

export default function CoinEventSelectProblem() {
  const { problemWork, updateProblemInput, checkProblemAnswer } = useApp();
  const { params, inputs, submitted, isCorrect } = problemWork;
  const outcomes = params.outcomes ?? DEFAULT_OUTCOMES;
  const logic = params.logic ?? 'and';
  const selected = new Set((inputs.selected ?? '').split(',').filter(Boolean));

  const toggle = (id) => {
    if (submitted && isCorrect) return;
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    updateProblemInput('selected', [...next].join(','));
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <p className="text-sm text-slate-600 text-center max-w-lg leading-relaxed">{params.prompt}</p>
      <div className="flex gap-2 text-xs">
        <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold">
          A: {params.eventA}
        </span>
        <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 font-semibold">
          B: {params.eventB}
        </span>
        <span className="px-2 py-1 rounded-full bg-slate-800 text-white font-semibold">
          {logic.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        {outcomes.map((o) => {
          const on = selected.has(o.id);
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => toggle(o.id)}
              disabled={submitted && isCorrect}
              className={`rounded-xl border-2 py-3 font-mono font-bold ${
                on ? 'border-yale-500 bg-yale-50' : 'border-slate-200 bg-white'
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={checkProblemAnswer}
        disabled={submitted && isCorrect}
        className="px-8 py-3 rounded-full bg-yale-600 text-white font-bold text-sm disabled:opacity-50"
      >
        Check
      </button>
    </div>
  );
}
