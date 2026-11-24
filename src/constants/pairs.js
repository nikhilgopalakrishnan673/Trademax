// Every instrument the trade form offers, grouped as shown in the pair picker.
export const PAIR_GROUPS = {
  Majors: ["EUR/USD", "GBP/USD", "USD/JPY", "USD/CHF", "AUD/USD", "USD/CAD", "NZD/USD"],
  Crosses: [
    "EUR/GBP", "EUR/JPY", "EUR/CHF", "EUR/AUD", "EUR/CAD", "EUR/NZD", "GBP/JPY", "GBP/CHF", "GBP/AUD", "GBP/CAD", "GBP/NZD",
    "AUD/JPY", "AUD/CHF", "AUD/CAD", "AUD/NZD", "CAD/JPY", "CAD/CHF", "CHF/JPY", "NZD/JPY", "NZD/CHF", "NZD/CAD",
  ],
  Exotics: [
    "USD/SEK", "USD/NOK", "USD/DKK", "USD/PLN", "USD/HUF", "USD/CZK", "USD/TRY", "USD/ZAR", "USD/MXN", "USD/SGD", "USD/HKD",
    "USD/CNH", "USD/THB", "USD/ILS", "USD/INR", "USD/AED", "EUR/TRY", "EUR/SEK", "EUR/NOK", "EUR/PLN", "EUR/HUF", "EUR/ZAR",
    "GBP/ZAR", "GBP/SGD", "SGD/JPY", "ZAR/JPY", "MXN/JPY", "TRY/JPY",
  ],
  Metals: ["XAU/USD", "XAG/USD", "XAU/EUR"],
  "US indices": ["US30", "US500", "NAS100", "US2000"],
};

export const PAIRS = Object.values(PAIR_GROUPS).flat();

export const INDICES = {
  US30: "Dow Jones 30",
  US500: "S&P 500",
  NAS100: "Nasdaq 100",
  US2000: "Russell 2000",
};

// Approximate US dollars per one unit. Used only to decide which currency's flag a pair shows
// (the one worth more), so rough values are enough. These are not live rates.
export const USD_VALUE = {
  XAU: 2650, XAG: 31, GBP: 1.27, CHF: 1.13, EUR: 1.06, USD: 1, SGD: 0.74, CAD: 0.71, AUD: 0.65, NZD: 0.59,
  AED: 0.272, ILS: 0.27, PLN: 0.245, DKK: 0.142, CNH: 0.138, HKD: 0.128, SEK: 0.091, NOK: 0.09, ZAR: 0.055,
  MXN: 0.049, CZK: 0.042, THB: 0.029, TRY: 0.029, INR: 0.0118, JPY: 0.0065, HUF: 0.0026,
};

// Currency code to the two-letter country code its flag emoji is built from.
export const CURRENCY_COUNTRY = {
  USD: "US", EUR: "EU", GBP: "GB", JPY: "JP", CHF: "CH", CAD: "CA", AUD: "AU", NZD: "NZ", SEK: "SE", NOK: "NO",
  DKK: "DK", PLN: "PL", HUF: "HU", CZK: "CZ", TRY: "TR", ZAR: "ZA", MXN: "MX", SGD: "SG", HKD: "HK", CNH: "CN",
  THB: "TH", ILS: "IL", INR: "IN", AED: "AE",
};
