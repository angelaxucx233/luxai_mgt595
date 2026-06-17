/** Parse "n/d" and compare equivalent fractions. */
export function parseFraction(str) {
  const s = String(str ?? '').trim().replace(/\s+/g, '');
  const match = s.match(/^(\d+)\/(\d+)$/);
  if (!match) return null;
  const n = Number(match[1]);
  const d = Number(match[2]);
  if (!Number.isFinite(n) || !Number.isFinite(d) || d === 0) return null;
  return { n, d };
}

export function fractionsEqual(a, b) {
  const fa = parseFraction(a);
  const fb = parseFraction(b);
  if (!fa || !fb) return false;
  return fa.n * fb.d === fb.n * fa.d;
}

export function normalizeFractionInput(str) {
  return String(str ?? '').trim().replace(/\s+/g, '');
}
