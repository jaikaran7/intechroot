/** Up to two-letter initials from a display name (no external image). */

export function initialsFromName(name) {
  if (!name || typeof name !== "string") return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const a = parts[0][0] || "";
    const b = parts[parts.length - 1][0] || "";
    return `${a}${b}`.toUpperCase() || "?";
  }
  if (parts[0].length >= 2) return parts[0].slice(0, 2).toUpperCase();
  return parts[0].charAt(0).toUpperCase();
}

const SIZE_CLASSES = {
  sm: "h-9 w-9 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-24 w-24 text-2xl md:text-3xl",
  /** e.g. compact profile cards */
  profile: "h-20 w-20 text-lg",
  hero: "h-32 w-32 text-3xl md:text-4xl",
};

/**
 * @param {{ name?: string | null, size?: 'sm'|'md'|'lg'|'xl'|'hero', rounded?: 'full'|'xl', className?: string, title?: string }} props
 */
export default function EntityAvatar({ name, size = "md", rounded = "full", className = "", title }) {
  const label = initialsFromName(name || "");
  const roundClass = rounded === "xl" ? "rounded-xl" : "rounded-full";
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const aria = title || (name ? `Avatar for ${name}` : "User avatar");
  return (
    <div
      role="img"
      aria-label={aria}
      title={title || (name ? String(name) : undefined)}
      className={`flex shrink-0 items-center justify-center bg-gradient-to-br from-slate-600 to-slate-800 font-bold text-white shadow-inner ${sizeClass} ${roundClass} ${className}`}
    >
      {label}
    </div>
  );
}
