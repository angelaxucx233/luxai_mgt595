import { useApp } from '../../context/AppContext.jsx';

const PAD_VALUES = [-4, -3, -2, -1, 0, 1, 2, 3, 4];

export default function EquationRootsProblem() {
  const { problemWork, updateProblemInput, setActiveField, checkProblemAnswer } = useApp();
  const { params, inputs, submitted, isCorrect, activeField } = problemWork;
  const root = params.root ?? Math.sqrt(params.rightSide);

  const fieldClass = (field) =>
    `min-w-[4.5rem] px-3 py-2 rounded-xl border-2 text-center text-lg font-semibold transition ${
      activeField === field
        ? 'border-yale-500 bg-yale-50 text-slate-900'
        : 'border-slate-300 bg-slate-50 text-slate-800'
    } ${submitted && isCorrect ? 'border-yale-500' : ''} ${submitted && !isCorrect ? 'border-rose-500' : ''}`;

  const tap = (n) => {
    if (submitted && isCorrect) return;
    const field = activeField || 'solutionA';
    const current = inputs[field] ?? '';
    const next = current === '' ? String(n) : `${current}${n}`;
    updateProblemInput(field, next.slice(0, 4));
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <p className="text-slate-600 text-center text-sm">Give both solutions to the equation.</p>

      <div className="flex items-center gap-3 text-2xl md:text-3xl font-semibold text-slate-900">
        <span>x² = {params.rightSide}</span>
      </div>

      <div className="flex items-center gap-3 text-xl text-slate-700 flex-wrap justify-center">
        <span>x =</span>
        <button type="button" onClick={() => setActiveField('solutionA')} className={fieldClass('solutionA')}>
          {inputs.solutionA ?? ''}
        </button>
        <span className="text-slate-500">or</span>
        <span>x =</span>
        <button type="button" onClick={() => setActiveField('solutionB')} className={fieldClass('solutionB')}>
          {inputs.solutionB ?? ''}
        </button>
      </div>

      {submitted && isCorrect && (
        <p className="text-yale-700 text-sm font-medium">✓ Both roots are correct.</p>
      )}
      {submitted && !isCorrect && (
        <p className="text-rose-600 text-sm">Try again — enter both values (e.g. −{root} and {root}).</p>
      )}

      <div className="flex flex-wrap gap-2 justify-center max-w-md">
        {PAD_VALUES.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => tap(n)}
            disabled={submitted && isCorrect}
            className="w-11 h-11 rounded-full border border-slate-300 bg-white hover:border-yale-500 hover:bg-yale-50 text-slate-800 font-medium disabled:opacity-40"
          >
            {n < 0 ? `−${Math.abs(n)}` : n}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            const f = activeField || 'solutionA';
            updateProblemInput(f, '');
          }}
          className="px-4 h-11 rounded-full border border-slate-300 text-slate-600 text-xs"
        >
          Clear
        </button>
      </div>

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
