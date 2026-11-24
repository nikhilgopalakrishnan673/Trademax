// The trader's name and email from the login screen. Stored in this browser only.
// Replace with your auth provider's user data once login is connected to a server.
import { readJSON, writeJSON } from "./storage.js";

const PROFILE_KEY = "tj-profile";

export function getProfile() {
  const { value } = readJSON(PROFILE_KEY, null);
  if (value && typeof value.name === "string" && typeof value.email === "string") return value;
  return null;
}

export function saveProfile(profile) {
  writeJSON(PROFILE_KEY, { name: profile.name.trim(), email: profile.email.trim() });
}

export function clearProfile() {
  try {
    localStorage.removeItem(PROFILE_KEY);
  } catch {
    // Storage blocked: there is nothing stored to clear.
  }
}
