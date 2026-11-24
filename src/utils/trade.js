// The shape of one trade, and the checks that keep stored records valid.
// Field names follow the Notion "Trades Journal" columns, plus pnl (dollar P&L) which the dashboard totals.
import { MARKET_CONDITIONS, RESULTS, TRADE_TYPES } from "../constants/journalOptions.js";
import { PAIRS } from "../constants/pairs.js";
import { todayISO } from "./dates.js";

export const MAX_ABS_PNL = 1_000_000_000;
export const MAX_RR = 100;
export const MAX_NOTES_LENGTH = 2000;

/** Empty form values for a new trade. */
export const emptyTradeForm = (overrides = {}) => ({
  pair: "XAU/USD",
  date: todayISO(),
  type: "BUY",
  entryMethod: "OF+LIT",
  marketConditions: [],
  positiveConfluences: [],
  negativeConfluences: [],
  riskLevel: "1%",
  rrRatio: "",
  maxRr: "",
  result: "RUNNING",
  pnl: "",
  notes: "",
  ...overrides,
});

/** Form values for editing an existing trade (numbers back to text). */
export const tradeToForm = (trade) => ({
  ...trade,
  rrRatio: trade.rrRatio ?? "",
  maxRr: trade.maxRr ?? "",
  pnl: String(trade.pnl),
});

/** Reads a number typed by the trader. Accepts "$1,200", "-100" and "−100". Returns NaN when it isn't a number. */
export function parseAmount(text) {
  const cleaned = String(text).trim().replace(/[$,\s]/g, "").replace("−", "-");
  if (cleaned === "" || !/^[+-]?\d*\.?\d+$/.test(cleaned)) return NaN;
  return Number(cleaned);
}

// Rejects impossible dates such as 2025-02-31, which JavaScript would otherwise roll over to March 3.
const isISODate = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};
const isStringList = (value) => Array.isArray(value) && value.every((x) => typeof x === "string");

/** Fields that identify a trade when checking for duplicates. */
const fingerprint = (t) =>
  [t.date, t.pair, t.type, t.entryMethod, t.result, t.pnl, t.rrRatio ?? "", t.notes.trim().toLowerCase()].join("|");

/**
 * Checks the form and turns it into a clean trade record.
 * @returns {{ errors: Record<string,string>, values?: object }} `values` is set only when there are no errors.
 */
export function validateTradeForm(form, { existingTrades = [], editingId = null } = {}) {
  const errors = {};

  if (!PAIRS.includes(form.pair)) errors.pair = "Choose a pair from the list.";

  if (!isISODate(form.date)) errors.date = "Enter the date of the trade.";
  else if (form.date > todayISO()) errors.date = "The trade date can't be in the future.";

  if (!TRADE_TYPES.includes(form.type)) errors.type = "Choose BUY or SELL.";
  if (!form.entryMethod) errors.entryMethod = "Choose an entry method.";
  if (!form.riskLevel) errors.riskLevel = "Choose a risk level.";
  if (!RESULTS.includes(form.result)) errors.result = "Choose a result.";

  const readRatio = (field, label) => {
    if (String(form[field]).trim() === "") return null;
    const value = parseAmount(form[field]);
    if (Number.isNaN(value) || value <= 0 || value > MAX_RR) {
      errors[field] = `${label} must be a number above 0 and up to ${MAX_RR}.`;
      return null;
    }
    return value;
  };
  const rrRatio = readRatio("rrRatio", "RR ratio");
  const maxRr = readRatio("maxRr", "Max RR");

  // Breakeven trades are always $0. A running trade's floating P&L is optional and is saved as $0 when left blank.
  let pnl = 0;
  const pnlLeftBlank = String(form.pnl ?? "").trim() === "";
  if (form.result !== "BREAKEVEN" && !(form.result === "RUNNING" && pnlLeftBlank)) {
    pnl = parseAmount(form.pnl);
    if (Number.isNaN(pnl)) errors.pnl = "Enter the P&L in dollars, e.g. 240 or -100.";
    else if (Math.abs(pnl) > MAX_ABS_PNL) errors.pnl = "That amount is too large. Check the number.";
    else if (/\.\d{3,}$/.test(String(form.pnl).trim())) errors.pnl = "Use at most 2 decimal places.";
    else if (form.result === "PROFIT" && pnl <= 0) errors.pnl = "A PROFIT trade needs a P&L above 0.";
    else if (form.result === "LOSS" && pnl >= 0) errors.pnl = "A LOSS trade needs a negative P&L, e.g. -100.";
  }

  const notes = String(form.notes || "").trim();
  if (notes.length > MAX_NOTES_LENGTH) errors.notes = `Keep notes under ${MAX_NOTES_LENGTH} characters.`;

  if (Object.keys(errors).length) return { errors };

  const values = {
    pair: form.pair,
    date: form.date,
    type: form.type,
    entryMethod: form.entryMethod,
    marketConditions: form.marketConditions.filter((c) => MARKET_CONDITIONS.includes(c)),
    positiveConfluences: [...form.positiveConfluences],
    negativeConfluences: [...form.negativeConfluences],
    riskLevel: form.riskLevel,
    rrRatio,
    maxRr,
    result: form.result,
    pnl,
    notes,
  };

  const duplicate = existingTrades.find((t) => t.id !== editingId && fingerprint(t) === fingerprint(values));
  if (duplicate) return { errors: { form: "You already logged this exact trade. Change a detail or open the existing one." } };

  return { errors: {}, values };
}

/**
 * Makes a record read from storage safe to use. Returns null for anything that isn't a valid trade,
 * so one damaged record can't break the whole journal.
 */
export function normalizeStoredTrade(raw) {
  if (!raw || typeof raw !== "object") return null;
  const { id, date, pair, type, result, pnl } = raw;
  if (typeof id !== "string" || !isISODate(date) || typeof pair !== "string") return null;
  if (!TRADE_TYPES.includes(type) || !RESULTS.includes(result)) return null;
  if (typeof pnl !== "number" || !Number.isFinite(pnl)) return null;

  const numberOrNull = (x) => (typeof x === "number" && Number.isFinite(x) ? x : null);
  return {
    id,
    date,
    pair,
    type,
    entryMethod: typeof raw.entryMethod === "string" ? raw.entryMethod : "",
    marketConditions: isStringList(raw.marketConditions) ? raw.marketConditions : [],
    positiveConfluences: isStringList(raw.positiveConfluences) ? raw.positiveConfluences : [],
    negativeConfluences: isStringList(raw.negativeConfluences) ? raw.negativeConfluences : [],
    riskLevel: typeof raw.riskLevel === "string" ? raw.riskLevel : "",
    rrRatio: numberOrNull(raw.rrRatio),
    maxRr: numberOrNull(raw.maxRr),
    result,
    pnl,
    notes: typeof raw.notes === "string" ? raw.notes : "",
    createdAt: typeof raw.createdAt === "string" ? raw.createdAt : new Date(0).toISOString(),
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : new Date(0).toISOString(),
  };
}
