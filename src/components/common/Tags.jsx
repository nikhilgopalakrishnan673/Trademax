/** Wrapping list of small tags, or a dash when there are none. */
export default function Tags({ items, className = "" }) {
  if (!items?.length) return <span className="hint">—</span>;
  return (
    <div className={`flex max-w-[220px] flex-wrap gap-1 ${className}`}>
      {items.map((item) => (
        <span key={item} className="tag">{item}</span>
      ))}
    </div>
  );
}
