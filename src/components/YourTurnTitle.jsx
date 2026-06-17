/** Large problem title for Your Turn slides. */
export default function YourTurnTitle({ children, className = '' }) {
  if (!children) return null;
  return (
    <h2
      className={`text-3xl md:text-4xl font-bold text-white text-center leading-tight tracking-tight ${className}`}
    >
      {children}
    </h2>
  );
}

function isYourTurnEyebrow(eyebrow) {
  return String(eyebrow ?? '').trim().toLowerCase() === 'your turn';
}

export { isYourTurnEyebrow };
