import { useMemo } from "react";
import EmptyState from "../components/common/EmptyState.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import { useProfile } from "../context/ProfileContext.jsx";
import { useTradePanel } from "../context/TradePanelContext.jsx";
import { useTrades } from "../context/TradesContext.jsx";
import { formatMonth, getQuoteOfTheDay, greetingFor, marketStatus, startOfWeekISO, todayISO } from "../utils/dates.js";
import { formatMoney, formatPercent, plural, pnlClass } from "../utils/format.js";
import { sumMoney, summarize, tradesBetween } from "../utils/stats.js";

function ActionCard({ href, onClick, title, subtitle }) {
  const content = (
    <>
      <div className="min-w-0"><b className="block">{title}</b><span className="block text-[0.8125rem] text-muted">{subtitle}</span></div>
      <span className="text-lg text-faint" aria-hidden="true">→</span>
    </>
  );
  const className = "card flex w-full cursor-pointer items-center justify-between gap-3 text-left text-fg no-underline hover:border-faint";
  return onClick
    ? <button type="button" className={className} onClick={onClick}>{content}</button>
    : <a className={className} href={href}>{content}</a>;
}

function MiniStat({ label, value, tone = "" }) {
  return <div><span className="label">{label}</span><b className={`num block text-base font-semibold sm:text-lg ${tone}`}>{value}</b></div>;
}

export default function HomePage() {
  const { trades, status } = useTrades();
  const { profile } = useProfile();
  const { openNewTrade } = useTradePanel();

  const now = new Date();
  const today = todayISO();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const { monthStats, weekNet } = useMemo(() => {
    const monthStats = summarize(tradesBetween(trades, `${today.slice(0, 7)}-01`, today));
    const weekDays = summarize(tradesBetween(trades, startOfWeekISO(), today)).days;
    return { monthStats, weekNet: sumMoney(weekDays.map((d) => d.net)) };
  }, [trades, today]);

  const quote = getQuoteOfTheDay(now);
  const firstName = profile?.name.split(" ")[0];
  const greeting = firstName ? `${greetingFor(now)}, ${firstName}` : greetingFor(now);
  const dateLine = now.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" });
  const hasTradesThisMonth = monthStats.totalTrades > 0;

  return (
    <>
      <PageHeader title={greeting} subtitle={`${dateLine} · ${marketStatus(now)}`} />
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-[1.25fr_1fr]">
        <section className="card p-5 sm:p-8">
          <div className="label">Net P&amp;L · {formatMonth(year, month).split(" ")[0]}</div>
          {status === "loading" ? (
            <div className="num mt-2.5 mb-1.5 text-[2.5rem] leading-[1.05] font-semibold text-faint sm:text-[3.25rem] lg:text-[4rem]">…</div>
          ) : (
            <div className={`num mt-2.5 mb-1.5 text-[2.5rem] leading-[1.05] font-semibold tracking-[-0.02em] sm:text-[3.25rem] lg:text-[4rem] ${pnlClass(monthStats.netPnl)}`}>
              {formatMoney(monthStats.netPnl)}
            </div>
          )}
          <div className="sub">
            {hasTradesThisMonth
              ? `${plural(monthStats.closedCount, "closed trade")} · ${monthStats.openTrades.length} still running`
              : trades.length ? "No trades logged this month yet." : "No trades yet. Log your first trade to see your numbers here."}
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-5 sm:mt-7">
            <MiniStat label="This week" value={formatMoney(weekNet)} tone={pnlClass(weekNet)} />
            <MiniStat label="Win rate" value={monthStats.winRateTrades === null ? "—" : formatPercent(monthStats.winRateTrades)} />
            <MiniStat label="Profit factor" value={monthStats.profitFactor === null ? "—" : monthStats.profitFactor.toFixed(2)} />
          </div>
        </section>
        <section className="card flex flex-col justify-between gap-5 p-5 sm:p-8">
          <div className="label">Quote of the day</div>
          <blockquote className="text-lg leading-snug font-medium text-balance sm:text-[1.375rem]">“{quote.text}”</blockquote>
          <div className="flex flex-wrap items-center justify-between gap-3"><cite className="text-muted not-italic">{quote.author}</cite><span className="hint">Refreshes daily</span></div>
        </section>
        {status === "ready" && trades.length === 0 && (
          <section className="card lg:col-span-2">
            <EmptyState
              compact
              title="Your journal is empty"
              message="Every figure on this site is worked out from the trades you log. Nothing is filled in for you."
              action={<button className="btn btn-primary" type="button" onClick={() => openNewTrade()}>+ Log your first trade</button>}
            />
          </section>
        )}
        <div className="grid gap-4 sm:grid-cols-3 sm:gap-5 lg:col-span-2">
          <ActionCard onClick={() => openNewTrade()} title="Log a trade" subtitle="Add today’s entries" />
          <ActionCard href="#dashboard" title="Open dashboard" subtitle="Win rate, calendar, open positions" />
          <ActionCard href="#daily-stats" title="Daily stats" subtitle="Day by day breakdown" />
        </div>
      </div>
    </>
  );
}
