import { flagFor } from "../../utils/flags.js";

/** Flag (or gold/silver coin) followed by the pair name, e.g. 🇬🇧 GBP/JPY. */
export default function PairLabel({ pair, bold = false }) {
  const icon = flagFor(pair);
  return (
    <>
      {icon.kind === "flag" && (
        <span className="flag" title={icon.label} aria-hidden="true">{icon.emoji}</span>
      )}
      {icon.kind === "metal" && (
        <span className={`metal ${icon.metal === "gold" ? "metal-xau" : "metal-xag"}`} title={icon.metal === "gold" ? "Gold" : "Silver"} aria-hidden="true">
          {icon.metal === "gold" ? "Au" : "Ag"}
        </span>
      )}
      {bold ? <b>{pair}</b> : pair}
    </>
  );
}
