import { CURRENCY_COUNTRY, INDICES, USD_VALUE } from "../constants/pairs.js";

const flagEmoji = (countryCode) =>
  String.fromCodePoint(...[...countryCode].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));

/** The currency in a pair that is worth more per unit, e.g. GBP for GBP/JPY, CHF for EUR/CHF. */
export function strongCurrency(pair) {
  const [base, quote] = pair.split("/");
  return (USD_VALUE[base] ?? 0) >= (USD_VALUE[quote] ?? 0) ? base : quote;
}

/**
 * What to show beside a pair: a flag emoji for the stronger currency,
 * the US flag for US indices, or a gold/silver coin for metals.
 * Returns { kind: "flag" | "metal" | null, ... } so the Flag component can render it.
 */
export function flagFor(pair) {
  if (INDICES[pair]) return { kind: "flag", emoji: flagEmoji("US"), label: INDICES[pair] };
  const currency = strongCurrency(pair);
  if (currency === "XAU") return { kind: "metal", metal: "gold" };
  if (currency === "XAG") return { kind: "metal", metal: "silver" };
  const country = CURRENCY_COUNTRY[currency];
  return country ? { kind: "flag", emoji: flagEmoji(country), label: currency } : { kind: null };
}
