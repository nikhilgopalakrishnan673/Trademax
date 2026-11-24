// All trading statistics are calculated here, from the trader's own records.
// Pages never calculate figures themselves, so every page shows the same numbers.
//
// Rules:
// - A trade with result RUNNING is an open position. It is left out of every closed-trade figure.
// - Win rate counts breakeven trades as "not a win" (wins ÷ all closed trades).
// - Ratios that need data on both sides return null when that data doesn't exist yet,
//   e.g. profit factor with no losing trades. The UI shows "—" for null.

/** Sums money without floating-point drift (0.1 + 0.2 → 0.3). */
export const sumMoney = (amounts) => Math.round(amounts.reduce((total, x) => total + x * 100, 0)) / 100;

export const isClosed = (trade) => trade.result !== "RUNNING";

/** Closed trades grouped by day, newest day first. */
export function dailyTotals(trades) {
  const byDate = new Map();
  for (const trade of trades) {
    if (!isClosed(trade)) continue;
    if (!byDate.has(trade.date)) byDate.set(trade.date, []);
    byDate.get(trade.date).push(trade);
  }
  return [...byDate.entries()]
    .map(([date, dayTrades]) => ({ date, trades: dayTrades, net: sumMoney(dayTrades.map((t) => t.pnl)) }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function summarize(trades) {
  const closed = trades.filter(isClosed);
  const wins = closed.filter((t) => t.pnl > 0);
  const losses = closed.filter((t) => t.pnl < 0);
  const grossProfit = sumMoney(wins.map((t) => t.pnl));
  const grossLoss = Math.abs(sumMoney(losses.map((t) => t.pnl)));
  const days = dailyTotals(trades);
  const greenDays = days.filter((d) => d.net > 0).length;

  return {
    totalTrades: trades.length,
    closedCount: closed.length,
    openTrades: trades.filter((t) => !isClosed(t)),
    winCount: wins.length,
    lossCount: losses.length,
    breakevenCount: closed.length - wins.length - losses.length,
    grossProfit,
    grossLoss,
    netPnl: sumMoney([grossProfit, -grossLoss]),
    profitFactor: grossLoss > 0 ? grossProfit / grossLoss : null,
    avgWin: wins.length ? grossProfit / wins.length : null,
    avgLoss: losses.length ? grossLoss / losses.length : null,
    winRateTrades: closed.length ? (wins.length / closed.length) * 100 : null,
    days,
    greenDays,
    winRateDays: days.length ? (greenDays / days.length) * 100 : null,
  };
}

/** Trades whose date falls between from and to, inclusive. Dates are "YYYY-MM-DD" strings. */
export const tradesBetween = (trades, from, to) => trades.filter((t) => t.date >= from && t.date <= to);

/** Newest first; trades on the same day keep the order they were logged (latest first). */
export const sortNewestFirst = (trades) =>
  [...trades].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
