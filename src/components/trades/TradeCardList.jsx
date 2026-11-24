// Trade list for phones: one card per trade. Tap a card to open the trade.
import { useTradePanel } from "../../context/TradePanelContext.jsx";
import { formatShortDate } from "../../utils/dates.js";
import { formatMoney, orDash, pnlClass } from "../../utils/format.js";
import PairLabel from "../common/PairLabel.jsx";
import Pill from "../common/Pill.jsx";
import Tags from "../common/Tags.jsx";

function CardRow({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-3 py-1.5">
      <span className="label shrink-0 pt-0.5">{label}</span>
      <div className="min-w-0 text-right [&>div]:ml-auto [&>div]:justify-end">{children}</div>
    </div>
  );
}

export default function TradeCardList({ trades }) {
  const { openTradeDetails } = useTradePanel();

  return (
    <div className="flex flex-col gap-3 md:hidden">
      {trades.map((t) => (
        <article
          key={t.id}
          className="card cursor-pointer"
          tabIndex={0}
          aria-label={`${t.pair} ${t.type} on ${formatShortDate(t.date)}, open details`}
          onClick={() => openTradeDetails(t.id)}
          onKeyDown={(e) => e.key === "Enter" && openTradeDetails(t.id)}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[0.9375rem] font-semibold"><PairLabel pair={t.pair} /></div>
              <div className="hint mt-0.5">{formatShortDate(t.date)} · {orDash(t.entryMethod)} · Risk {orDash(t.riskLevel)}</div>
            </div>
            <div className={`num text-right text-[1.0625rem] font-semibold ${pnlClass(t.pnl)}`}>{formatMoney(t.pnl)}</div>
          </div>
          <div className="mt-2.5 flex flex-wrap gap-1.5"><Pill value={t.type} /><Pill value={t.result} /></div>
          <div className="mt-3 divide-y divide-line border-t border-line">
            <CardRow label="RR / Max RR"><span className="num">{orDash(t.rrRatio)} / {orDash(t.maxRr)}</span></CardRow>
            <CardRow label="Market"><Tags items={t.marketConditions} /></CardRow>
            <CardRow label="Positive"><Tags items={t.positiveConfluences} /></CardRow>
            <CardRow label="Negative"><Tags items={t.negativeConfluences} /></CardRow>
            {t.notes && <p className="line-clamp-3 pt-2.5 text-[0.8125rem] text-muted">{t.notes}</p>}
          </div>
        </article>
      ))}
    </div>
  );
}

