// Month grid of daily closed P&L with previous/next month buttons.
// Phones show short amounts (+180) and one-letter day names.
import { useMemo, useState } from "react";
import { formatMonth, todayISO } from "../../utils/dates.js";
import { formatCompact, formatMoney, plural, pnlClass } from "../../utils/format.js";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TONE = {
  win: "border-profit/25 bg-profit/15",
  loss: "border-loss/25 bg-loss/15",
  flat: "border-transparent bg-be/15",
  none: "border-transparent bg-surface-2",
};
const CELL =
  "flex aspect-square min-w-0 flex-col justify-between rounded-md border p-[3px] text-[9px] min-[360px]:p-1 min-[360px]:text-[10px] sm:aspect-[1.15] sm:rounded-lg sm:px-[7px] sm:py-1.5 sm:text-[11px]";

function MonthButton({ label, onClick, children }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className="grid size-8 cursor-pointer place-items-center rounded-lg border border-line text-muted hover:text-fg">
      {children}
    </button>
  );
}

/** @param {{ days: Array<{date:string, net:number, trades:object[]}> }} props  closed-trade totals per day */
export default function PnlCalendar({ days }) {
  const today = todayISO();
  const [view, setView] = useState(() => ({ year: Number(today.slice(0, 4)), month: Number(today.slice(5, 7)) }));
  const byDate = useMemo(() => new Map(days.map((d) => [d.date, d])), [days]);

  const shiftMonth = (step) =>
    setView(({ year, month }) => {
      const d = new Date(year, month - 1 + step, 1);
      return { year: d.getFullYear(), month: d.getMonth() + 1 };
    });

  const leadingBlanks = new Date(view.year, view.month - 1, 1).getDay();
  const daysInMonth = new Date(view.year, view.month, 0).getDate();
  const monthPrefix = `${view.year}-${String(view.month).padStart(2, "0")}`;
  const monthNet = days.filter((d) => d.date.startsWith(monthPrefix)).reduce((sum, d) => sum + d.net, 0);

  return (
    <section className="card">
      <div className="mb-3.5 flex items-center justify-between gap-3">
        <h2 className="text-base">P&amp;L calendar</h2>
        <div className="flex items-center gap-1.5">
          <MonthButton label="Previous month" onClick={() => shiftMonth(-1)}>‹</MonthButton>
          <span className="label min-w-[7.5rem] text-center" aria-live="polite">{formatMonth(view.year, view.month)}</span>
          <MonthButton label="Next month" onClick={() => shiftMonth(1)}>›</MonthButton>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {WEEKDAYS.map((d) => (
          <div key={d} className="pb-1 text-center text-[10px] text-faint sm:text-[11px]">
            <span className="sm:hidden">{d[0]}</span>
            <span className="hidden sm:inline">{d}</span>
          </div>
        ))}
        {Array.from({ length: leadingBlanks }, (_, i) => <div key={`blank-${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const date = `${monthPrefix}-${String(i + 1).padStart(2, "0")}`;
          const day = byDate.get(date);
          const tone = !day ? "none" : day.net > 0 ? "win" : day.net < 0 ? "loss" : "flat";
          return (
            <div
              key={date}
              className={`${CELL} ${TONE[tone]} ${date === today ? "border-accent!" : ""}`}
              title={day ? `${date} · ${formatMoney(day.net)} · ${plural(day.trades.length, "trade")}` : date}
            >
              <span className="text-faint">{i + 1}</span>
              {day && (
                <div className="min-w-0 text-right">
                  <div className={`num truncate font-semibold tracking-[-0.02em] sm:text-xs sm:tracking-normal ${pnlClass(day.net)}`}>
                    <span className="sm:hidden">{formatCompact(day.net)}</span>
                    <span className="hidden sm:inline">{formatMoney(day.net)}</span>
                  </div>
                  <div className="hidden text-[10px] text-muted md:block">{plural(day.trades.length, "trade")}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3.5 gap-y-1 text-xs text-muted">
        <div className="flex flex-wrap gap-x-3.5 gap-y-1">
          <span className="inline-flex items-center gap-1.5"><i className="size-2.5 rounded-[3px] bg-profit" />Green day</span>
          <span className="inline-flex items-center gap-1.5"><i className="size-2.5 rounded-[3px] bg-loss" />Red day</span>
          <span className="inline-flex items-center gap-1.5"><i className="size-2.5 rounded-[3px] bg-be" />Breakeven</span>
          <span className="inline-flex items-center gap-1.5"><i className="size-2.5 rounded-[3px] border border-accent" />Today</span>
        </div>
        <span className="num">Month: <b className={pnlClass(monthNet)}>{formatMoney(monthNet)}</b></span>
      </div>
    </section>
  );
}
