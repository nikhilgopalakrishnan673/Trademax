# Trading Journal (React)

A trading journal with Home, Dashboard, Daily stats, Trade log, Support and Login pages.
Built with **React 19**, **Vite 8** and **Tailwind CSS 4**. There are no other runtime libraries.

The app starts **empty**. Every number on screen is worked out from trades you log yourself.
There is no demo data, sample trade or placeholder user anywhere in the code.

## Run it locally

You need Node.js 20.19 or newer (or 22.12+) and npm 10+.

```bash
npm install        # install the pinned dependencies
npm run dev        # dev server at http://localhost:5173 with live reload
npm run build      # production build into dist/
npm run preview    # serve the production build at http://localhost:4173
```

To deploy, upload `dist/` to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3).
URLs use the hash (`/#dashboard`), so the host needs no rewrite rules.

## Legal pages and footer

The footer is on every page except Login. `#terms-and-conditions` and `#privacy-policy` are draft templates that describe only what the app does today (everything stays in the browser). Highlighted `[placeholders]` mark details you must fill in (operator name, governing law, hosting provider). Have them reviewed by a legal professional before launch. Set `SUPPORT_EMAIL` in `src/config.js` to a real address and the footer's Contact link and the contact lines on both pages appear automatically.

## Folder structure

```
trading-journal/
├── public/favicon.svg
├── index.html                    HTML shell; loads src/main.jsx
├── src/
│   ├── main.jsx                  Entry: fonts, styles, <App/>
│   ├── App.jsx                   Providers, header, page for the current route
│   ├── config.js                 Support email (placeholder, replace it)
│   ├── assets/                   Logo and the flag emoji font (+ licence)
│   ├── styles/main.css           Tailwind theme tokens and shared classes
│   ├── pages/                    One component per page
│   │   ├── HomePage.jsx  DashboardPage.jsx  DailyStatsPage.jsx
│   │   ├── TradeLogPage.jsx  SupportPage.jsx  LoginPage.jsx
│   │   └── TermsPage.jsx  PrivacyPage.jsx

│   ├── components/
│   │   ├── layout/               Navbar, Brand, PageHeader
│   │   ├── dashboard/            StatCard, OpenPositions
│   │   ├── charts/               PnlCalendar, Ring, RatioBar
│   │   ├── trades/               TradeForm, TradeDetails, TradeTable, TradeCardList,
│   │   │                         PairFilter, PairPicker, OptionChips
│   │   └── common/               SidePanel, Field, EmptyState, Pill, Tags, PairLabel
│   ├── context/                  Shared state
│   │   ├── TradesContext.jsx     Trades + live statistics, add/edit/delete
│   │   ├── TradePanelContext.jsx Opens the log/edit/details panel from anywhere
│   │   ├── ProfileContext.jsx    Name and email from the login screen
│   │   └── ToastContext.jsx      Success and error messages
│   ├── hooks/                    useHashRoute, useCustomOptions, useEscapeKey
│   ├── services/                 Data access (the only code that touches storage)
│   │   ├── storage.js            Safe localStorage read/write
│   │   ├── tradeService.js       listTrades, createTrade, updateTrade, deleteTrade
│   │   ├── optionsService.js     Custom entry methods, confluences, risk levels
│   │   ├── profileService.js     Login name and email
│   │   └── supportService.js     Support messages (not delivered, see below)
│   ├── constants/                Pairs, journal options, quotes
│   └── utils/                    Pure functions: stats, validation, dates, formatting, flags
├── package.json  package-lock.json  vite.config.js  .gitignore
```

## How the pieces fit

- **Pages** read data from context hooks (`useTrades()`, `useProfile()`) and are built from small components that take props.
- **`TradesContext`** loads trades once through `tradeService`, keeps them in React state, and derives every statistic with `useMemo(summarize(trades))`.
  When you add, edit or delete a trade, it saves through the service first and updates state only if the save worked, so the screen never shows data that wasn't stored.
  Every page that shows numbers updates straight away.
- **`utils/stats.js`** holds all the calculations as plain functions (no React), so they're easy to test.
- **`utils/trade.js`** validates the trade form and cleans up stored records.
- **Routing** uses the URL hash (`#trade-log`) through a tiny hook, `useHashRoute`. No router library is needed for six pages.

## How trading data is stored

