// The trader's own entry methods, confluences and risk levels. Stored in this browser only.
// Uses the same key as the earlier version, so options added before still appear.
import { readJSON, writeJSON } from "./storage.js";

const OPTIONS_KEY = "tj-custom";
const EMPTY = { entry: [], pos: [], neg: [], risk: [] };

export function loadCustomOptions() {
  const { value } = readJSON(OPTIONS_KEY, null);
  const options = structuredClone(EMPTY);
  if (value && typeof value === "object") {
    for (const key of Object.keys(options)) {
      if (Array.isArray(value[key])) options[key] = value[key].filter((x) => typeof x === "string");
    }
  }
  return options;
}

export function saveCustomOptions(options) {
  writeJSON(OPTIONS_KEY, options);
}
