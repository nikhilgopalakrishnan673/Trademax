// Trade log. Phones: one card per trade. 768px and up: the full 13-column table, Pairs column pinned.
import { useMemo, useState } from "react";
import EmptyState from "../components/common/EmptyState.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import PairFilter from "../components/trades/PairFilter.jsx";
import TradeCardList from "../components/trades/TradeCardList.jsx";
import TradeTable from "../components/trades/TradeTable.jsx";
import { useTradePanel } from "../context/TradePanelContext.jsx";
import { useTrades } from "../context/TradesContext.jsx";
import { formatMoney, plural, pnlClass } from "../utils/format.js";
import { isClosed, sortNewestFirst, sumMoney } from "../utils/stats.js";

export default function TradeLogPage() {
  const { trades, status } = useTrades();
  const { openNewTrade } = useTradePanel();
  const [selectedPair, setSelectedPair] = useState("All");

  const pairs = useMemo(() => [...new Set(trades.map((t) => t.pair))].sort(), [trades]);
  // If the last trade for the selected pair was deleted, fall back to "All".
  const pairFilter = pairs.includes(selectedPair) ? selectedPair : "All";

  const rows = useMemo(
    () => sortNewestFirst(trades.filter((t) => pairFilter === "All" || t.pair === pairFilter)),
    [trades, pairFilter],
  );
  const closedNet = sumMoney(rows.filter(isClosed).map((t) => t.pnl));
  const logTrade = () => openNewTrade(pairFilter === "All" ? {} : { pair: pairFilter });

  return (
    <>
      <PageHeader
        title="Trade log"
        subtitle="Same columns as your Notion Trades Journal"
        action={<button className="btn btn-primary" type="button" onClick={logTrade}>+ Log trade</button>}
      />
      {status === "ready" && trades.length === 0 ? (
        <section className="card">
          <EmptyState
            title="No trades logged yet"
            message="Log a trade and it appears here with every column from your Notion journal. Click a trade to view, edit or delete it."
            action={<button className="btn btn-primary" type="button" onClick={logTrade}>+ Log your first trade</button>}
          />
        </section>
      ) : (
        <>
          <PairFilter pairs={pairs} value={pairFilter} onChange={setSelectedPair} />
          <TradeCardList trades={rows} />
          <TradeTable trades={rows} />
          <div className="mt-2.5 flex flex-wrap justify-between gap-3 text-xs text-muted">
            <span>{plural(rows.length, "trade")} · closed P&amp;L <b className={`num ${pnlClass(closedNet)}`}>{formatMoney(closedNet)}</b></span>
            <span>Click a trade to view, edit or delete it</span>
          </div>
        </>
      )}
    </>
  );
}
