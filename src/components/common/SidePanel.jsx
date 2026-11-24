// Panel that slides over the page from the right: full screen on phones, 480px wide from 640px up.
// Used by the trade form and the trade details view.
import { useEffect } from "react";
import { useEscapeKey } from "../../hooks/useEscapeKey.js";

export default function SidePanel({ title, onClose, children, footer }) {
  useEscapeKey(onClose);

  // Stop the page behind from scrolling while the panel is open.
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, []);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-fg/40" onClick={onClose} aria-hidden="true" />
      <aside
        className="fixed inset-y-0 right-0 z-50 flex h-dvh w-full flex-col border-l border-line bg-surface pt-[env(safe-area-inset-top,0px)] pr-[env(safe-area-inset-right,0px)] pb-[env(safe-area-inset-bottom,0px)] sm:max-w-[480px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="panel-title"
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3.5 sm:px-[22px] sm:py-[18px]">
          <h2 id="panel-title" className="text-base">{title}</h2>
          <button className="btn size-10 px-0" type="button" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="flex flex-1 flex-col gap-[18px] overflow-y-auto overscroll-contain px-4 py-5 sm:px-[22px]">{children}</div>
        {footer && <div className="flex gap-2.5 border-t border-line px-4 py-3.5 sm:justify-end sm:px-[22px]">{footer}</div>}
      </aside>
    </>
  );
}
