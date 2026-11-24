// Opens the side panel for logging, editing or viewing a trade from anywhere in the app.
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import TradeDetails from "../components/trades/TradeDetails.jsx";
import TradeForm from "../components/trades/TradeForm.jsx";

const TradePanelContext = createContext(null);

export function TradePanelProvider({ children }) {
  // null | { mode: "new", defaults } | { mode: "edit", tradeId } | { mode: "details", tradeId }
  const [panel, setPanel] = useState(null);

  const openNewTrade = useCallback((defaults = {}) => setPanel({ mode: "new", defaults }), []);
  const openEditTrade = useCallback((tradeId) => setPanel({ mode: "edit", tradeId }), []);
  const openTradeDetails = useCallback((tradeId) => setPanel({ mode: "details", tradeId }), []);
  const closePanel = useCallback(() => setPanel(null), []);

  const value = useMemo(
    () => ({ openNewTrade, openEditTrade, openTradeDetails, closePanel }),
    [openNewTrade, openEditTrade, openTradeDetails, closePanel],
  );

  return (
    <TradePanelContext.Provider value={value}>
      {children}
      {panel?.mode === "new" && <TradeForm key="new" defaults={panel.defaults} onClose={closePanel} />}
      {panel?.mode === "edit" && <TradeForm key={panel.tradeId} tradeId={panel.tradeId} onClose={closePanel} />}
      {panel?.mode === "details" && (
        <TradeDetails tradeId={panel.tradeId} onClose={closePanel} onEdit={() => openEditTrade(panel.tradeId)} />
      )}
    </TradePanelContext.Provider>
  );
}

export function useTradePanel() {
  const context = useContext(TradePanelContext);
  if (!context) throw new Error("useTradePanel must be used inside <TradePanelProvider>");
  return context;
}
