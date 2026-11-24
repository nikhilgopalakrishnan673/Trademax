// App shell: shared state providers, the header, and the page for the current URL hash.
import { useEffect } from "react";
import Footer from "./components/layout/Footer.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import { ProfileProvider } from "./context/ProfileContext.jsx";
import { ToastProvider, useToast } from "./context/ToastContext.jsx";
import { TradePanelProvider } from "./context/TradePanelContext.jsx";
import { TradesProvider, useTrades } from "./context/TradesContext.jsx";
import { useHashRoute } from "./hooks/useHashRoute.js";
import DailyStatsPage from "./pages/DailyStatsPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import PrivacyPage from "./pages/PrivacyPage.jsx";
import SupportPage from "./pages/SupportPage.jsx";
import TermsPage from "./pages/TermsPage.jsx";
import TradeLogPage from "./pages/TradeLogPage.jsx";

const PAGES = {
  home: HomePage,
  dashboard: DashboardPage,
  "daily-stats": DailyStatsPage,
  "trade-log": TradeLogPage,
  support: SupportPage,
  login: LoginPage,
  "terms-and-conditions": TermsPage,
  "privacy-policy": PrivacyPage,
};

function Layout() {
  const hash = useHashRoute();
  const route = PAGES[hash] ? hash : "home";
  const Page = PAGES[route];
  const { loadIssue } = useTrades();
  const { showToast } = useToast();

  // Tell the trader once if saved trades couldn't be read (e.g. corrupted storage).
  useEffect(() => {
    if (loadIssue) showToast(loadIssue, "error");
  }, [loadIssue, showToast]);

  // Start each page at the top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);

  return (
    <div className="flex min-h-dvh flex-col">
      {route !== "login" && <Navbar route={route} />}
      <main className="gutter mx-auto w-full max-w-page flex-1 pt-6 pb-16 sm:pt-8 2xl:max-w-page-wide">
        <Page />
      </main>
      {route !== "login" && <Footer route={route} />}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <ProfileProvider>
        <TradesProvider>
          <TradePanelProvider>
            <Layout />
          </TradePanelProvider>
        </TradesProvider>
      </ProfileProvider>
    </ToastProvider>
  );
}
