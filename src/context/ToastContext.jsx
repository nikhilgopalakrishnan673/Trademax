// Short confirmation or error messages at the bottom of the screen.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const ToastContext = createContext(null);
const VISIBLE_MS = { success: 2200, error: 5000 };

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null); // { id, message, tone }

  const showToast = useCallback((message, tone = "success") => {
    setToast({ id: Date.now(), message, tone });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), VISIBLE_MS[toast.tone]);
    return () => clearTimeout(timer);
  }, [toast]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <div
          key={toast.id}
          role={toast.tone === "error" ? "alert" : "status"}
          className={`fixed bottom-[calc(24px+env(safe-area-inset-bottom,0px))] left-1/2 z-[60] max-w-[calc(100%-32px)] -translate-x-1/2 rounded-[10px] px-4 py-2.5 text-center font-semibold ${
            toast.tone === "error" ? "bg-loss text-bg" : "bg-fg text-bg"
          }`}
        >
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside <ToastProvider>");
  return context;
}
