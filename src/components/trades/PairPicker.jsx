// Searchable list of every pair, grouped, with the stronger currency's flag.
import { useEffect, useRef, useState } from "react";
import { INDICES, PAIR_GROUPS } from "../../constants/pairs.js";
import { strongCurrency } from "../../utils/flags.js";
import PairLabel from "../common/PairLabel.jsx";

const normalise = (text) => text.trim().toUpperCase().replace(/\s+/g, "");

function matches(pair, query) {
  if (!query) return true;
  return (
    pair.replace("/", "").includes(query.replace("/", "")) ||
    pair.includes(query) ||
    normalise(INDICES[pair] ?? "").includes(query)
  );
}

export default function PairPicker({ value, onChange, invalid }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef(null);
  const buttonRef = useRef(null);

  // Close when clicking anywhere outside the picker.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => !rootRef.current?.contains(e.target) && setOpen(false);
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const q = normalise(query);
  const groups = Object.entries(PAIR_GROUPS)
    .map(([group, pairs]) => [group, pairs.filter((p) => matches(p, q))])
    .filter(([, pairs]) => pairs.length);

  const choose = (pair) => {
    onChange(pair);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onSearchKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const first = groups[0]?.[1][0];
      if (first) choose(first);
    }
    if (e.key === "Escape") {
      e.preventDefault(); // keep the panel open; only close the list
      setOpen(false);
      buttonRef.current?.focus();
    }
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        id="pair"
        className={`input flex cursor-pointer items-center gap-0.5 text-left ${invalid ? "border-loss" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => { setQuery(""); setOpen((o) => !o); }}
      >
        <PairLabel pair={value} bold />
        <span className="ml-auto text-[11px] text-faint" aria-hidden="true">▼</span>
      </button>
      {open && (
        <div className="absolute inset-x-0 top-[calc(100%+6px)] z-10 rounded-[10px] border border-line bg-surface p-2 shadow-[0_14px_34px_rgba(15,23,42,.12)] min-[400px]:right-auto min-[400px]:w-[min(320px,calc(100vw-48px))]">
          <input
            className="input"
            autoFocus
            autoComplete="off"
            placeholder="Search, e.g. GBP or EURJPY"
            aria-label="Search pairs"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onSearchKey}
          />
          <div className="mt-1.5 max-h-[min(300px,50dvh)] overflow-y-auto overscroll-contain" role="listbox">
            {groups.length === 0 && <div className="py-5 text-center text-muted">No pair matches “{query.trim()}”</div>}
            {groups.map(([group, pairs]) => (
              <div key={group}>
                <div className="px-2 pt-2.5 pb-1 text-[11px] tracking-[0.06em] text-faint uppercase">{group}</div>
                {pairs.map((pair) => (
                  <button
                    key={pair}
                    type="button"
                    role="option"
                    aria-selected={pair === value}
                    onClick={() => choose(pair)}
                    className="flex min-h-10 w-full cursor-pointer items-center rounded-[7px] border-0 bg-transparent px-2 text-left font-medium hover:bg-surface aria-selected:bg-surface sm:min-h-9"
                  >
                    <PairLabel pair={pair} />
                    <span className="ml-auto text-[11px] font-normal text-faint">{INDICES[pair] ?? strongCurrency(pair)}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
