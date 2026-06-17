/**
 * Parameterized problem templates — AI may only vary numeric fields via regenerate_practice_problem.
 */

import { fractionsEqual, normalizeFractionInput } from '../utils/fractionMath.js';

const PERFECT_SQUARES = [4, 9, 16, 25, 36, 49];

export const PROBLEM_TEMPLATE_IDS = [
  'equation_roots',
  'coin_outcomes',
  'coin_event_select',
  'set_builder',
  'probability_fraction',
  'never_fail_table',
  'independence_test',
  'tree_builder',
  'urn_conditional',
];

function fracInput(inputs, nKey, dKey) {
  const n = String(inputs[nKey] ?? '').trim();
  const d = String(inputs[dKey] ?? '').trim();
  if (!n || !d) return '';
  return `${n}/${d}`;
}

function setsEqual(a, b) {
  const sa = new Set(a);
  const sb = new Set(b);
  if (sa.size !== sb.size) return false;
  for (const x of sa) if (!sb.has(x)) return false;
  return true;
}

export const problemTemplates = {
  equation_roots: {
    id: 'equation_roots',
    label: 'Equation roots',
    description: 'Find both solutions to x² = n (integer roots).',
    defaultParams: { rightSide: 9 },
    randomizeParams() {
      const rightSide = PERFECT_SQUARES[Math.floor(Math.random() * PERFECT_SQUARES.length)];
      const root = Math.sqrt(rightSide);
      return { rightSide, root };
    },
    validate(inputs, params) {
      const root = params.root ?? Math.sqrt(params.rightSide);
      const expected = new Set([String(-root), String(root)]);
      const a = String(inputs.solutionA ?? '').trim();
      const b = String(inputs.solutionB ?? '').trim();
      const ok = expected.has(a) && expected.has(b) && a !== b;
      return { ok, expected: [...expected] };
    },
    buildContext(params) {
      const root = params.root ?? Math.sqrt(params.rightSide);
      return `Template equation_roots: equation x² = ${params.rightSide}. Correct solutions: x = ${-root} and x = ${root}.`;
    },
  },

  coin_outcomes: {
    id: 'coin_outcomes',
    label: 'Coin sample space count',
    description: 'Count fine outcomes for n independent fair coin tosses.',
    defaultParams: { coinCount: 2 },
    randomizeParams() {
      const coinCount = 2 + Math.floor(Math.random() * 2);
      return { coinCount, outcomeCount: 2 ** coinCount };
    },
    validate(inputs, params) {
      const expected = String(params.outcomeCount ?? 2 ** params.coinCount);
      const ok = String(inputs.count ?? '').trim() === expected;
      return { ok, expected };
    },
    buildContext(params) {
      const n = params.outcomeCount ?? 2 ** params.coinCount;
      return `Template coin_outcomes: ${params.coinCount} fair coins. |𝒮| = ${n}.`;
    },
  },

  coin_event_select: {
    id: 'coin_event_select',
    label: 'Coin event logic',
    description: 'Select outcomes matching combined events on two coins.',
    defaultParams: {
      prompt:
        "Event A: 'First coin is Heads'. Event B: 'At least one Tails'. Select outcomes in (A AND B).",
      eventA: '1st coin is Heads',
      eventB: 'At least one Tails',
      logic: 'and',
      correctIds: ['ht'],
    },
    randomizeParams() {
      return {
        prompt:
          "Event A: 'First coin is Heads'. Event B: 'Second coin is Heads'. Select outcomes in (A OR B).",
        eventA: '1st coin is Heads',
        eventB: '2nd coin is Heads',
        logic: 'or',
        correctIds: ['hh', 'ht', 'th'],
      };
    },
    validate(inputs, params) {
      const selected = (inputs.selected ?? '').split(',').filter(Boolean);
      const ok = setsEqual(selected, params.correctIds);
      return { ok, expected: params.correctIds };
    },
    buildContext(params) {
      return `Template coin_event_select: ${params.prompt} Correct ids: ${params.correctIds.join(', ')}.`;
    },
  },

  set_builder: {
    id: 'set_builder',
    label: 'Build sample space',
    description: 'Select all fine outcomes for a two-coin sample space.',
    defaultParams: {
      prompt: 'Tap every fine outcome for two distinct fair coins to build 𝒮.',
      correctOutcomes: ['H₁H₂', 'H₁T₂', 'T₁H₂', 'T₁T₂'],
    },
    validate(inputs, params) {
      const selected = (inputs.selected ?? '').split(',').filter(Boolean);
      const ok = setsEqual(selected, params.correctOutcomes);
      return { ok, expected: params.correctOutcomes };
    },
    buildContext(params) {
      return `Template set_builder: correct 𝒮 = { ${params.correctOutcomes.join(', ')} }.`;
    },
  },

  probability_fraction: {
    id: 'probability_fraction',
    label: 'Fraction probability',
    description: 'Enter probability as a fraction n/d.',
    defaultParams: {
      prompt: "What is P(exactly one head) in a two-coin toss?",
      answer: '2/4',
      altAnswers: ['1/2'],
    },
    randomizeParams() {
      return {
        prompt: "Fair die: P(at least 4)?",
        answer: '3/6',
        altAnswers: ['1/2'],
      };
    },
    validate(inputs, params) {
      const entered = fracInput(inputs, 'numerator', 'denominator');
      const alts = [params.answer, ...(params.altAnswers ?? [])];
      const ok = alts.some((a) => fractionsEqual(entered, a));
      return { ok, expected: params.answer };
    },
    buildContext(params) {
      return `Template probability_fraction: ${params.prompt} Answer ${params.answer}.`;
    },
  },

  never_fail_table: {
    id: 'never_fail_table',
    label: 'Never Fail table',
    description: 'Check event outcomes on a die table and sum probabilities.',
    defaultParams: {
      prompt:
        "A = even, B = greater than 3. Check outcomes in (A AND B), then enter P.",
      correctChecked: ['4', '6'],
      answer: '2/6',
      altAnswers: ['1/3'],
    },
    validate(inputs, params) {
      const checked = (inputs.checked ?? '').split(',').filter(Boolean);
      const checksOk = setsEqual(checked, params.correctChecked);
      const frac = fracInput(inputs, 'numerator', 'denominator');
      const alts = [params.answer, ...(params.altAnswers ?? [])];
      const fracOk = alts.some((a) => fractionsEqual(frac, a));
      const ok = checksOk && fracOk;
      return { ok, expected: { checked: params.correctChecked, answer: params.answer } };
    },
    buildContext(params) {
      return `Template never_fail_table: check ${params.correctChecked.join(',')}, answer ${params.answer}.`;
    },
  },

  independence_test: {
    id: 'independence_test',
    label: 'Independence test',
    description: 'Test independence via P(A∩B) vs P(A)P(B).',
    defaultParams: {
      prompt:
        "Die: A = even, B = less than 3. Independent? Compare P(A∩B) and P(A)·P(B).",
      correctIndependent: 'no',
      pAnd: '0/6',
      pProd: '1/6',
    },
    validate(inputs, params) {
      const indOk = inputs.independent === params.correctIndependent;
      const andOk = fractionsEqual(
        fracInput(inputs, 'pAndN', 'pAndD'),
        params.pAnd
      );
      const prodOk = fractionsEqual(
        fracInput(inputs, 'pProdN', 'pProdD'),
        params.pProd
      );
      const ok = indOk && andOk && prodOk;
      return { ok, expected: params };
    },
    buildContext(params) {
      return `Template independence_test: ${params.prompt} Answer independent=${params.correctIndependent}, P(A∩B)=${params.pAnd}, P(A)P(B)=${params.pProd}.`;
    },
  },

  tree_builder: {
    id: 'tree_builder',
    label: 'Tree branch probabilities',
    description: 'Fill second-stage branch probabilities on a probability tree.',
    defaultParams: {
      prompt:
        'Fair coin, then if H unfair coin P(H)=1/3; if T fair coin again. Fill second branches.',
      branches: { b1: '1/3', b2: '2/3', b3: '1/2', b4: '1/2' },
    },
    validate(inputs, params) {
      const branches = params.branches;
      const ok = Object.entries(branches).every(
        ([k, v]) => normalizeFractionInput(inputs[k]) === normalizeFractionInput(v)
      );
      return { ok, expected: branches };
    },
    buildContext(params) {
      return `Template tree_builder: branches ${JSON.stringify(params.branches)}.`;
    },
  },

  urn_conditional: {
    id: 'urn_conditional',
    label: 'Urn conditional probability',
    description: 'P(second ball blue | first ball blue), draw without replacement.',
    defaultParams: { blueBalls: 2, redBalls: 2 },
    randomizeParams() {
      const blueBalls = 2 + Math.floor(Math.random() * 2);
      const redBalls = 2 + Math.floor(Math.random() * 2);
      const numerator = blueBalls - 1;
      const denominator = blueBalls + redBalls - 1;
      return {
        blueBalls,
        redBalls,
        numerator,
        denominator,
        probability: `${numerator}/${denominator}`,
      };
    },
    validate(inputs, params) {
      const expected = params.probability ?? `${params.numerator}/${params.denominator}`;
      const normalized = normalizeFractionInput(inputs.probability);
      const ok = normalized === expected || fractionsEqual(normalized, expected);
      return { ok, expected };
    },
    buildContext(params) {
      const p = params.probability ?? `${params.numerator}/${params.denominator}`;
      return `Template urn_conditional: ${params.blueBalls} blue, ${params.redBalls} red. P(2nd blue|1st blue)=${p}.`;
    },
  },
};

