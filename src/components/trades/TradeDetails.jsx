// Read-only view of one trade, with Edit and Delete.
import { useState } from "react";
import { useToast } from "../../context/ToastContext.jsx";
import { useTrades } from "../../context/TradesContext.jsx";
import { formatLongDate } from "../../utils/dates.js";
import { formatMoney, orDash, pnlClass } from "../../utils/format.js";
import PairLabel from "../common/PairLabel.jsx";
import Pill from "../common/Pill.jsx";
import SidePanel from "../common/SidePanel.jsx";
import Tags from "../common/Tags.jsx";

function Row({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="label shrink-0 pt-0.5">{label}</span>
      <div className="min-w-0 text-right [&>div]:ml-auto [&>div]:justify-end">{children}</div>
    </div>
  );
}

export default function TradeDetails({ tradeId, onClose, onEdit }) {
  const { trades, removeTrade } = useTrades();
  const { showToast } = useToast();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const trade = trades.find((t) => t.id === tradeId);

  if (!trade) {
    return (
      <SidePanel title="Trade details" onClose={onClose}>
        <p className="text-muted">This trade no longer exists.</p>
      </SidePanel>
    );
  }

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await removeTrade(trade.id);
      showToast(`Deleted ${trade.pair} ${trade.type}`);
      onClose();
    } catch (error) {
      setDeleting(false);
      showToast(error.message, "error");
    }
  };

  const footer = confirmingDelete ? (
    <>
      <button className="btn flex-1 sm:flex-none" type="button" onClick={() => setConfirmingDelete(false)} disabled={deleting}>Keep trade</button>
      <button className="btn flex-1 border-loss bg-loss text-bg hover:border-loss disabled:opacity-60 sm:flex-none" type="button" onClick={handleDelete} disabled={deleting}>
        {deleting ? "Deleting…" : "Delete permanently"}
      </button>
    </>
  ) : (
    <>
      <button className="btn flex-1 text-loss sm:mr-auto sm:flex-none" type="button" onClick={() => setConfirmingDelete(true)}>Delete</button>
      <button className="btn btn-primary flex-1 sm:flex-none" type="button" onClick={onEdit}>Edit trade</button>
    </>
  );

  return (
    <SidePanel title="Trade details" onClose={onClose} footer={footer}>
      {confirmingDelete && (
        <p className="rounded-[9px] border border-loss/40 bg-loss/10 px-3 py-2.5 text-[0.8125rem] text-loss" role="alert">
          Delete this trade? It is removed from your journal and every statistic. This can't be undone.
        </p>
      )}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-lg font-semibold"><PairLabel pair={trade.pair} /></div>
          <div className="sub">{formatLongDate(trade.date)}</div>
        </div>
        <div className="text-right">
          <div className={`num text-2xl font-semibold ${pnlClass(trade.pnl)}`}>{formatMoney(trade.pnl)}</div>
          {trade.result === "RUNNING" && <div className="hint">unrealised</div>}
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5"><Pill value={trade.type} /><Pill value={trade.result} /></div>
      <div className="divide-y divide-line border-y border-line">
        <Row label="Entry method">{orDash(trade.entryMethod)}</Row>
        <Row label="Risk level">{orDash(trade.riskLevel)}</Row>
        <Row label="RR ratio"><span className="num">{orDash(trade.rrRatio)}</span></Row>
        <Row label="Max RR"><span className="num">{orDash(trade.maxRr)}</span></Row>
        <Row label="Market conditions"><Tags items={trade.marketConditions} /></Row>
        <Row label="Positive confluences"><Tags items={trade.positiveConfluences} /></Row>
        <Row label="Negative confluences"><Tags items={trade.negativeConfluences} /></Row>
      </div>
      <div>
        <div className="label mb-1.5">Trade notes</div>
        <p className="whitespace-pre-wrap text-muted">{trade.notes || "No notes."}</p>
      </div>
    </SidePanel>
  );
}
