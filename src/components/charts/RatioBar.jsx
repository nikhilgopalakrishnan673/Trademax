/** Green/red split bar. `profitShare` is the green part in percent; null draws an empty bar. */
export default function RatioBar({ profitShare }) {
  return (
    <div className="mt-3.5 flex h-1.5 overflow-hidden rounded-[3px] bg-surface-2" aria-hidden="true">
      {profitShare !== null && (
        <>
          <i className="block h-full bg-profit" style={{ width: `${profitShare}%` }} />
          <i className="block h-full bg-loss" style={{ width: `${100 - profitShare}%` }} />
        </>
      )}
    </div>
  );
}