export function getTemplate(templateId) {
  return problemTemplates[templateId] ?? null;
}

export function createProblemWork(templateId, params) {
  const template = getTemplate(templateId);
  if (!template) return null;
  const merged = { ...template.defaultParams, ...params };
  if (templateId === 'equation_roots' && !merged.root) {
    merged.root = Math.sqrt(merged.rightSide);
  }
  if (templateId === 'coin_outcomes' && !merged.outcomeCount) {
    merged.outcomeCount = 2 ** merged.coinCount;
  }
  if (templateId === 'urn_conditional' && !merged.probability) {
    merged.numerator = merged.blueBalls - 1;
    merged.denominator = merged.blueBalls + merged.redBalls - 1;
    merged.probability = `${merged.numerator}/${merged.denominator}`;
  }
  return {
    templateId,
    params: merged,
    inputs: {},
    submitted: false,
    isCorrect: null,
    attempts: 0,
    activeField: templateId === 'equation_roots' ? 'solutionA' : null,
  };
}

export function formatStudentWorkForTutor(problemWork, slide) {
  if (!problemWork) {
    return slide?.type === 'problem'
      ? 'Problem slide loading.'
      : 'Student is on a concept slide (read-only). No problem inputs active.';
  }
  const template = getTemplate(problemWork.templateId);
  return JSON.stringify(
    {
      templateId: problemWork.templateId,
      templateDescription: template?.description,
      params: problemWork.params,
      studentInputs: problemWork.inputs,
      submitted: problemWork.submitted,
      isCorrect: problemWork.isCorrect,
      attempts: problemWork.attempts,
      activeField: problemWork.activeField,
    },
    null,
    2
  );
}

export function applyRegeneration(problemWork, templateId, params) {
  return createProblemWork(templateId, params);
}
