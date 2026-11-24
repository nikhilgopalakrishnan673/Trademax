const RADIUS = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Progress ring for a percentage (0–100). Shows an empty ring when percent is null. */
export default function Ring({ percent }) {
  const length = ((percent ?? 0) / 100) * CIRCUMFERENCE;
  return (
    <svg className="size-11 shrink-0 sm:size-14" viewBox="0 0 56 56" aria-hidden="true">
      <circle cx="28" cy="28" r={RADIUS} fill="none" stroke="var(--color-surface-2)" strokeWidth="6" />
      {length > 0 && (
        <circle
          cx="28" cy="28" r={RADIUS} fill="none" stroke="var(--color-profit)" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={`${length} ${CIRCUMFERENCE}`} transform="rotate(-90 28 28)"
        />
      )}
    </svg>
  );
}
