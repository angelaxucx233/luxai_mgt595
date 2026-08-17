import { useState } from 'react';
import { MathText } from './MathTex.jsx';

/**
 * Generic numeric problem card.
 * Props: scenario, question, given [[label, value]], answers [{label, value, tolerance}], steps [string]
 * MAX_ATTEMPTS tries with visible ±tolerance; then answers + solution are revealed
 * (AnswerPanel replaces the inputs) and onComplete fires so the lecture can continue.
 */
const MAX_ATTEMPTS = 3;

export default function QuantNumericProblem({
  scenario = '',
  question = '',
  given = [],
  answers = [],
  steps = [],
  onComplete,
}) {
  const [inputs, setInputs] = useState(answers.map(() => ''));
  const [status, setStatus] = useState(answers.map(() => null));
  const [attempts, setAttempts] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const solved = !revealed && status.length > 0 && status.every((s) => s === 'right');
  const done = solved || revealed;
  const triesLeft = MAX_ATTEMPTS - attempts;

  const check = () => {
    if (done) return;
    const next = answers.map((a, i) => {
      const v = parseFloat(String(inputs[i]).replace(/,/g, ''));
      if (!Number.isFinite(v)) return 'wrong';
      return Math.abs(v - a.value) <= a.tolerance + 1e-9 ? 'right' : 'wrong';
    });
    const n = attempts + 1;
    setAttempts(n);
    if (next.every((s) => s === 'right')) {
      setStatus(next);
      if (onComplete) onComplete();
      return;
    }
    if (n >= MAX_ATTEMPTS) {
      setStatus(answers.map(() => 'right'));
      setRevealed(true);
      setShowSteps(true);
      if (onComplete) onComplete();
      return;
    }
    setStatus(next);
  };

  return (
    <div className="w-full max-w-lg flex flex-col gap-4">
      <div className="rounded-xl bg-yale-50 border border-yale-100 p-4 text-left">
        <p className="text-sm text-slate-800"><MathText text={scenario} /></p>
        {given.length > 0 && (
          <table className="mt-3 text-sm">
            <tbody>
              {given.map(([k, v]) => (
                <tr key={k}>
                  <td className="pr-4 py-0.5 text-yale-700"><MathText text={k} /></td>
                  <td className="py-0.5 text-slate-700"><MathText text={String(v)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p className="mt-3 text-sm font-semibold text-yale-800"><MathText text={question} /></p>
      </div>

      {done ? (
        <div
          className={`rounded-xl border p-4 flex flex-col gap-2 ${
            revealed ? 'border-amber-300 bg-amber-50' : 'border-emerald-300 bg-emerald-50'
          }`}
        >
          <span
            className={`text-[11px] font-bold uppercase tracking-widest ${
              revealed ? 'text-amber-600' : 'text-emerald-600'
            }`}
          >
            {revealed ? 'Answers' : 'Your answers — correct'}
          </span>
          {answers.map((a) => (
            <div key={a.label} className="flex items-baseline justify-between gap-4">
              <span className="text-sm font-medium text-slate-700"><MathText text={a.label} /></span>
              <span
                className={`text-lg font-extrabold tabular-nums ${
                  revealed ? 'text-amber-700' : 'text-emerald-700'
                }`}
              >
                {a.value}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {answers.map((a, i) => (
            <label key={a.label} className="flex items-center gap-3">
              <span className="w-36 text-sm font-medium text-slate-700 text-left"><MathText text={a.label} /></span>
              <div className="relative flex-1">
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
                  className={`w-full rounded-lg border px-3 py-2 pr-16 text-sm font-semibold text-slate-900 tabular-nums placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-yale-400 ${
                    status[i] === 'right'
                      ? 'border-emerald-500 bg-emerald-50'
                      : status[i] === 'wrong'
                        ? 'border-rose-400 bg-rose-50'
                        : 'border-slate-300 bg-white'
                  }`}
                  placeholder="your answer"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 tabular-nums pointer-events-none">
                  ±{a.tolerance}
                </span>
              </div>
              {status[i] === 'right' && <span className="text-emerald-600 text-sm font-bold">✓</span>}
              {status[i] === 'wrong' && <span className="text-rose-500 text-sm font-bold">✗</span>}
            </label>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3">
        {!done && (
          <button
            onClick={check}
            className="rounded-lg bg-yale-600 px-4 py-2 text-sm font-semibold text-white hover:bg-yale-700 transition-colors"
          >
            Check
          </button>
        )}
        {done && (
          <button
            onClick={() => setShowSteps((s) => !s)}
            className="rounded-lg border border-yale-300 px-4 py-2 text-sm font-semibold text-yale-700 hover:bg-yale-50"
          >
            {showSteps ? 'Hide solution' : 'Show solution'}
          </button>
        )}
      </div>

      {!done && attempts > 0 && (
        <p className="text-xs text-slate-500 text-left">
          Not quite — {triesLeft} {triesLeft === 1 ? 'try' : 'tries'} left. Any answer within the ± range
          counts, and Lux knows where this one usually goes wrong if you want a hint.
        </p>
      )}
      {solved && (
        <p className="text-sm font-semibold text-emerald-700 text-left">
          Correct{attempts > 1 ? ` — solved in ${attempts} attempts.` : ' on the first try.'}
        </p>
      )}
      {revealed && (
        <p className="text-sm font-semibold text-amber-700 text-left">
          No worries — here are the answers and the worked solution. You're clear to continue.
        </p>
      )}
      {done && showSteps && (
        <ol className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 flex flex-col gap-1.5 list-decimal list-inside text-left">
          {steps.map((s, i) => (
            <li key={i}><MathText text={s} /></li>
          ))}
        </ol>
      )}
    </div>
  );
}
