// Chip and button groups used in the trade form.
import { useState } from "react";
import { CUSTOM_OPTION_COPY } from "../../constants/journalOptions.js";

const SELECTED_TONE = {
  BUY: "aria-pressed:text-profit",
  PROFIT: "aria-pressed:text-profit",
  SELL: "aria-pressed:text-loss",
  LOSS: "aria-pressed:text-loss",
  BREAKEVEN: "aria-pressed:text-be",
  RUNNING: "aria-pressed:text-run",
};

/** One choice from a short fixed list (trade type, result). */
export function SegmentedControl({ options, value, onChange, layout = "flex" }) {
  return (
    <div className={`${layout} gap-[3px] rounded-[9px] border border-line bg-bg p-[3px]`} role="group">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={`seg-btn ${SELECTED_TONE[option] ?? ""}`}
          aria-pressed={option === value}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

/** Toggle chips: `value` is a string (single choice) or an array (any number). */
export function ChipGroup({ options, value, onChange, isRemovable, onRemove, addControl }) {
  const multiple = Array.isArray(value);
  const isOn = (option) => (multiple ? value.includes(option) : value === option);
  const toggle = (option) => {
    if (!multiple) return onChange(option);
    onChange(isOn(option) ? value.filter((v) => v !== option) : [...value, option]);
  };

  return (
    <div className="flex flex-wrap gap-1.5" role="group">
      {options.map((option) =>
        isRemovable?.(option) ? (
          <span key={option} className="inline-flex">
            <button type="button" className="peer chip chip-sm rounded-r-none border-r-0 pr-1.5" aria-pressed={isOn(option)} onClick={() => toggle(option)}>
              {option}
            </button>
            <button
              type="button"
              className="cursor-pointer rounded-r-full border border-l-0 border-line px-2.5 text-xs text-faint hover:text-loss peer-aria-pressed:border-fg peer-aria-pressed:bg-fg peer-aria-pressed:text-bg"
              aria-label={`Remove ${option}`}
              title="Remove"
              onClick={() => onRemove(option)}
            >
              ✕
            </button>
          </span>
        ) : (
          <button key={option} type="button" className="chip chip-sm" aria-pressed={isOn(option)} onClick={() => toggle(option)}>
            {option}
          </button>
        ),
      )}
      {addControl}
    </div>
  );
}

/**
 * "+ Custom …" chip that turns into a text box. Enter or leaving the box adds the option; Esc cancels.
 * `onAdd(text)` returns an error message to show, or nothing when it worked.
 */
export function AddOptionChip({ optionKey, onAdd }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const copy = CUSTOM_OPTION_COPY[optionKey];

  const finish = (keep) => {
    if (keep && text.trim()) {
      const problem = onAdd(text.trim().replace(/\s+/g, " "));
      if (problem) return setError(problem);
    }
    setEditing(false);
    setText("");
    setError("");
  };

  if (!editing) {
    return (
      <button type="button" className="chip chip-sm border-dashed text-faint hover:border-accent hover:text-accent" onClick={() => setEditing(true)}>
        + {copy.label}
      </button>
    );
  }

  return (
    <span className="inline-flex flex-col gap-1">
      <input
        autoFocus
        className={`input w-[190px] rounded-full px-3 py-1.5 sm:py-1 sm:text-xs ${error ? "border-loss" : ""}`}
        placeholder={copy.placeholder}
        aria-label={copy.label}
        inputMode={optionKey === "risk" ? "decimal" : undefined}
        value={text}
        onChange={(e) => { setText(e.target.value); setError(""); }}
        onBlur={() => finish(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter") { e.preventDefault(); finish(true); }
          if (e.key === "Escape") { e.preventDefault(); finish(false); }
        }}
      />
      {error && <span className="text-xs text-loss">{error}</span>}
    </span>
  );
}
