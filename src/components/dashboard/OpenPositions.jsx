import { useTradePanel } from "../../context/TradePanelContext.jsx";
import { formatShortDate } from "../../utils/dates.js";
import { formatMoney, orDash, pnlClass } from "../../utils/format.js";
import PairLabel from "../common/PairLabel.jsx";
import Pill from "../common/Pill.jsx";

/** Trades marked RUNNING. Tap one to see details, edit it or close it out. */
export default function OpenPositions({ trades }) {
  const { openTradeDetails } = useTradePanel();

  return (
    <section className="card">
      <div className="mb-3.5 flex items-center justify-between gap-3">
        <h2 className="text-base">Open positions</h2>
        <span className="label">{trades.length} running</span>
      </div>
      {trades.length === 0 ? (
        <p className="py-5 text-center text-muted">No open positions. Trades marked RUNNING show up here.</p>
      ) : (
        <div className="flex flex-col divide-y divide-line">
          {trades.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => openTradeDetails(t.id)}
              className="grid cursor-pointer grid-cols-[1fr_auto] gap-x-3 gap-y-1 bg-transparent py-3.5 text-left first:pt-1 hover:opacity-90"
            >
              <div className="min-w-0">
                <div className="text-[15px] font-semibold"><PairLabel pair={t.pair} /> <Pill value={t.type} /></div>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted">
                  <span>Opened {formatShortDate(t.date)}</span><span aria-hidden="true">·</span>
                  <span>Risk {orDash(t.riskLevel)}</span><span aria-hidden="true">·</span>
                  <span>Target {t.rrRatio === null ? "—" : `${t.rrRatio}R`}</span><span aria-hidden="true">·</span>
                  <span>{orDash(t.entryMethod)}</span>
                </div>
              </div>
              <div className="text-right">
                <div className={`num text-[17px] font-semibold ${pnlClass(t.pnl)}`}>{formatMoney(t.pnl)}</div>
                <div className="hint">unrealised</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
