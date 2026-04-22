/** Ensure a URL opens in the browser (add https if host-only). */
export function normalizeExternalHref(raw) {
  const s = (raw || "").trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  return `https://${s.replace(/^\/+/, "")}`;
}

/** Short label for LinkedIn / portfolio links in compact UI. */
export function compactUrlLabel(url) {
  const s = (url || "").trim();
  if (!s) return "";
  try {
    const u = new URL(normalizeExternalHref(s));
    return (u.hostname + u.pathname).replace(/\/$/, "").slice(0, 48) || u.href;
  } catch {
    return s.slice(0, 48);
  }
}

export function formatAppliedDateDisplay(value) {
  if (value == null || value === "") return "—";
  const d = new Date(value);
  if (!Number.isNaN(d.getTime())) {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }
  return String(value);
}
