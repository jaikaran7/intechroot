/** Partner / client logos shown in logo strips and trust sections. */
export const TRUSTED_CLIENTS = [
  { id: "procom", name: "Procom", logo: "/partner-logos/procom.png" },
  { id: "tcs", name: "TCS", logo: "/partner-logos/tcs.svg" },
  { id: "hcl", name: "HCL", logo: "/partner-logos/hcl.svg" },
  { id: "infosys", name: "Infosys", logo: "/partner-logos/infosys.svg" },
  { id: "tech-mahindra", name: "Tech Mahindra", logo: "/partner-logos/tech-mahindra.svg" },
  { id: "deloitte", name: "Deloitte", logo: "/partner-logos/deloitte.svg" },
  { id: "cgi", name: "CGI", logo: "/partner-logos/cgi.svg" },
  { id: "adecco", name: "Adecco", logo: "/partner-logos/adecco.svg" },
  { id: "si-systems", name: "S.i. Systems", logo: "/partner-logos/si-systems.svg" },
  { id: "robert-half", name: "Robert Half", logo: "/partner-logos/robert-half.png" },
];

/** Top row: 1 → 10 (left to right on scroll down / auto-idle). */
export const TRUSTED_CLIENTS_ROW_TOP = [...TRUSTED_CLIENTS];

/** Bottom row: 10 → 1 (opposite order; staggered so logos don’t align with top). */
export const TRUSTED_CLIENTS_ROW_BOTTOM = [...TRUSTED_CLIENTS].reverse();

/** Subset for compact 2×2 logo grids (e.g. Services testimonials). */
export const TRUSTED_CLIENTS_COMPACT = TRUSTED_CLIENTS.filter((client) =>
  ["cgi", "adecco", "si-systems", "robert-half"].includes(client.id),
);
