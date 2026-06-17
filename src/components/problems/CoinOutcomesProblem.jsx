import { useApp } from '../../context/AppContext.jsx';
import FairCoinRow from '../visuals/FairCoinRow.jsx';

const PAD = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export default function CoinOutcomesProblem() {
  const { problemWork, updateProblemInput, checkProblemAnswer } = useApp();
  const { params, inputs, submitted, isCorrect } = problemWork;

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <FairCoinRow coinCount={params.coinCount} />

      <p className="text-slate-600 text-center text-sm max-w-md">
        You toss <strong className="text-slate-900">{params.coinCount}</strong> fair coins. How many
        fine outcomes are in the sample space 𝒮?
      </p>

      <div className="flex items-center gap-2 text-2xl text-slate-900">
        <span>|𝒮| =</span>
        <div
          className={`min-w-[4rem] px-4 py-2 rounded-xl border-2 text-center font-bold ${
            submitted && isCorrect
              ? 'border-yale-500 text-yale-700 bg-yale-50'
              : submitted
                ? 'border-rose-500 text-rose-700'
                : 'border-slate-300 bg-slate-50'
          }`}
        >
          {inputs.count ?? ''}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {PAD.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => updateProblemInput('count', String(n))}
            disabled={submitted && isCorrect}
            className="w-11 h-11 rounded-full border border-slate-300 bg-white hover:border-yale-500 hover:bg-yale-50 text-slate-800 font-medium disabled:opacity-40"
          >
            {n}
          </button>
        ))}
      </div>

      {submitted && !isCorrect && (
        <p className="text-rose-600 text-sm">Each coin doubles outcomes: 2^{params.coinCount} = ?</p>
      )}

      <button
        type="button"
        onClick={checkProblemAnswer}
        disabled={submitted && isCorrect}
        className="px-8 py-3 rounded-full bg-yale-600 hover:bg-yale-500 text-white font-bold text-sm disabled:opacity-50"
      >
        Check
      </button>
    </div>
  );
}
