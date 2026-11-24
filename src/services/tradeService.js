// Data access for trades. Every function is async and returns plain trade objects,
// so this file can be swapped for API calls (e.g. Express + MongoDB) without touching the UI:
//
//   export async function listTrades() {
//     const res = await fetch("/api/trades");
//     if (!res.ok) throw new Error("Couldn't load trades");
//     return { trades: await res.json(), issue: null };
//   }
//
// Today it stores everything in this browser's localStorage under one key.
import { normalizeStoredTrade } from "../utils/trade.js";
import { backupRaw, readJSON, writeJSON } from "./storage.js";

const TRADES_KEY = "tj-trades-v1";

const newId = () =>
  globalThis.crypto?.randomUUID?.() ?? `t-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

function readAll() {
  const { value, error, raw } = readJSON(TRADES_KEY, []);
  if (error && raw) backupRaw(TRADES_KEY, raw);
  if (!Array.isArray(value)) {
    if (raw) backupRaw(TRADES_KEY, raw);
    return { trades: [], issue: "Saved trades were in an unexpected format, so the journal started empty. A backup copy was kept." };
  }
  const trades = value.map(normalizeStoredTrade).filter(Boolean);
  const skipped = value.length - trades.length;
  const issue = error || (skipped ? `${skipped} damaged trade record${skipped === 1 ? " was" : "s were"} skipped.` : null);
  return { trades, issue };
}

/** @returns {Promise<{ trades: object[], issue: string|null }>} */
export async function listTrades() {
  return readAll();
}

/** Adds a trade. `values` must already be validated (see validateTradeForm). */
export async function createTrade(values) {
  const now = new Date().toISOString();
  const trade = { ...values, id: newId(), createdAt: now, updatedAt: now };
  const { trades } = readAll();
  writeJSON(TRADES_KEY, [...trades, trade]);
  return trade;
}

export async function updateTrade(id, values) {
  const { trades } = readAll();
  const existing = trades.find((t) => t.id === id);
  if (!existing) throw new Error("That trade no longer exists. It may have been deleted in another tab.");
  const updated = { ...existing, ...values, id, updatedAt: new Date().toISOString() };
  writeJSON(TRADES_KEY, trades.map((t) => (t.id === id ? updated : t)));
  return updated;
}

export async function deleteTrade(id) {
  const { trades } = readAll();
  writeJSON(TRADES_KEY, trades.filter((t) => t.id !== id));
}
