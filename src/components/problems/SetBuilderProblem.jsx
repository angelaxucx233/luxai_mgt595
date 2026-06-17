import { useApp } from '../../context/AppContext.jsx';
import FairCoinRow from '../visuals/FairCoinRow.jsx';

const POOL = ['H₁H₂', 'H₁T₂', 'T₁H₂', 'T₁T₂', 'H₁H₁', 'T₁T₁'];

export default function SetBuilderProblem() {
  const { problemWork, updateProblemInput, checkProblemAnswer } = useApp();
  const { params, inputs, submitted, isCorrect } = problemWork;
  const selected = new Set((inputs.selected ?? '').split(',').filter(Boolean));
  const correct = new Set(params.correctOutcomes ?? []);

  const toggle = (label) => {
    if (submitted && isCorrect) return;
    const next = new Set(selected);
    if (next.has(label)) next.delete(label);
    else next.add(label);
    updateProblemInput('selected', [...next].join(','));
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <FairCoinRow coinCount={2} faces={['heads', 'tails']} />
      <p className="text-sm text-slate-600 text-center max-w-md">{params.prompt}</p>

      <div className="font-mono text-lg text-yale-800 bg-white border-2 border-yale-300 rounded-xl px-4 py-3 w-full max-w-md text-center min-h-[3rem]">
        𝒮 = {'{ '}
        {[...selected].join(', ') || '…'}
        {' }'}
      </div>

      <div className="flex flex-wrap gap-2 justify-center max-w-md">
        {POOL.map((label) => {
          const on = selected.has(label);
          const isWrong = submitted && on && !correct.has(label);
          const isRight = submitted && on && correct.has(label);
          return (
            <button
              key={label}
              type="button"
              onClick={() => toggle(label)}
              disabled={submitted && isCorrect}
              className={`px-3 py-2 rounded-lg font-mono text-sm border-2 ${
                isRight
                  ? 'border-yale-500 bg-yale-50'
                  : isWrong
                    ? 'border-rose-400 bg-rose-50'
                    : on
                      ? 'border-yale-400 bg-yale-50'
                      : 'border-slate-200 bg-white hover:border-yale-300'
              }`}
            >
              {label}
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
