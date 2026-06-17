import { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { parseFraction } from '../../utils/fractionMath.js';
import { playChaChing } from '../../utils/playChaChing.js';
import {
  buildExpectedValues,
  buildFormulaHints,
  buildGteComplementPlan,
  computeBinomialPmf,
  EMPTY_FORMULA_INPUTS,
  formatFormulaInputs,
  formatP,
} from '../../utils/binomialFormula.js';
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

function IntInput({ value, onChange, disabled }) {
  return (
    <input
      type="text"
      inputMode="numeric"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-12 h-10 text-center font-mono text-sm bg-slate-950 border-2 border-slate-600 rounded-lg text-white focus:border-yale-400 focus:outline-none disabled:opacity-60"
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

function ScenarioIcon({ name = 'firstAid' }) {
  if (name === 'hospital') {
    return (
      <svg
        className="w-11 h-11 shrink-0 text-slate-300"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <path
          d="M4 21V9l8-5 8 5v12H4z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M9 21v-6h6v6" stroke="currentColor" strokeWidth="1.5" />
        <rect x="10.25" y="10" width="3.5" height="6" rx="0.5" fill="#ef4444" />
        <rect x="9" y="11.25" width="6" height="3.5" rx="0.5" fill="#ef4444" />
      </svg>
    );
  }

  return (
    <svg
      className="w-11 h-11 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
      <rect x="10.25" y="6" width="3.5" height="12" rx="0.75" fill="#ef4444" />
      <rect x="6" y="10.25" width="12" height="3.5" rx="0.75" fill="#ef4444" />
    </svg>
  );
}

function StepCard({ step, title, children }) {
  return (
    <div className="w-full rounded-xl border border-slate-700/90 bg-slate-900/70 px-4 py-3.5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-yale-400 mb-2.5">
        Step {step} · {title}
      </p>
      {children}
    </div>
  );
}

function PmfInputRow({ n, k, p, inputs, onChange, disabled, solved, probability }) {
  const nk = n - k;
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-3">
      <p className="text-xs text-slate-500 text-center mb-2 font-mono">P(X = {k})</p>
      <div className="font-mono text-slate-200 flex flex-wrap items-center justify-center gap-x-3 gap-y-4 text-sm md:text-base">
        <span className="inline-flex flex-col items-center min-h-[5rem] justify-center">
          <FormulaInput
            value={inputs.nFact}
            onChange={(v) => onChange('nFact', v)}
            disabled={disabled}
          />
          <span className="w-full border-t-2 border-slate-500 my-1" aria-hidden />
          <TallParentheses>
            <FormulaInput
              value={inputs.kFact}
              onChange={(v) => onChange('kFact', v)}
              disabled={disabled}
            />
            <span className="text-slate-500">×</span>
            <FormulaInput
              value={inputs.nkFact}
              onChange={(v) => onChange('nkFact', v)}
              disabled={disabled}
            />
          </TallParentheses>
        </span>

        <span className="text-slate-500">×</span>

        <PowerTerm
          baseValue={inputs.pBase}
          expValue={inputs.pExp}
          onBaseChange={(v) => onChange('pBase', v)}
          onExpChange={(v) => onChange('pExp', v)}
          disabled={disabled}
        />

        <span className="text-slate-500">×</span>

        <PowerTerm
          baseValue={inputs.qBase}
          expValue={inputs.qExp}
          onBaseChange={(v) => onChange('qBase', v)}
          onExpChange={(v) => onChange('qExp', v)}
          disabled={disabled}
        />

        <span className="text-slate-500">=</span>
        {solved ? (
          <span className="text-yale-400 font-bold text-lg">{probability.toFixed(4)}</span>
        ) : (
          <span className="text-slate-600 text-lg">?</span>
        )}
      </div>
      <p className="text-[10px] text-slate-600 text-center mt-2 font-mono">
        n = {n}, k = {k}, p = {formatP(p)}, (1−p) exponent = {nk}
      </p>
    </div>
  );
}

function emptyPmfInputs(count) {
  return Array.from({ length: count }, () => ({ ...EMPTY_FORMULA_INPUTS }));
}

/**
 * Your Turn template: binomial CDF via complement rule.
 * Step 1 — complement threshold; step 2 — which X values; step 3 — PMF for each.
 */
export default function BinomialCdfComplementProblem({
  n = 20,
  p = 0.05,
  targetValue = 2,
  slideId = 9,
  icon = 'firstAid',
  scenarioIntro,
  scenarioQuestion,
}) {
  const { addLuxReply, openChat, setSlideTaskComplete } = useApp();
  const plan = useMemo(() => buildGteComplementPlan(targetValue), [targetValue]);
  const { complementKs, complementThreshold, targetLabel } = plan;

  const [step1Threshold, setStep1Threshold] = useState('');
  const [step2Ks, setStep2Ks] = useState(() => complementKs.map(() => ''));
  const [pmfInputs, setPmfInputs] = useState(() => emptyPmfInputs(complementKs.length));
  const [checked, setChecked] = useState(false);
  const [solved, setSolved] = useState(false);
  const [rowSolved, setRowSolved] = useState(() => complementKs.map(() => false));

  const pmfExpected = useMemo(
    () => complementKs.map((k) => buildExpectedValues(n, k, p)),
    [complementKs, n, p]
  );

  const finalAnswer = useMemo(
    () => 1 - complementKs.reduce((sum, k) => sum + computeBinomialPmf(n, k, p), 0),
    [complementKs, n, p]
  );

  const intro =
    scenarioIntro ??
    `In a hospital, ${n} independent surgeries are scheduled. Each has a ${(p * 100).toFixed(0)}% chance of failure. Let X = number of failed surgeries.`;

  const question =
    scenarioQuestion ??
    `Find P(X ${targetLabel}). Use the complement rule instead of summing many separate probabilities.`;

  const setPmf = (rowIdx, key, val) => {
    setPmfInputs((prev) => {
      const next = [...prev];
      next[rowIdx] = { ...next[rowIdx], [key]: val };
      return next;
    });
    setChecked(false);
    if (solved) {
      setSolved(false);
      setRowSolved(complementKs.map(() => false));
      setSlideTaskComplete(slideId, false);
    }
  };

  const setStep2K = (idx, val) => {
    setStep2Ks((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
    setChecked(false);
  };

  const validatePmfRow = (rowIdx) => {
    const k = complementKs[rowIdx];
    const nk = n - k;
    const expected = pmfExpected[rowIdx];
    const inputs = pmfInputs[rowIdx];
    const hints = buildFormulaHints(n, k, p);
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
      if (!ok) return { ok: false, hint: hints[key] };
    }
    return { ok: true };
  };

  const handleCheck = () => {
    if (!matchesExpected(step1Threshold, complementThreshold, { integer: true })) {
      setChecked(true);
      addLuxReply(
        `Step 1: “at least ${targetValue}” means complement P(X < ?). The cutoff is ${complementThreshold}.`
      );
      openChat();
      return;
    }

    const kWrongIdx = step2Ks.findIndex(
      (val, i) => !matchesExpected(val, complementKs[i], { integer: true })
    );
    if (kWrongIdx >= 0) {
      setChecked(true);
      addLuxReply(
        `Step 2: list every count below ${complementThreshold} — that's ${complementKs.join(' and ')}.`
      );
      openChat();
      return;
    }

    const nextRowSolved = complementKs.map((_, i) => validatePmfRow(i).ok);
    const firstBad = complementKs.findIndex((_, i) => !nextRowSolved[i]);

    setChecked(true);
    setRowSolved(nextRowSolved);

    if (firstBad >= 0) {
      const { hint } = validatePmfRow(firstBad);
      addLuxReply(hint);
      openChat();
      return;
    }

    setSolved(true);
    setSlideTaskComplete(slideId, true);
    playChaChing();
    addLuxReply(
      `Well done! P(X ${targetLabel}) = 1 − ${complementKs.map((k) => `P(X=${k})`).join(' − ')} ≈ ${finalAnswer.toFixed(3)}.`
    );
  };

  const handleShowAnswer = () => {
    setStep1Threshold(String(complementThreshold));
    setStep2Ks(complementKs.map(String));
    setPmfInputs(complementKs.map((k) => formatFormulaInputs(n, k, p)));
    setRowSolved(complementKs.map(() => true));
    setChecked(true);
    setSolved(true);
    setSlideTaskComplete(slideId, true);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-2xl">
      <div className="w-full rounded-xl border border-slate-700/90 bg-slate-900/75 px-4 py-4">
        <div className="flex gap-3 items-start">
          <ScenarioIcon name={icon} />
          <div className="text-sm text-slate-300 leading-relaxed min-w-0">
            <p>{intro}</p>
            <p className="mt-2 text-slate-400">{question}</p>
          </div>
        </div>
      </div>

      <StepCard step={1} title="Complement trick">
        <div className="font-mono text-base md:text-lg text-slate-100 flex flex-wrap items-center justify-center gap-2">
          <span>
            P(X {targetLabel}) = 1 − P(X &lt;
          </span>
          <IntInput
            value={step1Threshold}
            onChange={setStep1Threshold}
            disabled={solved}
          />
          <span>)</span>
        </div>
      </StepCard>

      <StepCard step={2} title="Split the complement">
        <div className="font-mono text-sm md:text-base text-slate-100 flex flex-wrap items-center justify-center gap-2 leading-relaxed">
          <span>1 − (</span>
          {complementKs.map((_, i) => (
            <span key={i} className="inline-flex items-center gap-2">
              {i > 0 && <span>+</span>}
              <span>P(X =</span>
              <IntInput
                value={step2Ks[i]}
                onChange={(v) => setStep2K(i, v)}
                disabled={solved}
              />
              <span>)</span>
            </span>
          ))}
          <span>)</span>
        </div>
      </StepCard>

      <StepCard step={3} title="Binomial PMF for each X">
        <p className="text-xs text-slate-500 text-center mb-3">
          Plug in each piece of the formula for both values, then Check.
        </p>
        <div className="space-y-3">
          {complementKs.map((k, i) => (
            <PmfInputRow
              key={k}
              n={n}
              k={k}
              p={p}
              inputs={pmfInputs[i]}
              onChange={(key, val) => setPmf(i, key, val)}
              disabled={solved}
              solved={rowSolved[i] && solved}
              probability={pmfExpected[i].probability}
            />
          ))}
        </div>

        {solved && (
          <p className="mt-4 text-center font-mono text-base md:text-lg text-slate-200">
            P(X {targetLabel}) = 1 −{' '}
            {complementKs
              .map((k, i) => pmfExpected[i].probability.toFixed(4))
              .join(' − ')}{' '}
            = <span className="text-yale-400 font-bold">{finalAnswer.toFixed(4)}</span>
          </p>
        )}

        {!solved && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleCheck}
              className="px-8 py-2.5 rounded-full bg-yale-600 hover:bg-yale-500 text-white font-bold text-sm"
            >
              Check
            </button>
            <YourTurnAnswerButton onClick={handleShowAnswer} />
          </div>
        )}

        {checked && !solved && (
          <p className="text-xs text-amber-400/90 text-center mt-2">
            Not quite — see Lux&apos;s hint in the chat.
          </p>
        )}

        {solved && (
          <p className="text-sm text-yale-400 font-medium text-center mt-2">
            Correct — hit Continue below.
          </p>
        )}
      </StepCard>
    </div>
  );
}
