import { useApp } from '../../context/AppContext.jsx';

export default function NeverFailTableProblem() {
  const { problemWork, updateProblemInput, checkProblemAnswer } = useApp();
  const { params, inputs, submitted, isCorrect } = problemWork;
  const faces = params.faces ?? [1, 2, 3, 4, 5, 6];
  const checked = new Set((inputs.checked ?? '').split(',').filter(Boolean));

  const toggle = (n) => {
    if (submitted && isCorrect) return;
    const next = new Set(checked);
    const key = String(n);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    updateProblemInput('checked', [...next].join(','));
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <p className="text-sm text-slate-600 text-center max-w-lg">{params.prompt}</p>

      <table className="w-full max-w-xs text-sm border border-slate-200 rounded-xl overflow-hidden">
        <thead className="bg-yale-600 text-white">
          <tr>
            <th className="px-3 py-2 text-left">ω</th>
            <th className="px-3 py-2 text-left">P(ω)</th>
            <th className="px-3 py-2 text-center">In event?</th>
          </tr>
        </thead>
        <tbody>
          {faces.map((n) => (
            <tr key={n} className="border-t border-slate-100">
              <td className="px-3 py-2 font-mono">{n}</td>
              <td className="px-3 py-2 font-mono">1/6</td>
              <td className="px-3 py-2 text-center">
                <input
                  type="checkbox"
                  checked={checked.has(String(n))}
                  onChange={() => toggle(n)}
                  disabled={submitted && isCorrect}
                  className="w-4 h-4 accent-yale-600"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center gap-2 font-mono text-lg">
        <span>P =</span>
        <input
          type="text"
          placeholder="n"
          value={inputs.numerator ?? ''}
          onChange={(e) => updateProblemInput('numerator', e.target.value)}
          disabled={submitted && isCorrect}
          className="w-12 text-center border-2 border-slate-300 rounded-lg py-1"
        />
        <span>/</span>
        <input
          type="text"
          placeholder="d"
          value={inputs.denominator ?? ''}
          onChange={(e) => updateProblemInput('denominator', e.target.value)}
          disabled={submitted && isCorrect}
          className="w-12 text-center border-2 border-slate-300 rounded-lg py-1"
        />
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
