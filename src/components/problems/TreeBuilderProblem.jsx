import { useApp } from '../../context/AppContext.jsx';

const FIELDS = ['b1', 'b2', 'b3', 'b4'];

export default function TreeBuilderProblem() {
  const { problemWork, updateProblemInput, checkProblemAnswer } = useApp();
  const { params, inputs, submitted, isCorrect } = problemWork;

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <p className="text-sm text-slate-600 text-center max-w-lg">{params.prompt}</p>

      <svg viewBox="0 0 280 180" className="w-full max-w-[280px]">
        <circle cx="30" cy="90" r="6" fill="#00356b" />
        <line x1="36" y1="75" x2="100" y2="45" stroke="#64748b" strokeWidth="2" />
        <line x1="36" y1="105" x2="100" y2="135" stroke="#64748b" strokeWidth="2" />
        <text x="55" y="55" fontSize="10">
          H 1/2
        </text>
        <text x="55" y="125" fontSize="10">
          T 1/2
        </text>
        <line x1="106" y1="45" x2="180" y2="30" stroke="#64748b" strokeWidth="2" />
        <line x1="106" y1="45" x2="180" y2="60" stroke="#64748b" strokeWidth="2" />
        <line x1="106" y1="135" x2="180" y2="120" stroke="#64748b" strokeWidth="2" />
        <line x1="106" y1="135" x2="180" y2="150" stroke="#64748b" strokeWidth="2" />
        {FIELDS.map((f, i) => {
          const positions = [
            [200, 25],
            [200, 55],
            [200, 115],
            [200, 145],
          ];
          const [x, y] = positions[i];
          return (
            <foreignObject key={f} x={x} y={y} width="50" height="24">
              <input
                xmlns="http://www.w3.org/1999/xhtml"
                type="text"
                value={inputs[f] ?? ''}
                onChange={(e) => updateProblemInput(f, e.target.value)}
                disabled={submitted && isCorrect}
                className="w-full h-6 text-center text-xs border rounded font-mono"
                placeholder="?"
              />
            </foreignObject>
          );
        })}
      </svg>

      <p className="text-xs text-slate-500">Branches from one node must sum to 1.</p>

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
