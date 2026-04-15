/** Centralized constants for ChatSNP frontend. */

// ── Request Timeouts ────────────────────────────────────────────────────
/** Default timeout for backend API calls (ms). */
export const REQUEST_TIMEOUT_MS = 30_000;

/** Extended timeout for file uploads (ms). */
export const UPLOAD_TIMEOUT_MS = 120_000;

// ── Time ────────────────────────────────────────────────────────────────
/** Milliseconds in one day — used for date grouping in sidebar. */
export const MS_PER_DAY = 86_400_000;

// ── Chat ────────────────────────────────────────────────────────────────
/** Maximum number of messages to load per session page. */
export const DEFAULT_MESSAGE_LIMIT = 100;
