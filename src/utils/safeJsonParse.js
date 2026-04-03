/**
 * Parse JSON from storage without throwing; never pass raw null/undefined to JSON.parse.
 * @template T
 * @param {string | null | undefined} raw
 * @param {T} fallback
 * @returns {T}
 */
export function safeJsonParse(raw, fallback) {
  if (raw == null || raw === "") return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
