/** Map Prisma/API job fields to careers list & featured card UI. */

const ICON_KEYS = [
  [/design|ux|ui/i, "palette"],
  [/devops|infra|cloud|platform/i, "dns"],
  [/data|ai|ml|analytics/i, "analytics"],
  [/security|cyber/i, "shield"],
  [/frontend|react|web/i, "web"],
  [/backend|api|java|node/i, "terminal"],
  [/product|pm/i, "assignment"],
  [/engineer/i, "precision_manufacturing"],
];

export function iconForJob(job) {
  const hay = `${job.sector || ""} ${job.category || ""} ${job.title || ""}`.toLowerCase();
  for (const [re, icon] of ICON_KEYS) {
    if (re.test(hay)) return icon;
  }
  return "work";
}

export function formatPostedDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return "";
  }
}

export function badgeClassForStatus(status) {
  if (status === "Active") return "bg-emerald-500/15 text-emerald-800 ring-1 ring-emerald-500/20";
  if (status === "Closed") return "bg-red-500/10 text-red-700 ring-1 ring-red-500/15";
  if (status === "Draft") return "bg-amber-500/10 text-amber-900 ring-1 ring-amber-500/20";
  return "bg-surface-container-high text-on-surface-variant";
}

export function categoryPillClass() {
  return "bg-primary-container/10 text-primary ring-1 ring-primary-container/15";
}

export function presentJobForCareersList(job) {
  const icon = iconForJob(job);
  const categoryLabel = ((job.category || "").trim() || (job.sector || "").trim() || "Role").toUpperCase();
  const statusLabel = (job.status || "Active").toUpperCase();
  const statusClass = badgeClassForStatus(job.status);
  const categoryClass = categoryPillClass();

  const meta = [];
  const metaIcons = [];

  if (job.location) {
    meta.push(job.location);
    metaIcons.push("location_on");
  }

  if ((job.category || "").trim()) {
    meta.push(job.category.trim());
    metaIcons.push("category");
  } else if ((job.sector || "").trim()) {
    meta.push(job.sector.trim());
    metaIcons.push("layers");
  }

  const salary = (job.salary || "").trim();
  meta.push(salary || "—");
  metaIcons.push("payments");

  const experienceLine = [job.experience || job.seniority, job.jobType || job.type].filter(Boolean).join(" · ");
  if (experienceLine) {
    meta.push(experienceLine);
    metaIcons.push("schedule");
  }

  const posted = formatPostedDate(job.postedDate);

  return {
    ...job,
    icon,
    categoryLabel,
    categoryClass,
    statusLabel,
    statusClass,
    meta,
    metaIcons,
    listTitle: job.title,
    listSubtitle: posted ? `Posted ${posted}` : null,
  };
}

export function presentJobForFeatured(job, idx) {
  const icon = iconForJob(job);
  let tags = (Array.isArray(job.skills) ? job.skills : []).filter(Boolean).slice(0, 4);
  if (!tags.length && job.sector) tags = [job.sector];
  const badgeText = job.status === "Active" ? "LIVE" : job.status === "Closed" ? "Closed" : "Draft";
  const badgeClass =
    job.status === "Active"
      ? "bg-emerald-500/15 text-emerald-800"
      : job.status === "Closed"
        ? "bg-red-500/10 text-red-700"
        : "bg-amber-500/10 text-amber-900";

  const buttonClasses = [
    "w-full py-5 bg-secondary text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-primary transition-all duration-500 shadow-xl",
    "w-full py-5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-secondary transition-all duration-500 shadow-xl",
    "w-full py-5 bg-tertiary-fixed text-primary text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-white transition-all duration-500 shadow-xl",
  ];

  return {
    id: job.id,
    title: job.title,
    location: job.location || "Location TBD",
    tags,
    icon,
    badgeText,
    badgeClass,
    buttonClass: buttonClasses[idx % buttonClasses.length],
    titleHover: idx % 3 === 0 ? "group-hover:text-secondary" : idx % 3 === 1 ? "group-hover:text-tertiary-fixed" : "group-hover:text-primary",
    experience: job.experience || "",
  };
}
