import { useApp } from '../../context/AppContext.jsx';
import VennDiagram from '../visuals/VennDiagram.jsx';
import StaticTreeDiagram from '../visuals/StaticTreeDiagram.jsx';

export default function ProbabilityFractionProblem() {
  const { problemWork, updateProblemInput, checkProblemAnswer } = useApp();
  const { params, inputs, submitted, isCorrect } = problemWork;
  const showVenn = params.showVenn;
  const showTree = params.showTree;

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {showVenn && <VennDiagram mode="static" highlightOnly="or" />}
      {showTree && <StaticTreeDiagram />}

      <p className="text-sm text-slate-600 text-center max-w-lg leading-relaxed">{params.prompt}</p>

      <div className="flex items-center gap-2 font-mono text-xl">
        <input
          type="text"
          inputMode="numeric"
          placeholder="n"
          value={inputs.numerator ?? ''}
          onChange={(e) => updateProblemInput('numerator', e.target.value)}
          disabled={submitted && isCorrect}
          className="w-14 text-center border-2 border-slate-300 rounded-lg py-2"
        />
        <span>/</span>
        <input
          type="text"
          inputMode="numeric"
          placeholder="d"
          value={inputs.denominator ?? ''}
          onChange={(e) => updateProblemInput('denominator', e.target.value)}
          disabled={submitted && isCorrect}
          className="w-14 text-center border-2 border-slate-300 rounded-lg py-2"
        />
      </div>

      {submitted && !isCorrect && (
        <p className="text-rose-600 text-sm">Count favorable outcomes ÷ total in the shrunk universe.</p>
      )}

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
