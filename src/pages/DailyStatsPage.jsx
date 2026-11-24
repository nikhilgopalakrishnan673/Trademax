import EmptyState from "../components/common/EmptyState.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import { useTradePanel } from "../context/TradePanelContext.jsx";
import { useTrades } from "../context/TradesContext.jsx";
import { formatShortDate, formatWeekday } from "../utils/dates.js";
import { formatMoney, plural, pnlClass } from "../utils/format.js";

const DOT = { PROFIT: "bg-profit", LOSS: "bg-loss", BREAKEVEN: "bg-be" };

function DayRow({ day }) {
  return (
    <div className="grid grid-cols-[72px_1fr_auto] items-center gap-3 px-1 py-3.5 first:pt-1 sm:grid-cols-[110px_1fr_90px_110px]">
      <div><b>{formatShortDate(day.date)}</b><div className="hint">{formatWeekday(day.date)}</div></div>
      <div className="flex min-w-0 flex-wrap items-center gap-1">
        {day.trades.map((t) => <i key={t.id} className={`block size-2.5 rounded-[3px] ${DOT[t.result]}`} title={`${t.pair} ${t.result}`} />)}
        <span className="hint ml-1.5 min-w-0">{day.trades.map((t) => t.pair).join(", ")}</span>
      </div>
      <div className="label hidden sm:block">{plural(day.trades.length, "trade")}</div>
      <div className={`num text-right font-semibold ${pnlClass(day.net)}`}>{formatMoney(day.net)}</div>
    </div>
  );
}

export default function DailyStatsPage() {
  const { stats } = useTrades();
  const { openNewTrade } = useTradePanel();

  return (
    <>
      <PageHeader title="Daily stats" subtitle="Every trading day, newest first. Closed trades only." />
      <section className="card">
        {stats.days.length ? (
          <div className="flex flex-col divide-y divide-line">{stats.days.map((d) => <DayRow key={d.date} day={d} />)}</div>
        ) : (
          <EmptyState
            title="No trading days yet"
            message={stats.openTrades.length
              ? "Your running trades show up here once you close them as profit, loss or breakeven."
              : "Each day you close a trade gets a row here with its net P&L."}
            action={<button className="btn btn-primary" type="button" onClick={() => openNewTrade()}>+ Log trade</button>}
          />
        )}
      </section>
    </>
  );
}
