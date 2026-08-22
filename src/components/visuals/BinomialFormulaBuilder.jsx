import { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { parseFraction } from '../../utils/fractionMath.js';
import { playChaChing } from '../../utils/playChaChing.js';
import {
  buildExpectedValues,
  buildFormulaHints,
  EMPTY_FORMULA_INPUTS,
  formatFormulaInputs,
  formatP,
  randomBinomialProblem,
} from '../../utils/binomialFormula.js';
import BinomialCoinGrid from './BinomialCoinGrid.jsx';
import YourTurnAnswerButton from './YourTurnAnswerButton.jsx';

function parseNumeric(val) {
  const s = String(val ?? '').trim();
  if (!s) return null;
  const frac = parseFraction(s);
  if (frac) return frac.n / frac.d;
  const num = Number(s);
  return Number.isFinite(num) ? num : null;
}

function matchesExpected(val, expected, { integer = false } = {}) {
  const parsed = parseNumeric(val);
  if (parsed === null) return false;
  if (integer) return Math.round(parsed) === expected;
  return Math.abs(parsed - expected) < 0.001;
}

/** Accept expanded value (120) or factorial notation (5!). */
function matchesFactorialInput(val, baseN, expectedValue) {
  const s = String(val ?? '').trim().replace(/\s+/g, '');
  if (!s) return false;

  if (matchesExpected(val, expectedValue, { integer: true })) return true;

  const factMatch = s.match(/^(\d+)!$/i);
  if (factMatch) return Number(factMatch[1]) === baseN;

  return false;
}

function TallParentheses({ children }) {
  return (
    <span className="inline-flex items-stretch text-slate-500">
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

function FormulaInput({ value, onChange, disabled, variant = 'base' }) {
  const isExp = variant === 'exp';
  return (
    <input
      type="text"
      inputMode="decimal"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={
        isExp
          ? 'w-9 h-7 text-center font-mono text-xs bg-slate-900 border border-slate-500 rounded-md text-yale-300 focus:border-yale-400 focus:outline-none disabled:opacity-60 shadow-sm'
          : 'min-w-[3.25rem] w-14 h-11 text-center font-mono text-base bg-slate-900 border-2 border-slate-500 rounded-lg text-white focus:border-yale-400 focus:outline-none disabled:opacity-60'
      }
    />
  );
}

function PowerTerm({ baseValue, expValue, onBaseChange, onExpChange, disabled }) {
  return (
    <span className="inline-flex items-start gap-0">
      <TallParentheses>
        <FormulaInput value={baseValue} onChange={onBaseChange} disabled={disabled} />
      </TallParentheses>
      <span className="-ml-1.5 mt-0.5">
        <FormulaInput
          variant="exp"
          value={expValue}
          onChange={onExpChange}
          disabled={disabled}
        />
      </span>
    </span>
  );
}

function BinomialFormulaReference({ n, k, p }) {
  const pLabel = formatP(p);
  return (
    <div className="w-full rounded-xl border border-slate-700/90 bg-slate-900/70 px-4 py-3.5">
      <div className="font-mono text-slate-300 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm md:text-base">
        <span className="whitespace-nowrap">P(X = k) =</span>
        <span className="inline-flex flex-col items-center leading-tight">
          <span>n!</span>
          <span className="w-full min-w-[4.5rem] border-t border-slate-600 my-1" aria-hidden />
          <span className="text-slate-500 text-sm">k! × (n − k)!</span>
        </span>
        <span className="text-slate-500">×</span>
        <span>
          (p)<sup className="text-yale-400 text-xs align-super ml-0.5">k</sup>
        </span>
        <span className="text-slate-500">×</span>
        <span>
          (1 − p)<sup className="text-yale-400 text-xs align-super ml-0.5">n − k</sup>
        </span>
      </div>
      <p className="text-xs text-slate-500 text-center mt-2.5 pt-2 border-t border-slate-800">
        Here: n = {n}, k = {k}, p = {pLabel}
      </p>
    </div>
  );
}

function CollapsibleFormulaHint({ n, k, p, open, onToggle }) {
  return (
    <div className="w-full">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-3 rounded-xl border border-slate-700/80 bg-slate-900/40 px-4 py-2.5 text-left hover:border-slate-600 hover:bg-slate-900/60 transition"
      >
        <span className="text-xs font-semibold text-slate-500">
          {open ? 'Hide formula hint' : 'Need the formula? Tap for a hint'}
        </span>
        <span className="text-slate-500 text-xs shrink-0" aria-hidden>
          {open ? '▲' : '▼'}
        </span>
      </button>
      {open && (
        <div className="mt-2">
          <BinomialFormulaReference n={n} k={k} p={p} />
        </div>
      )}
    </div>
  );
}

export default function BinomialFormulaBuilder({
  n: initialN = 5,
  k: initialK = 3,
  p: initialP = 0.5,
  slideId = 5,
  enableNewProblem = true,
}) {
  const { addLuxReply, openChat, setSlideTaskComplete } = useApp();
  const [problem, setProblem] = useState({
    n: initialN,
    k: initialK,
    p: initialP,
  });
  const [inputs, setInputs] = useState({ ...EMPTY_FORMULA_INPUTS });
  const [checked, setChecked] = useState(false);
  const [solved, setSolved] = useState(false);
  const [wrongFields, setWrongFields] = useState([]);
  const [formulaHintOpen, setFormulaHintOpen] = useState(false);
  const [everSolved, setEverSolved] = useState(false);

  const { n, k, p } = problem;
  const nk = n - k;
  const expected = useMemo(() => buildExpectedValues(n, k, p), [n, k, p]);
  const hints = useMemo(() => buildFormulaHints(n, k, p), [n, k, p]);
  const { probability } = expected;

  const resetAttempt = () => {
    setInputs({ ...EMPTY_FORMULA_INPUTS });
    setChecked(false);
    setSolved(false);
    setWrongFields([]);
  };

  const set = (key, val) => {
    setInputs((prev) => ({ ...prev, [key]: val }));
    setChecked(false);
    if (solved) {
      setSolved(false);
      if (!everSolved) setSlideTaskComplete(slideId, false);
    }
  };

  const handleNewProblem = () => {
    const next = randomBinomialProblem(problem, p);
    setProblem(next);
    resetAttempt();
    if (!everSolved) setSlideTaskComplete(slideId, false);
  };

  const handleCheck = () => {
    const wrong = [];
    const checks = [
      ['nFact', expected.nFact, { factorialBase: n }],
      ['kFact', expected.kFact, { factorialBase: k }],
      ['nkFact', expected.nkFact, { factorialBase: nk }],
      ['pBase', expected.pBase, {}],
      ['pExp', expected.pExp, { integer: true }],
      ['qBase', expected.qBase, {}],
      ['qExp', expected.qExp, { integer: true }],
    ];

    for (const [key, exp, opts] of checks) {
      const ok =
        opts.factorialBase != null
          ? matchesFactorialInput(inputs[key], opts.factorialBase, exp)
          : matchesExpected(inputs[key], exp, opts);
      if (!ok) wrong.push(key);
    }

    setChecked(true);
    setWrongFields(wrong);

    if (wrong.length > 0) {
      addLuxReply(hints[wrong[0]]);
      openChat();
      return;
    }

    setSolved(true);
    setEverSolved(true);
    setSlideTaskComplete(slideId, true);
    playChaChing();
    addLuxReply(
      `Perfect! P(X = ${k}) = ${expected.nFact}/(${expected.kFact}×${expected.nkFact}) × ${formatP(p)}^${k} × ${formatP(1 - p)}^${nk} ≈ ${probability.toFixed(4)}.`
    );
  };

  const handleShowAnswer = () => {
    setInputs(formatFormulaInputs(n, k, p));
    setChecked(true);
    setWrongFields([]);
    setSolved(true);
    setEverSolved(true);
    setSlideTaskComplete(slideId, true);
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-2xl">
      <p className="text-sm text-slate-500 text-center">
        {n} fair coin flip{n !== 1 ? 's' : ''} — plug in each piece for P(X = {k}), then Check.
      </p>

      <BinomialCoinGrid n={n} k={k} />

      <div className="font-mono text-slate-200 flex flex-wrap items-center justify-center gap-x-4 gap-y-5 text-lg md:text-xl">
        <span className="whitespace-nowrap">P(X = {k}) =</span>

        <span className="inline-flex flex-col items-center min-h-[5.5rem] justify-center">
          <FormulaInput
            value={inputs.nFact}
            onChange={(v) => set('nFact', v)}
            disabled={solved}
          />
          <span className="w-full border-t-2 border-slate-500 my-1.5" aria-hidden />
          <TallParentheses>
            <FormulaInput
              value={inputs.kFact}
              onChange={(v) => set('kFact', v)}
              disabled={solved}
            />
            <span className="text-slate-500 text-base">×</span>
            <FormulaInput
              value={inputs.nkFact}
              onChange={(v) => set('nkFact', v)}
              disabled={solved}
            />
          </TallParentheses>
        </span>

        <span className="text-slate-500">×</span>

        <PowerTerm
          baseValue={inputs.pBase}
          expValue={inputs.pExp}
          onBaseChange={(v) => set('pBase', v)}
          onExpChange={(v) => set('pExp', v)}
          disabled={solved}
        />

        <span className="text-slate-500">×</span>

        <PowerTerm
          baseValue={inputs.qBase}
          expValue={inputs.qExp}
          onBaseChange={(v) => set('qBase', v)}
          onExpChange={(v) => set('qExp', v)}
          disabled={solved}
        />

        <span className="text-slate-500">=</span>
        {solved ? (
          <span className="text-yale-400 font-bold text-2xl">{probability.toFixed(4)}</span>
        ) : (
          <span className="text-slate-600 text-2xl">?</span>
        )}
      </div>

      <CollapsibleFormulaHint
        n={n}
        k={k}
        p={p}
        open={formulaHintOpen}
        onToggle={() => setFormulaHintOpen((v) => !v)}
      />

      <div className="flex flex-wrap items-center justify-center gap-3">
        {!solved && (
          <button
            type="button"
            onClick={handleCheck}
            className="px-8 py-2.5 rounded-full bg-yale-600 hover:bg-yale-500 text-white font-bold text-sm"
          >
            Check
          </button>
        )}
        {!solved && <YourTurnAnswerButton onClick={handleShowAnswer} />}
        {enableNewProblem && (
          <button
            type="button"
            onClick={handleNewProblem}
            className="px-6 py-2.5 rounded-full border border-slate-600 text-slate-300 hover:border-yale-500 hover:text-white text-sm font-semibold"
          >
            New Problem
          </button>
        )}
      </div>

      {checked && wrongFields.length > 0 && !solved && (
        <p className="text-xs text-amber-400/90 text-center max-w-sm">
          Not quite — see Lux&apos;s hint in the chat.
        </p>
      )}

      {solved && (
        <p className="text-sm text-yale-400 font-medium text-center">
          Formula correct
          {everSolved ? ' — hit Continue or try New Problem.' : ' — hit Continue below.'}
        </p>
      )}
    </div>
  );
}
