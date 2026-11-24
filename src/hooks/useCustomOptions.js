// The trader's own entry methods, confluences and risk levels, kept in sync with storage.
import { useCallback, useState } from "react";
import { DEFAULT_OPTIONS } from "../constants/journalOptions.js";
import { loadCustomOptions, saveCustomOptions } from "../services/optionsService.js";

export function useCustomOptions() {
  const [custom, setCustom] = useState(loadCustomOptions);

  /** Defaults followed by the trader's own options. */
  const optionsFor = useCallback((key) => [...DEFAULT_OPTIONS[key], ...custom[key]], [custom]);

  /** Adds an option (or returns the existing one with the same name). Throws StorageError if saving fails. */
  const addOption = useCallback(
    (key, value) => {
      const existing = [...DEFAULT_OPTIONS[key], ...custom[key]].find((o) => o.toLowerCase() === value.toLowerCase());
      if (existing) return existing;
      const next = { ...custom, [key]: [...custom[key], value] };
      saveCustomOptions(next);
      setCustom(next);
      return value;
    },
    [custom],
  );

  const removeOption = useCallback(
    (key, value) => {
      const next = { ...custom, [key]: custom[key].filter((o) => o !== value) };
      saveCustomOptions(next);
      setCustom(next);
    },
    [custom],
  );

  const isCustom = useCallback((key, value) => custom[key].includes(value), [custom]);

  return { optionsFor, addOption, removeOption, isCustom };
}
