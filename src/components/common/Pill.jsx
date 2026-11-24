const TONE = {
  BUY: "pill-profit",
  PROFIT: "pill-profit",
  SELL: "pill-loss",
  LOSS: "pill-loss",
  BREAKEVEN: "pill-be",
  RUNNING: "pill-run",
};

/** Coloured label for trade type and result: BUY, SELL, PROFIT, LOSS, BREAKEVEN, RUNNING. */
export default function Pill({ value }) {
  return <span className={`pill ${TONE[value] ?? ""}`}>{value}</span>;
}
