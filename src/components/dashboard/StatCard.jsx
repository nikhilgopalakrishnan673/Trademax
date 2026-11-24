import Ring from "../charts/Ring.jsx";

/** Value classes shared by dashboard cards. */
export const STAT_VALUE = "num mt-1.5 text-[22px] leading-[1.1] font-semibold sm:text-[26px]";
export const STAT_FOOT = "mt-1.5 block text-xs text-muted";

/** Dashboard card: label, big value, optional ring or extra content, and a footnote. */
export default function StatCard({ label, value, valueClass = "", ring, children, foot, className = "" }) {
  const heading = (
    <div className="min-w-0">
      <div className="label">{label}</div>
      {value !== undefined && <div className={`${STAT_VALUE} ${valueClass}`}>{value}</div>}
    </div>
  );
  return (
    <div className={`card ${className}`}>
      {ring !== undefined ? (
        <div className="flex items-center justify-between gap-2">{heading}<Ring percent={ring} /></div>
      ) : (
        heading
      )}
      {children}
      {foot && <small className={STAT_FOOT}>{foot}</small>}
    </div>
  );
}
