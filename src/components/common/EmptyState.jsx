/** Friendly placeholder shown when there is no data yet, with an optional action button. */
export default function EmptyState({ title, message, action, compact = false }) {
  return (
    <div className={`flex flex-col items-center text-center ${compact ? "py-6" : "py-10 sm:py-14"}`}>
      <span className="mb-3 grid size-11 place-items-center rounded-full border border-line bg-surface-2 text-accent" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 14l4.5-4.5 3 3L17 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <h2 className="text-base">{title}</h2>
      {message && <p className="sub max-w-[38ch] text-balance">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
