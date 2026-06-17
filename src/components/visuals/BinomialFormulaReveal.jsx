import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import {
  computeBinomialPmf,
  formatP,
} from '../../utils/binomialFormula.js';
import BinomialCoinGrid from './BinomialCoinGrid.jsx';
import YourTurnAnswerButton from './YourTurnAnswerButton.jsx';

const PART_IDS = ['nFact', 'kFact', 'nkFact', 'pBase', 'pExp', 'qBase', 'qExp', 'result'];

function TallParentheses({ children }) {
  return (
    <span className="inline-flex items-stretch text-slate-400">
      <svg
        className="w-3.5 shrink-0 self-stretch min-h-[2.75rem]"
        viewBox="0 0 14 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M12 2 Q3 50 12 98"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
      <span className="flex items-center gap-2 px-1.5 py-1">{children}</span>
      <svg
        className="w-3.5 shrink-0 self-stretch min-h-[2.75rem]"
        viewBox="0 0 14 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M2 2 Q11 50 2 98"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

function RevealCell({ revealed, onReveal, children, variant = 'base', label }) {
  const isExp = variant === 'exp';
  const sizeClass = isExp
    ? 'w-9 h-7 text-xs'
    : 'min-w-[3.25rem] w-14 h-11 text-base';

  return (
    <button
      type="button"
      onClick={onReveal}
      disabled={revealed}
      aria-label={revealed ? undefined : `Reveal ${label}`}
      className={`${sizeClass} text-center font-mono rounded-lg transition ${
        revealed
          ? 'bg-slate-900 border-2 border-yale-500 text-white cursor-default'
          : isExp
            ? 'bg-slate-800/80 border border-dashed border-slate-500 text-slate-500 hover:border-yale-400/70 hover:text-slate-300 cursor-pointer'
            : 'bg-slate-800/80 border-2 border-dashed border-slate-500 text-slate-500 hover:border-yale-400/70 hover:text-slate-300 cursor-pointer'
      } ${isExp && revealed ? 'text-yale-300 border border-yale-500' : ''}`}
    >
      {revealed ? children : '?'}
    </button>
  );
}

function PowerReveal({ base, exp, revealed, onRevealBase, onRevealExp, baseLabel, expLabel }) {
  return (
    <span className="inline-flex items-start gap-0">
      <TallParentheses>
        <RevealCell
          revealed={revealed.pBase}
          onReveal={onRevealBase}
          label={baseLabel}
        >
          {base}
        </RevealCell>
      </TallParentheses>
      <span className="-ml-1.5 mt-0.5">
        <RevealCell
          variant="exp"
          revealed={revealed.pExp}
          onReveal={onRevealExp}
          label={expLabel}
        >
          {exp}
        </RevealCell>
      </span>
    </span>
  );
}

function buildExplanations(n, k, nk, p) {
  const pLabel = formatP(p);
  return {
    nFact: `${n}! counts ways to order all ${n} coin flips when every flip is distinct.`,
    kFact: `${k}! counts ways to order the ${k} heads among themselves.`,
    nkFact: `${nk}! counts ways to order the ${nk} tails among themselves.`,
    pBase: `${pLabel} is the probability of heads on one fair flip (same as tails).`,
    pExp: `The exponent ${k} is the number of heads — successes we want.`,
    qBase: `${pLabel} is also the probability of tails on one fair flip.`,
    qExp: `The exponent ${nk} is the number of tails — the remaining flips.`,
    result:
      'Put it together: divide ways to arrange by over-counting, then multiply by each flip probability. That gives P(X = 3).',
  };
}

export default function BinomialFormulaReveal({
  n = 5,
  k = 3,
  p = 0.5,
  slideId = 4,
}) {
  const { setSlideTaskComplete } = useApp();
  const nk = n - k;
  const probability = computeBinomialPmf(n, k, p);

  const values = useMemo(
    () => ({
      nFact: `${n}!`,
      kFact: `${k}!`,
      nkFact: `${nk}!`,
      pBase: formatP(p),
      pExp: String(k),
      qBase: formatP(1 - p),
      qExp: String(nk),
      result: probability.toFixed(4),
    }),
    [n, k, nk, p, probability]
  );

  const explanations = useMemo(
    () => buildExplanations(n, k, nk, p),
    [n, k, nk, p]
  );

  const [revealed, setRevealed] = useState(() =>
    Object.fromEntries(PART_IDS.map((id) => [id, false]))
  );
  const [activePart, setActivePart] = useState(null);

  const revealCount = PART_IDS.filter((id) => revealed[id]).length;
  const allRevealed = revealCount === PART_IDS.length;

  const reveal = (partId) => {
    setRevealed((prev) => ({ ...prev, [partId]: true }));
    setActivePart(partId);
  };

  const handleShowAnswer = () => {
    setRevealed(Object.fromEntries(PART_IDS.map((id) => [id, true])));
    setActivePart('result');
    setSlideTaskComplete(slideId, true);
  };

  useEffect(() => {
    setSlideTaskComplete(slideId, allRevealed);
  }, [allRevealed, setSlideTaskComplete, slideId]);

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-2xl">
      <p className="text-sm text-slate-400 text-center">
        Tap each <span className="text-slate-300 font-mono">?</span> to build P(X = {k}) piece
        by piece.
      </p>

      <BinomialCoinGrid n={n} k={k} />

      <div className="font-mono text-slate-200 flex flex-wrap items-center justify-center gap-x-4 gap-y-5 text-lg md:text-xl">
        <span className="whitespace-nowrap">P(X = {k}) =</span>

        <span className="inline-flex flex-col items-center min-h-[5.5rem] justify-center">
          <RevealCell
            revealed={revealed.nFact}
            onReveal={() => reveal('nFact')}
            label="n factorial"
          >
            {values.nFact}
          </RevealCell>
          <span className="w-full border-t-2 border-slate-500 my-1.5" aria-hidden />
          <TallParentheses>
            <RevealCell
              revealed={revealed.kFact}
              onReveal={() => reveal('kFact')}
              label="k factorial"
            >
              {values.kFact}
            </RevealCell>
            <span className="text-slate-500 text-base">×</span>
            <RevealCell
              revealed={revealed.nkFact}
              onReveal={() => reveal('nkFact')}
              label="(n−k) factorial"
            >
              {values.nkFact}
            </RevealCell>
          </TallParentheses>
        </span>

        <span className="text-slate-500">×</span>

        <PowerReveal
          base={values.pBase}
          exp={values.pExp}
          revealed={{ pBase: revealed.pBase, pExp: revealed.pExp }}
          onRevealBase={() => reveal('pBase')}
          onRevealExp={() => reveal('pExp')}
          baseLabel="p"
          expLabel="k exponent"
        />

        <span className="text-slate-500">×</span>

        <PowerReveal
          base={values.qBase}
          exp={values.qExp}
          revealed={{ pBase: revealed.qBase, pExp: revealed.qExp }}
          onRevealBase={() => reveal('qBase')}
          onRevealExp={() => reveal('qExp')}
          baseLabel="1−p"
          expLabel="n−k exponent"
        />

        <span className="text-slate-500">=</span>
        <RevealCell
          revealed={revealed.result}
          onReveal={() => reveal('result')}
          label="probability"
        >
          <span className="text-yale-400 font-bold">{values.result}</span>
        </RevealCell>
      </div>

      {activePart && (
        <p className="text-sm text-yale-200/95 text-center max-w-md px-4 py-3 rounded-xl bg-slate-900/90 border border-yale-500/25 leading-relaxed">
          {explanations[activePart]}
        </p>
      )}

      <p className="text-xs text-slate-500">
        {allRevealed
          ? 'Formula complete — hit Continue for your turn to plug in the values yourself.'
          : `Revealed ${revealCount} of ${PART_IDS.length} — keep tapping each ?.`}
      </p>

      {!allRevealed && (
        <YourTurnAnswerButton onClick={handleShowAnswer} />
      )}
    </div>
  );
}
