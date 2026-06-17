/** Decorative course artwork (Brilliant-style, no external assets). */
export default function CourseIcon({ className = 'w-full h-full' }) {
  return (
    <svg
      viewBox="0 0 200 160"
      className={className}
      aria-hidden
      role="img"
    >
      <defs>
        <linearGradient id="courseIconGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4a8fd4" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#286dc0" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <rect x="8" y="12" width="184" height="136" rx="16" fill="url(#courseIconGlow)" stroke="#4a8fd4" strokeOpacity="0.35" strokeWidth="1.5" />
      {/* Bar chart */}
      <rect x="36" y="88" width="18" height="36" rx="4" fill="#f59e0b" opacity="0.9" />
      <rect x="62" y="72" width="18" height="52" rx="4" fill="#a855f7" opacity="0.85" />
      <rect x="88" y="96" width="18" height="28" rx="4" fill="#38bdf8" opacity="0.9" />
      {/* Coin / die */}
      <circle cx="148" cy="56" r="28" fill="#1e3a5f" stroke="#6a9fd4" strokeWidth="2" />
      <circle cx="140" cy="48" r="4" fill="#e2e8f0" />
      <circle cx="156" cy="48" r="4" fill="#e2e8f0" />
      <circle cx="148" cy="64" r="4" fill="#e2e8f0" />
      {/* Curve hint */}
      <path
        d="M 32 52 Q 72 24 112 44 T 168 36"
        fill="none"
        stroke="#286dc0"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}
