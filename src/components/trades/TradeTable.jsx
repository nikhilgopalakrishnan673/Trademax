// Full trade table for tablets and up. Same columns as the Notion "Trades Journal", plus P&L ($).
// Click a row (or press Enter on it) to open the trade.
import { useTradePanel } from "../../context/TradePanelContext.jsx";
import { formatShortDate } from "../../utils/dates.js";
import { formatMoney, orDash, pnlClass } from "../../utils/format.js";
import PairLabel from "../common/PairLabel.jsx";
import Pill from "../common/Pill.jsx";
import Tags from "../common/Tags.jsx";

const TH = "whitespace-nowrap bg-surface px-3.5 py-3 text-left text-xs font-medium text-muted";
const TD = "px-3.5 py-3 align-top group-hover:bg-surface-2";

export default function TradeTable({ trades }) {
  const { openTradeDetails } = useTradePanel();

  return (
    <div className="hidden overflow-x-auto rounded-card border border-line bg-surface md:block">
      <table className="w-full min-w-[1240px] border-collapse">
        <thead>
          <tr className="border-b border-line">
            <th className={`${TH} sticky left-0 z-10`}>Pairs</th>
            <th className={TH}>Trade Date</th>
            <th className={TH}>Trade Type</th>
            <th className={TH}>Entry method</th>
            <th className={TH}>Market Conditions</th>
            <th className={TH}>Positive Confluences</th>
            <th className={TH}>Negative Confluences</th>
            <th className={TH}>Risk Level</th>
            <th className={TH}>RR Ratio</th>
            <th className={TH}>MaxRR</th>
            <th className={TH}>Profit/Loss</th>
            <th className={`${TH} text-accent!`}>P&amp;L ($)</th>
            <th className={TH}>Trade Notes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {trades.map((t) => (
            <tr
              key={t.id}
              className="group cursor-pointer"
              tabIndex={0}
              aria-label={`${t.pair} ${t.type} on ${formatShortDate(t.date)}, open details`}
              onClick={() => openTradeDetails(t.id)}
              onKeyDown={(e) => e.key === "Enter" && openTradeDetails(t.id)}
            >
              <td className={`${TD} sticky left-0 z-10 bg-surface font-semibold whitespace-nowrap`}><PairLabel pair={t.pair} /></td>
              <td className={`${TD} num`}>{formatShortDate(t.date)}</td>
              <td className={TD}><Pill value={t.type} /></td>
              <td className={TD}>{orDash(t.entryMethod)}</td>
              <td className={TD}><Tags items={t.marketConditions} /></td>
              <td className={TD}><Tags items={t.positiveConfluences} /></td>
              <td className={TD}><Tags items={t.negativeConfluences} /></td>
              <td className={TD}>{orDash(t.riskLevel)}</td>
              <td className={`${TD} num`}>{orDash(t.rrRatio)}</td>
              <td className={`${TD} num`}>{orDash(t.maxRr)}</td>
              <td className={TD}><Pill value={t.result} /></td>
              <td className={`${TD} num ${pnlClass(t.pnl)}`}>{formatMoney(t.pnl)}</td>
              <td className={`${TD} max-w-[240px] text-muted`}>{t.notes ? <span className="line-clamp-3">{t.notes}</span> : <span className="hint">—</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
