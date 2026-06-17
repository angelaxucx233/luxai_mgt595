/** Secondary control on Your Turn slides — reveals solution and unlocks Continue. */
export default function YourTurnAnswerButton({ onClick, disabled = false, label = 'Show answer' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="px-6 py-2.5 rounded-full border border-slate-500 text-slate-300 hover:border-amber-500/60 hover:text-amber-200 text-sm font-semibold disabled:opacity-40 transition"
    >
      {label}
    </button>
  );
}
