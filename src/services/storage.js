// Thin wrapper around localStorage that never crashes the app.
// localStorage is temporary, browser-only storage: it lives on this device and browser only,
// can be cleared by the user, and holds roughly 5 MB. It is not a database.

export class StorageError extends Error {}

/** Reads and parses a JSON value. Returns { value, error }; value is `fallback` when missing or unreadable. */
export function readJSON(key, fallback) {
  let raw;
  try {
    raw = localStorage.getItem(key);
  } catch {
    return { value: fallback, error: "This browser is blocking storage, so nothing can be saved." };
  }
  if (raw === null) return { value: fallback, error: null };
  try {
    return { value: JSON.parse(raw), error: null, raw };
  } catch {
    return { value: fallback, error: "Saved data was damaged and could not be read.", raw };
  }
}

/** Saves a JSON value. Throws StorageError with a message the trader can act on. */
export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    const full = error?.name === "QuotaExceededError";
    throw new StorageError(
      full
        ? "Browser storage is full, so the change wasn't saved. Delete old trades or free up space and try again."
        : "This browser is blocking storage, so the change wasn't saved.",
    );
  }
}

/** Keeps a copy of unreadable data under a new key, so nothing is lost before it is replaced. */
export function backupRaw(key, raw) {
  try {
    localStorage.setItem(`${key}-backup-${Date.now()}`, raw);
  } catch {
    // Nothing more we can do; the original key is left untouched.
  }
}
