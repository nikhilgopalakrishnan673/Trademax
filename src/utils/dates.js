// Dates are stored as "YYYY-MM-DD" strings in the trader's local time zone.
import { QUOTES } from "../constants/quotes.js";

const pad = (n) => String(n).padStart(2, "0");

export const toISODate = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
export const todayISO = () => toISODate(new Date());
export const parseISODate = (iso) => new Date(iso + "T00:00:00");

export const formatShortDate = (iso) => parseISODate(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
export const formatWeekday = (iso) => parseISODate(iso).toLocaleDateString("en-US", { weekday: "long" });
export const formatLongDate = (iso) =>
  parseISODate(iso).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

export const formatMonth = (year, month) =>
  new Date(year, month - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });

/** Monday of the week containing `date`, as "YYYY-MM-DD". */
export function startOfWeekISO(date = new Date()) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const daysSinceMonday = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - daysSinceMonday);
  return toISODate(d);
}

export function greetingFor(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

/** Forex is closed on Saturday and most of Sunday. This is a simple weekday check, not a market-hours feed. */
export const marketStatus = (date = new Date()) => (date.getDay() === 0 || date.getDay() === 6 ? "markets closed" : "markets open");

/** A different quote each calendar day. Replace with an API call when you have one. */
export function getQuoteOfTheDay(date = new Date()) {
  const dayNumber = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 864e5);
  return QUOTES[dayNumber % QUOTES.length];
}
