/**
 * Reusable fair-penny coin (heads / tails) for probability visuals.
 */

export function HeadsFace() {
  return (
    <>
      <text
        x="50"
        y="18"
        textAnchor="middle"
        fill="#e1b284"
        fontSize="7"
        fontWeight="700"
        letterSpacing="1.5"
      >
        LIBERTY
      </text>
      <ellipse cx="50" cy="46" rx="14" ry="17" fill="#8b5a2b" opacity="0.35" />
      <ellipse cx="50" cy="44" rx="11" ry="14" fill="#6b3f1f" />
      <ellipse cx="54" cy="40" rx="4" ry="5" fill="#5c3418" opacity="0.5" />
      <path
        d="M 38 58 Q 50 52 62 58 L 60 68 Q 50 64 40 68 Z"
        fill="#6b3f1f"
      />
      <text x="50" y="88" textAnchor="middle" fill="#e1b284" fontSize="9" fontWeight="700">
        ONE CENT
      </text>
    </>
  );
}

export function TailsFace() {
  return (
    <>
      <text
        x="50"
        y="16"
        textAnchor="middle"
        fill="#e1b284"
        fontSize="6.5"
        fontWeight="700"
        letterSpacing="1"
      >
        UNITED STATES
      </text>
      <rect x="32" y="34" width="36" height="22" rx="2" fill="#7a4f28" opacity="0.45" />
      <rect x="36" y="38" width="4" height="14" fill="#6b3f1f" />
      <rect x="44" y="38" width="4" height="14" fill="#6b3f1f" />
      <rect x="52" y="38" width="4" height="14" fill="#6b3f1f" />
      <rect x="60" y="38" width="4" height="14" fill="#6b3f1f" />
      <path d="M 34 56 L 66 56 L 64 62 L 36 62 Z" fill="#6b3f1f" />
      <text x="50" y="78" textAnchor="middle" fill="#e1b284" fontSize="7" fontWeight="600">
        OF AMERICA
      </text>
      <text x="50" y="90" textAnchor="middle" fill="#e1b284" fontSize="9" fontWeight="700">
        ONE CENT
      </text>
    </>
  );
}

/**
 * @param {{
 *   face: 'heads' | 'tails';
 *   size?: number;
 *   showCaption?: boolean;
 *   caption?: string;
 *   className?: string;
 * }} props
 */
export default function FairPennyCoin({
  face,
  size = 72,
  showCaption = false,
  caption,
  className = '',
}) {
  const isHeads = face === 'heads';
  const uid = `penny-${face}-${size}`;

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="drop-shadow-md shrink-0"
        aria-hidden
      >
        <defs>
          <radialGradient id={uid} cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#e8c07a" />
            <stop offset="45%" stopColor="#c9863a" />
            <stop offset="100%" stopColor="#8b5a2b" />
          </radialGradient>
        </defs>
        <circle
          cx="50"
          cy="50"
          r="47"
          fill={`url(#${uid})`}
          stroke="#5c3a1e"
          strokeWidth="2.5"
        />
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="#a67c3d"
          strokeWidth="0.8"
          opacity="0.6"
        />
        {isHeads ? <HeadsFace /> : <TailsFace />}
      </svg>
      {showCaption && (
        <span className="text-[11px] text-slate-500 font-medium">
          {caption ?? (isHeads ? 'Heads' : 'Tails')}
        </span>
      )}
    </div>
  );
}
