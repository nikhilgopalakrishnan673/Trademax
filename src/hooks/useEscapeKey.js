import { useEffect } from "react";

/** Calls `onEscape` when Esc is pressed, while `active` is true. */
export function useEscapeKey(onEscape, active = true) {
  useEffect(() => {
    if (!active) return;
    const handleKey = (event) => {
      if (event.key === "Escape" && !event.defaultPrevented) onEscape(event);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onEscape, active]);
}
