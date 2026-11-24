// Support messages. No support backend or email service is connected yet, so messages are
// kept in this browser's storage and are NOT delivered to anyone.
// To connect one, replace the body of submitSupportMessage with a request to your server.
import { readJSON, writeJSON } from "./storage.js";

const OUTBOX_KEY = "tj-support-outbox";

export const SUPPORT_IS_CONNECTED = false;

export async function submitSupportMessage(message) {
  const { value } = readJSON(OUTBOX_KEY, []);
  const outbox = Array.isArray(value) ? value : [];
  writeJSON(OUTBOX_KEY, [...outbox, { ...message, savedAt: new Date().toISOString() }]);
}
