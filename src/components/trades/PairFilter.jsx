import PairLabel from "../common/PairLabel.jsx";

/** "All" plus one chip per pair the trader has logged. Scrolls sideways on phones. */
export default function PairFilter({ pairs, value, onChange }) {
  return (
    <div className="-mx-4 mb-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
      <div className="flex w-max gap-1.5 sm:w-auto sm:flex-wrap" role="group" aria-label="Filter by pair">
        {["All", ...pairs].map((pair) => (
          <button key={pair} className="chip" type="button" aria-pressed={pair === value} onClick={() => onChange(pair)}>
            {pair === "All" ? "All" : <PairLabel pair={pair} />}
          </button>
        ))}
      </div>
    </div>
  );
}
