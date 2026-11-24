// Holds the trader's trades and the statistics calculated from them.
// Components read data with useTrades(); they never talk to storage directly.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as tradeService from "../services/tradeService.js";
import { summarize } from "../utils/stats.js";

const TradesContext = createContext(null);

export function TradesProvider({ children }) {
  const [trades, setTrades] = useState([]);
  const [status, setStatus] = useState("loading"); // "loading" | "ready"
  const [loadIssue, setLoadIssue] = useState(null);

  useEffect(() => {
    let cancelled = false;
    tradeService.listTrades().then(({ trades: stored, issue }) => {
      if (cancelled) return;
      setTrades(stored);
      setLoadIssue(issue);
      setStatus("ready");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Each action saves first and updates the screen only if saving worked,
  // so what you see always matches what is stored.
  const addTrade = useCallback(async (values) => {
    const trade = await tradeService.createTrade(values);
    setTrades((current) => [...current, trade]);
    return trade;
  }, []);

  const editTrade = useCallback(async (id, values) => {
    const trade = await tradeService.updateTrade(id, values);
    setTrades((current) => current.map((t) => (t.id === id ? trade : t)));
    return trade;
  }, []);

  const removeTrade = useCallback(async (id) => {
    await tradeService.deleteTrade(id);
    setTrades((current) => current.filter((t) => t.id !== id));
  }, []);

  const stats = useMemo(() => summarize(trades), [trades]);

  const value = useMemo(
    () => ({ trades, stats, status, loadIssue, addTrade, editTrade, removeTrade }),
    [trades, stats, status, loadIssue, addTrade, editTrade, removeTrade],
  );

  return <TradesContext.Provider value={value}>{children}</TradesContext.Provider>;
}

export function useTrades() {
  const context = useContext(TradesContext);
  if (!context) throw new Error("useTrades must be used inside <TradesProvider>");
  return context;
}
