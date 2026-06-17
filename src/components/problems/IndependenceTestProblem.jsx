import { useApp } from '../../context/AppContext.jsx';

export default function IndependenceTestProblem() {
  const { problemWork, updateProblemInput, checkProblemAnswer } = useApp();
  const { params, inputs, submitted, isCorrect } = problemWork;

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <p className="text-sm text-slate-600 text-center max-w-lg">{params.prompt}</p>

      <div className="flex gap-4">
        {['yes', 'no'].map((v) => (
          <label key={v} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="independent"
              checked={inputs.independent === v}
              onChange={() => updateProblemInput('independent', v)}
              disabled={submitted && isCorrect}
              className="accent-yale-600"
            />
            <span className="text-sm font-semibold capitalize">{v}</span>
          </label>
        ))}
      </div>

      <div className="grid gap-3 w-full max-w-xs text-sm">
        <label className="flex flex-col gap-1">
          <span className="text-slate-500">P(A ∩ B) =</span>
          <div className="flex gap-1 font-mono">
            <input
              className="w-12 border rounded px-1 py-1 text-center"
              value={inputs.pAndN ?? ''}
              onChange={(e) => updateProblemInput('pAndN', e.target.value)}
              disabled={submitted && isCorrect}
            />
            <span>/</span>
            <input
              className="w-12 border rounded px-1 py-1 text-center"
              value={inputs.pAndD ?? ''}
              onChange={(e) => updateProblemInput('pAndD', e.target.value)}
              disabled={submitted && isCorrect}
            />
          </div>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-slate-500">P(A) × P(B) =</span>
          <div className="flex gap-1 font-mono">
            <input
              className="w-12 border rounded px-1 py-1 text-center"
              value={inputs.pProdN ?? ''}
              onChange={(e) => updateProblemInput('pProdN', e.target.value)}
              disabled={submitted && isCorrect}
            />
            <span>/</span>
            <input
              className="w-12 border rounded px-1 py-1 text-center"
              value={inputs.pProdD ?? ''}
              onChange={(e) => updateProblemInput('pProdD', e.target.value)}
              disabled={submitted && isCorrect}
            />
          </div>
        </label>
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