**Trades are saved in this browser's localStorage. This is not a database and there is no backend.**
Data stays after a refresh, but it doesn't sync between browsers or devices, and clearing site data deletes it.

| localStorage key | What it holds |
|---|---|
| `tj-trades-v1` | All trades, as a JSON array |
| `tj-custom` | Your custom entry methods, confluences and risk levels |
| `tj-profile` | Name and email from the login screen |
| `tj-support-outbox` | Support messages you submitted (they are not sent anywhere) |

A trade looks like this:

```js
{
  id, date: "2026-11-24", pair: "EUR/USD", type: "BUY" | "SELL",
  entryMethod, marketConditions: [], positiveConfluences: [], negativeConfluences: [],
  riskLevel: "1%", rrRatio: 2.5 | null, maxRr: 3 | null,
  result: "PROFIT" | "LOSS" | "BREAKEVEN" | "RUNNING", pnl: 240.5, notes,
  createdAt, updatedAt
}
```

Safety:

- If stored data can't be read (corrupted or edited by hand), the app keeps a backup under `tj-trades-v1-backup-<time>`, starts empty, and shows a message. It doesn't crash.
- Records with missing or wrong fields are skipped or repaired when loading.
- If the browser blocks storage or it's full, saving shows an error and nothing on screen changes.

### Moving to Express + MongoDB later

Only the files in `src/services/` touch storage. Every function there is already `async` and returns plain objects,
so you can replace their bodies with `fetch("/api/trades")` calls and leave every component as it is.
There's an example at the top of `tradeService.js`. Keep validation on the server too, because browser checks can be bypassed.

## Calculations

- **Running** trades are open positions. They're listed under Open positions and left out of every closed-trade figure.
- **Net P&L** is the sum of closed trades. Amounts are summed in cents to avoid rounding drift.
- **Profit factor** is total won ÷ total lost. It shows "—" until there is at least one loss.
- **Win % by trades** is wins ÷ closed trades. Breakeven trades count as not won.
- **Win % by days** is green days ÷ days with at least one closed trade.
- **Home** shows the current calendar month. "This week" starts on Monday. **Dashboard** and **Daily stats** cover all time.

## Validation in the trade form

- Pair must be one from the list; trade date is required and can't be in the future.
- P&L is required. Profit must be above 0, loss below 0, breakeven is saved as 0, and running can be any value. Two decimals at most.
- RR ratio and Max RR are optional, but must be numbers above 0 and up to 100.
- Custom risk levels must be a number above 0 and up to 100 (saved as "0.5%").
- Notes are limited to 2,000 characters.
- An identical trade (same date, pair, type, entry, result, P&L, RR and notes) can't be saved twice.

## What's not connected yet

| Feature | Current behaviour | To connect |
|---|---|---|
| Login | Remembers your name and email in this browser. It is **not** authentication. | Replace `profileService.js` and `LoginPage.jsx` with your auth provider. |
| Support form | Validates and saves the message in this browser. It is **not sent**, and the app says so. | Replace `submitSupportMessage` in `supportService.js` and set `SUPPORT_IS_CONNECTED = true`. |
| Support email | `support@yourjournal.app` is a placeholder. | Change it in `src/config.js`. |
| Quote of the day | Picked by date from a short built-in list. | Fetch from a quote API in `getQuoteOfTheDay` (keep any API key on a server). |

No API keys or credentials are in this project.

## Styling

Tailwind CSS v4 through the official Vite plugin; settings live in `src/styles/main.css` (there's no `tailwind.config.js`).
Palette: `#0B132B` background, `#1C2541` surfaces, `#3A506B` borders, `#5BC0BE` accent, profit `#34C98B`, loss `#F2696B`.
Always write Tailwind class names in full (`"pill-profit"`), never build them from pieces.

| Width | Layout |
|---|---|
| under 640px | Menu button, one column, trade cards, full-screen trade panel |
| 640px+ (`sm`) | Wider padding, two-column form rows |
| 768px+ (`md`) | Links in the header, 13-column trade table with the Pairs column pinned |
| 1024px+ (`lg`) | Two-column pages, five KPI tiles in a row |
| 1536px+ (`2xl`) | Content widens from 1180px to 1320px |

Fonts are self-hosted: Rubik from `@fontsource-variable/rubik`, and a flags-only subset of Noto Color Emoji (SIL Open Font License).
