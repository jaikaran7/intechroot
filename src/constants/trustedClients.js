/** Partner / client names shown in logo strips and trust sections. */
export const TRUSTED_CLIENTS = [
  "Procom",
  "TCS",
  "HCL",
  "Infosys",
  "Tech Mahindra",
  "Deloitte",
  "CGI",
  "Adecco",
  "S.i. Systems",
  "Robert Half",
];

/** Top row: 1 → 10 (left to right on scroll down / auto-idle). */
export const TRUSTED_CLIENTS_ROW_TOP = [...TRUSTED_CLIENTS];

/** Bottom row: 10 → 1 (opposite order; staggered so names don’t align with top). */
export const TRUSTED_CLIENTS_ROW_BOTTOM = [...TRUSTED_CLIENTS].reverse();

/** Subset for compact 2×2 logo grids (e.g. Services testimonials). */
export const TRUSTED_CLIENTS_COMPACT = ["CGI", "Adecco", "S.i. Systems", "Robert Half"];
