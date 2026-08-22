/**
 * SVG urn with simple red and blue balls.
 */

const BLUE = '#2563eb';
const RED = '#dc2626';

function buildBallList(blueCount, redCount) {
  const balls = [];
  for (let i = 0; i < blueCount; i += 1) {
    balls.push({ id: `b${i}`, color: BLUE, type: 'blue' });
  }
  for (let i = 0; i < redCount; i += 1) {
    balls.push({ id: `r${i}`, color: RED, type: 'red' });
  }
  return balls;
}

/** Positions for up to 8 balls inside the urn bowl */
const URN_SLOTS = [
  { x: 72, y: 118 },
  { x: 108, y: 112 },
  { x: 144, y: 118 },
  { x: 90, y: 142 },
  { x: 126, y: 148 },
  { x: 72, y: 162 },
  { x: 108, y: 168 },
  { x: 144, y: 162 },
];

function Ball({ cx, cy, color, r = 14, label }) {
  return (
    <g>
      <circle cx={cx} cy={cy + 2} r={r} fill="#000" opacity="0.12" />
      <circle cx={cx} cy={cy} r={r} fill={color} stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
      <circle cx={cx - 4} cy={cy - 4} r={r * 0.28} fill="#fff" opacity="0.45" />
      {label && (
        <text x={cx} y={cy + r + 14} textAnchor="middle" fill="#64748b" fontSize="9" fontWeight="600">
          {label}
        </text>
      )}
    </g>
  );
}

function UrnVessel() {
  return (
    <g>
      <defs>
        <linearGradient id="urn-glass" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.25" />
        </linearGradient>
        <linearGradient id="urn-rim" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="50%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
      </defs>
      <ellipse cx="108" cy="198" rx="52" ry="8" fill="#000" opacity="0.08" />
      <path
        d="M 52 78 Q 52 185 108 195 Q 164 185 164 78 Z"
        fill="url(#urn-glass)"
        stroke="#64748b"
        strokeWidth="2"
      />
      <ellipse cx="108" cy="78" rx="56" ry="12" fill="url(#urn-rim)" stroke="#64748b" strokeWidth="1.5" />
      <ellipse cx="108" cy="78" rx="48" ry="9" fill="#f8fafc" opacity="0.5" />
      <text x="108" y="52" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="700" letterSpacing="1">
        URN
      </text>
    </g>
  );
}

export default function UrnBallsVisual({
  blueBalls = 2,
  redBalls = 2,
  /** 'full' = all balls inside; 'after_blue_draw' = one blue outside, rest inside */
  mode = 'full',
}) {
  const total = blueBalls + redBalls;
  const allBalls = buildBallList(blueBalls, redBalls);

  const drawnBlue = mode === 'after_blue_draw' && blueBalls > 0;
  const urnBalls = drawnBlue
    ? buildBallList(Math.max(0, blueBalls - 1), redBalls)
    : allBalls;

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <svg
        viewBox="0 0 280 210"
        className="w-full max-w-[320px] h-auto"
        role="img"
        aria-label={`Urn with ${blueBalls} blue and ${redBalls} red balls`}
      >
        {drawnBlue && (
          <g>
            <Ball cx={36} cy={130} color={BLUE} label="1st · blue" />
            <path
              d="M 52 130 Q 80 120 90 125"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            <text x="36" y="168" textAnchor="middle" fill="#66c9ff" fontSize="8" fontWeight="600">
              drawn out
            </text>
          </g>
        )}

        <g transform={drawnBlue ? 'translate(28, 0)' : 'translate(32, 0)'}>
          <UrnVessel />
          {urnBalls.map((ball, i) => {
            const slot = URN_SLOTS[i % URN_SLOTS.length];
            return <Ball key={ball.id} cx={slot.x} cy={slot.y} color={ball.color} />;
          })}
        </g>

        {!drawnBlue && (
          <text x="140" y="200" textAnchor="middle" fill="#a3b1c2" fontSize="10">
            {blueBalls} blue · {redBalls} red · {total} total
          </text>
        )}
      </svg>

      {drawnBlue ? (
        <p className="text-xs text-slate-500 text-center max-w-xs">
          First ball was blue and not replaced —{' '}
          <span className="text-sky-700 font-medium">{Math.max(0, blueBalls - 1)} blue</span> and{' '}
          <span className="text-rose-700 font-medium">{redBalls} red</span> remain (
          {Math.max(0, blueBalls - 1) + redBalls} balls).
        </p>
      ) : (
        <p className="text-xs text-slate-500 text-center max-w-xs">
          {blueBalls} blue and {redBalls} red balls — same color within each group.
        </p>
      )}
    </div>
  );
}
