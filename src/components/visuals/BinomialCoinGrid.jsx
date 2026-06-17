import FairPennyCoin from './FairPennyCoin.jsx';

const MAX_PER_ROW = 8;
const MAX_ROWS = 2;

/**
 * Fair coin row(s) for a binomial problem — max 8 coins per row, 2 rows.
 * @param {{ n: number, k: number, maxPerRow?: number, maxRows?: number }} props
 */
export default function BinomialCoinGrid({
  n,
  k,
  maxPerRow = MAX_PER_ROW,
  maxRows = MAX_ROWS,
}) {
  const coinFaces = Array.from({ length: n }, (_, i) => (i < k ? 'heads' : 'tails'));
  const size = n > 12 ? 44 : n > 8 ? 52 : 64;

  const rows = [];
  for (let i = 0; i < coinFaces.length && rows.length < maxRows; i += maxPerRow) {
    rows.push(coinFaces.slice(i, i + maxPerRow));
  }

  const nk = n - k;

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      {rows.map((row, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap"
        >
          {row.map((face, i) => (
            <FairPennyCoin key={`${rowIndex}-${i}`} face={face} size={size} />
          ))}
        </div>
      ))}
      <p className="text-xs text-slate-500">
        {k} head{k !== 1 ? 's' : ''}, {nk} tail{nk !== 1 ? 's' : ''} — one arrangement of X = {k}
      </p>
    </div>
  );
}
