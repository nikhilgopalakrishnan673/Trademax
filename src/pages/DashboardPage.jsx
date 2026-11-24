import RatioBar from "../components/charts/RatioBar.jsx";
import PnlCalendar from "../components/charts/PnlCalendar.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import OpenPositions from "../components/dashboard/OpenPositions.jsx";
import StatCard, { STAT_FOOT } from "../components/dashboard/StatCard.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import { useTradePanel } from "../context/TradePanelContext.jsx";
import { useTrades } from "../context/TradesContext.jsx";
import { formatMoney, formatPercent, plural, pnlClass } from "../utils/format.js";

const share = (a, b) => (a + b > 0 ? (a / (a + b)) * 100 : null);

export default function DashboardPage() {
  const { trades, stats: s } = useTrades();
  const { openNewTrade } = useTradePanel();

  const profitFactor = s.profitFactor === null ? "—" : s.profitFactor.toFixed(2);
  const pfFoot = s.closedCount === 0 ? "No closed trades yet" : s.grossLoss === 0 ? "No losing trades yet" : null;
  const avgRatio = s.avgWin !== null && s.avgLoss !== null ? `Ratio ${(s.avgWin / s.avgLoss).toFixed(2)} : 1` : "Needs a win and a loss";

  return (
    <>
      <PageHeader title="Dashboard" subtitle={`All time · all pairs · ${plural(trades.length, "trade")}`} />
      {trades.length === 0 && (
        <section className="card mb-4 sm:mb-5">
          <EmptyState
            compact
            title="No trades yet"
            message="Your net P&L, profit factor, win rates and calendar fill in as soon as you log trades."
            action={<button className="btn btn-primary" type="button" onClick={() => openNewTrade()}>+ Log trade</button>}
          />
        </section>
      )}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:mb-5 sm:gap-4 lg:grid-cols-5">
        <StatCard className="col-span-2 lg:col-span-1" label="Net P&L" value={formatMoney(s.netPnl)} valueClass={pnlClass(s.netPnl)} foot={plural(s.closedCount, "closed trade")} />
        <StatCard label="Profit factor" value={profitFactor}>
          <RatioBar profitShare={share(s.grossProfit, s.grossLoss)} />
          <small className={`${STAT_FOOT} num`}>{pfFoot ?? `${formatMoney(s.grossProfit, { sign: false })} won · ${formatMoney(s.grossLoss, { sign: false })} lost`}</small>
        </StatCard>
        <StatCard label="Avg win / avg loss" foot={avgRatio}>
          <div className="mt-1.5 flex flex-wrap items-baseline justify-between gap-x-2">
            <span className="num text-lg font-semibold whitespace-nowrap text-profit sm:text-xl">{s.avgWin === null ? "—" : formatMoney(s.avgWin, { sign: false })}</span>
            <span className="num text-lg font-semibold whitespace-nowrap text-loss sm:text-xl">{s.avgLoss === null ? "—" : formatMoney(-s.avgLoss)}</span>
          </div>
          <RatioBar profitShare={share(s.avgWin ?? 0, s.avgLoss ?? 0)} />
        </StatCard>
        <StatCard
          label="Win % · trades"
          value={s.winRateTrades === null ? "—" : formatPercent(s.winRateTrades)}
          ring={s.winRateTrades}
          foot={`${s.winCount} won · ${s.lossCount} lost · ${s.breakevenCount} BE`}
        />
        <StatCard
          label="Win % · days"
          value={s.winRateDays === null ? "—" : formatPercent(s.winRateDays)}
          ring={s.winRateDays}
          foot={`${s.greenDays} green of ${plural(s.days.length, "day")}`}
        />
      </div>
      <div className="grid items-start gap-4 sm:gap-5 lg:grid-cols-[1fr_1.35fr]">
        <OpenPositions trades={s.openTrades} />
        <PnlCalendar days={s.days} />
      </div>
    </>
  );
}
