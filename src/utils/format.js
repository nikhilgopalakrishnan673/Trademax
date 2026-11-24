// Display formatting. React escapes text automatically, so these return plain strings.

/** +$1,234 / −$100 / $0. Pass sign=false to drop the plus sign. Cents are shown only when present. */
export function formatMoney(amount, { sign = true } = {}) {
  const prefix = sign && amount > 0 ? "+" : amount < 0 ? "−" : "";
  const abs = Math.abs(amount);
  const decimals = Number.isInteger(abs) ? 0 : 2;
  return prefix + "$" + abs.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: 2 });
}

/** Short form for tight spaces such as calendar cells on phones: +180, −1.2k */
export function formatCompact(amount) {
  const prefix = amount > 0 ? "+" : amount < 0 ? "−" : "";
  const abs = Math.abs(amount);
  return prefix + (abs >= 1000 ? (abs / 1000).toFixed(1).replace(/\.0$/, "") + "k" : Math.round(abs));
}

/** Text colour class for a profit or loss figure. */
export const pnlClass = (amount) => (amount > 0 ? "text-profit" : amount < 0 ? "text-loss" : "");

export const formatPercent = (value) => `${Math.round(value)}%`;

/** "—" when a value can't be shown, e.g. an RR the trader left blank. */
export const orDash = (value) => (value === null || value === undefined || value === "" ? "—" : value);

export const plural = (count, word) => `${count} ${word}${count === 1 ? "" : "s"}`;
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
