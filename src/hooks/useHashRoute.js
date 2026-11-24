// Tiny hash router: "#trade-log" → "trade-log". Hash URLs work on any static host with no server setup.
import { useSyncExternalStore } from "react";

function subscribe(onChange) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

const getHash = () => window.location.hash.slice(1);

export function useHashRoute() {
  return useSyncExternalStore(subscribe, getHash);
}

export function navigate(route) {
  window.location.hash = route;
}
