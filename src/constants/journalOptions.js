// Choices in the trade form. They mirror the columns of the Notion "Trades Journal" database.
// These are form options, not trade data.
// Traders can add their own entry methods, confluences and risk levels on top of these defaults.

export const TRADE_TYPES = ["BUY", "SELL"];
export const RESULTS = ["PROFIT", "LOSS", "BREAKEVEN", "RUNNING"];
export const MARKET_CONDITIONS = ["Buy bias", "Sell bias"];

export const DEFAULT_OPTIONS = {
  entry: ["LIT", "OF", "DR", "OF+LIT", "QM"],
  pos: [
    "OF Connection", "Week high/low", "Month High/low", "Day High/Low", "Bunch Of Liquidity", "Third Wick To Body",
    "Major Liquidity Sweep", "Session Liquidity Sweep", "Inducement",
  ],
  neg: [
    "Week high/low", "Month High/low", "Day High/Low", "Unmittigated Order Block", "Consolidation", "News Pair",
    "Opposite direction in HTF",
  ],
  risk: ["DEMO", "1%", "2%"],
};

// Labels and placeholders for the "+ Custom …" buttons.
export const CUSTOM_OPTION_COPY = {
  entry: { label: "Custom method", placeholder: "e.g. Breaker block" },
  pos: { label: "Custom confluence", placeholder: "e.g. FVG fill" },
  neg: { label: "Custom confluence", placeholder: "e.g. Asia range" },
  risk: { label: "Custom risk %", placeholder: "e.g. 0.5" },
};
