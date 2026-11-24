// Label + control + optional hint or error message, stacked.
export default function Field({ label, htmlFor, error, hint, children }) {
  return (
    <div className="flex flex-col gap-[7px]">
      {htmlFor ? (
        <label htmlFor={htmlFor} className="text-xs font-medium text-muted">{label}</label>
      ) : (
        <span className="label">{label}</span>
      )}
      {children}
      {error ? <span className="text-xs text-loss" role="alert">{error}</span> : hint && <span className="hint">{hint}</span>}
    </div>
  );
}
