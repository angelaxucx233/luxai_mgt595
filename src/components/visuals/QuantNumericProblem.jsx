import { useState } from 'react';

/**
 * Generic numeric problem card for quantitative finance problems.
 * Props: scenario, question, given [[label, value]], answers [{label, value, tolerance}], steps [string]
 * All answers must be verified by hand in the outline before shipping (no auto-verification yet).
 */
export default function QuantNumericProblem({
  scenario = '',
  question = '',
  given = [],
  answers = [],
  steps = [],
  onComplete,
}) {
  const [inputs, setInputs] = useState(answers.map(() => ''));
  const [status, setStatus] = useState(answers.map(() => null)); // null | 'right' | 'wrong'
  const [attempts, setAttempts] = useState(0);
  const [showSteps, setShowSteps] = useState(false);
  const solved = status.length > 0 && status.every((s) => s === 'right');

  const check = () => {
    const next = answers.map((a, i) => {
      const v = parseFloat(String(inputs[i]).replace(/,/g, ''));
      if (!Number.isFinite(v)) return 'wrong';
      return Math.abs(v - a.value) <= a.tolerance ? 'right' : 'wrong';
    });
    setStatus(next);
    setAttempts((n) => n + 1);
    if (next.every((s) => s === 'right') && onComplete) onComplete();
  };

  return (
    <div className="w-full max-w-lg flex flex-col gap-4">
      <div className="rounded-xl bg-yale-50 border border-yale-100 p-4">
        <p className="text-sm text-slate-800">{scenario}</p>
        {given.length > 0 && (
          <table className="mt-3 text-sm">
            <tbody>
              {given.map(([k, v]) => (
                <tr key={k}>
                  <td className="pr-4 py-0.5 font-mono text-yale-700">{k}</td>
                  <td className="py-0.5 text-slate-700">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p className="mt-3 text-sm font-semibold text-yale-800">{question}</p>
      </div>

      <div className="flex flex-col gap-2">
        {answers.map((a, i) => (
          <label key={a.label} className="flex items-center gap-3">
            <span className="w-36 text-sm font-medium text-slate-700">{a.label}</span>
            <input
              type="text"
              inputMode="decimal"
              value={inputs[i]}
              onChange={(e) => {
                const next = [...inputs];
                next[i] = e.target.value;
                setInputs(next);
                const st = [...status];
                st[i] = null;
                setStatus(st);
              }}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-yale-400 ${
                status[i] === 'right'
                  ? 'border-emerald-500 bg-emerald-50'
                  : status[i] === 'wrong'
                    ? 'border-rose-400 bg-rose-50'
                    : 'border-slate-300 bg-white'
              }`}
              placeholder="your answer"
            />
            {status[i] === 'right' && <span className="text-emerald-600 text-sm font-bold">✓</span>}
            {status[i] === 'wrong' && <span className="text-rose-500 text-sm font-bold">✗</span>}
          </label>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={check}
          className="rounded-lg bg-yale-600 px-4 py-2 text-sm font-semibold text-white hover:bg-yale-700 transition-colors"
        >
          Check
        </button>
        {solved && (
          <button
            onClick={() => setShowSteps((s) => !s)}
            className="rounded-lg border border-yale-300 px-4 py-2 text-sm font-semibold text-yale-700 hover:bg-yale-50"
          >
            {showSteps ? 'Hide solution' : 'Show solution'}
          </button>
        )}
      </div>

      {!solved && attempts > 0 && (
        <p className="text-xs text-slate-500">
          Not quite — ask Lux for a hint. She knows where this one usually goes wrong.
        </p>
      )}
      {solved && (
        <p className="text-sm font-semibold text-emerald-700">
          Correct{attempts > 1 ? ` — solved in ${attempts} attempts.` : ' on the first try.'}
        </p>
      )}
      {solved && showSteps && (
        <ol className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 flex flex-col gap-1.5 list-decimal list-inside">
          {steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      )}
    </div>
  );
}
