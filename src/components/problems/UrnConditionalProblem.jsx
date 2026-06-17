import { useApp } from '../../context/AppContext.jsx';
import UrnBallsVisual from '../visuals/UrnBallsVisual.jsx';

const FRACTION_OPTIONS = ['1/6', '1/5', '1/4', '1/3', '1/2', '2/3', '2/5', '3/5'];

export default function UrnConditionalProblem() {
  const { problemWork, updateProblemInput, checkProblemAnswer } = useApp();
  const { params, inputs, submitted, isCorrect } = problemWork;
  const expected = params.probability ?? `${params.numerator}/${params.denominator}`;

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <UrnBallsVisual
        blueBalls={params.blueBalls}
        redBalls={params.redBalls}
        mode="after_blue_draw"
      />

      <p className="text-slate-600 text-center text-sm max-w-lg leading-relaxed">
        An urn has <span className="text-sky-600">{params.blueBalls} blue</span> and{' '}
        <span className="text-rose-600">{params.redBalls} red</span> balls. Draw two{' '}
        <strong className="text-amber-700">without replacement</strong>. The first ball is blue. What
        is P(2nd ball is also blue)?
      </p>

      <div className="grid grid-cols-4 gap-2 max-w-xs w-full">
        {FRACTION_OPTIONS.map((frac) => {
          const selected = inputs.probability === frac;
          const showCorrect = submitted && frac === expected && selected;
          const showWrong = submitted && selected && frac !== expected;
          return (
            <button
              key={frac}
              type="button"
              onClick={() => updateProblemInput('probability', frac)}
              disabled={submitted && isCorrect}
              className={`py-2.5 rounded-xl border-2 text-sm font-semibold transition ${
                showCorrect
                  ? 'border-yale-500 bg-yale-50 text-yale-800'
                  : showWrong
                    ? 'border-rose-500 bg-rose-50 text-rose-700'
                    : selected
                      ? 'border-yale-500 bg-yale-50 text-yale-800'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-yale-400'
              }`}
            >
              {frac}
            </button>
          );
        })}
      </div>

      {submitted && isCorrect && (
        <p className="text-yale-700 text-sm">✓ Correct — one blue remains among {params.blueBalls + params.redBalls - 1} balls.</p>
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
