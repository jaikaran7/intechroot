function normalizeVerificationForBadge(raw) {
  if (raw == null) return null;
  if (["unapproved", "waiting", "verified", "rejected"].includes(raw)) return raw;
  if (raw === "Verified") return "verified";
  if (raw === "Rejected") return "rejected";
  if (raw === "Waiting for Verification") return "waiting";
  if (raw === "Unapproved") return "unapproved";
  return null;
}

export function uploadStatusBadge(status) {
  switch (status) {
    case "not_uploaded":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold uppercase text-red-700">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span> Not Uploaded
        </span>
      );
    case "uploaded":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold uppercase text-green-700">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span> Uploaded
        </span>
      );
    case "expiring_soon":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-2.5 py-1 text-[10px] font-bold uppercase text-yellow-700">
          <span className="h-1.5 w-1.5 rounded-full bg-yellow-500"></span> Expiring Soon
        </span>
      );
    case "expired":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold uppercase text-red-700">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span> Expired
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-highest px-2.5 py-1 text-[10px] font-bold uppercase text-on-surface-variant">
          <span className="h-1.5 w-1.5 rounded-full bg-outline-variant"></span> Not Uploaded
        </span>
      );
  }
}

export function onboardingVerificationBadge(raw) {
  const key = normalizeVerificationForBadge(raw);
  if (key === "verified") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold uppercase text-green-700">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span> Verified
      </span>
    );
  }
  if (key === "rejected") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold uppercase text-red-700">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span> Rejected
      </span>
    );
  }
  if (key === "waiting") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-2.5 py-1 text-[10px] font-bold uppercase text-yellow-700">
        <span className="h-1.5 w-1.5 rounded-full bg-yellow-500"></span> Waiting for Verification
      </span>
    );
  }
  if (key === "unapproved") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase text-slate-600">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span> Unapproved
      </span>
    );
  }
  return <span className="text-xs text-on-surface-variant">—</span>;
}
