// App-wide settings. Nothing secret belongs here: this file ships to the browser.

// Placeholder address shown on the Support page. Replace it with your real support inbox.
export const SUPPORT_EMAIL = "support@yourjournal.app";

// The address the footer and the legal pages show as a way to contact you.
// It stays null while SUPPORT_EMAIL is the placeholder above, so no fake address is ever shown as a link.
const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(SUPPORT_EMAIL);
const isPlaceholder = SUPPORT_EMAIL.toLowerCase().endsWith("@yourjournal.app");
export const CONTACT_EMAIL = looksLikeEmail && !isPlaceholder ? SUPPORT_EMAIL : null;

// Shown at the top of the Terms and Privacy pages. Update it whenever you change either document.
export const LEGAL_LAST_UPDATED = "24 November 2026";
