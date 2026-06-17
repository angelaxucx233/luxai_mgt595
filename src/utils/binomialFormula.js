export const BINOMIAL_N_MIN = 2;
export const BINOMIAL_N_MAX = 16;

export function factorial(x) {
  if (x <= 1) return 1;
  let f = 1;
  for (let i = 2; i <= x; i += 1) f *= i;
  return f;
}

export function formatP(val) {
  return val === 0.5 ? '½' : String(val);
}

export function computeBinomialPmf(n, k, p = 0.5) {
  const nk = n - k;
  const coeff = factorial(n) / (factorial(k) * factorial(nk));
  return coeff * p ** k * (1 - p) ** nk;
}

export function buildExpectedValues(n, k, p = 0.5) {
  const nk = n - k;
  return {
    nFact: factorial(n),
    kFact: factorial(k),
    nkFact: factorial(nk),
    pBase: p,
    pExp: k,
    qBase: 1 - p,
    qExp: nk,
    probability: computeBinomialPmf(n, k, p),
  };
}

/** Prefill strings for formula input boxes (e.g. Show answer). */
export function formatFormulaInputs(n, k, p = 0.5) {
  const nk = n - k;
  const factStr = (x) => (x === 0 ? '0!' : `${x}!`);
  return {
    nFact: factStr(n),
    kFact: factStr(k),
    nkFact: factStr(nk),
    pBase: formatP(p),
    pExp: String(k),
    qBase: formatP(1 - p),
    qExp: String(nk),
  };
}

/** @param {{ n?: number, k?: number }} [current] */
export function randomBinomialProblem(current = {}, p = 0.5) {
  let n;
  let k;
  let attempts = 0;
  do {
    n =
      BINOMIAL_N_MIN +
      Math.floor(Math.random() * (BINOMIAL_N_MAX - BINOMIAL_N_MIN + 1));
    k = Math.floor(Math.random() * (n + 1));
    attempts += 1;
  } while (n === current.n && k === current.k && attempts < 24);

  return { n, k, p };
}

export function buildFormulaHints(n, k, p = 0.5) {
  const nk = n - k;
  const kFactVal = factorial(k);
  const nkFactVal = factorial(nk);
  const kFactHint =
    k === 0 ? 'k! is 0! = 1 — type 0! or 1.' : `k! — type ${k}! or ${kFactVal}.`;
  const nkFactHint =
    nk === 0
      ? '(n−k)! is 0! = 1 — type 0! or 1.'
      : `(n−k)! — type ${nk}! or ${nkFactVal}.`;

  return {
    nFact: `n! goes on top — type ${n}! or ${factorial(n)}.`,
    kFact: kFactHint,
    nkFact: nkFactHint,
    pBase: `p is the success probability per flip. A fair coin has p = ${formatP(p)} (or 0.5).`,
    pExp: `The exponent on p counts successes — here k = ${k}.`,
    qBase: `(1−p) is the failure probability. For a fair coin, that is also ${formatP(1 - p)}.`,
    qExp: `The exponent on (1−p) counts failures — here n−k = ${nk}.`,
  };
}

export const EMPTY_FORMULA_INPUTS = {
  nFact: '',
  kFact: '',
  nkFact: '',
  pBase: '',
  pExp: '',
  qBase: '',
  qExp: '',
};

/** Complement scaffold for P(X ≥ k) via 1 − P(X < k). */
export function buildGteComplementPlan(targetValue) {
  const k = Math.max(0, Math.round(targetValue));
  return {
    targetOp: 'gte',
    targetValue: k,
    targetLabel: `≥ ${k}`,
    complementThreshold: k,
    complementKs: Array.from({ length: k }, (_, i) => i),
  };
}
