function isPastInterviewDate(isoDate) {
  if (!isoDate || typeof isoDate !== "string") return false;
  const d = new Date(`${isoDate.slice(0, 10)}T12:00:00`);
  if (Number.isNaN(d.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
}

function effectiveInterviewStatus(iv) {
  if (!iv) return "completed";
  if (iv.status === "completed") return "completed";
  if (iv.status === "scheduled" && isPastInterviewDate(iv.date)) return "completed";
  return iv.status || "scheduled";
}

function formatInterviewDisplayDate(isoDate) {
  if (!isoDate || typeof isoDate !== "string") return "";
  const d = new Date(`${isoDate.slice(0, 10)}T12:00:00`);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function UpcomingInterviews({ application }) {
  const interviews = application?.interviews || [];
  const upcoming = interviews.filter((i) => effectiveInterviewStatus(i) === "scheduled");

  return (
    <div className="rounded-xl bg-primary-container p-10 text-white md:col-span-5">
      <h4 className="mb-8 font-headline text-2xl font-bold">Upcoming Interviews</h4>
      {upcoming.length === 0 ? (
        <p className="text-sm leading-relaxed text-on-primary-container/80">No interviews scheduled yet.</p>
      ) : (
        <div className="space-y-8">
          {upcoming.map((iv, idx) => (
            <div key={iv.id || `iv-${idx}`} className="flex items-start gap-6">
              <div className="flex flex-col items-center">
                <div
                  className={
                    idx === 0
                      ? "h-3 w-3 rounded-full bg-tertiary-fixed shadow-[0_0_10px_#acedff]"
                      : "h-3 w-3 rounded-full bg-white/40"
                  }
                />
              </div>
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-tertiary-fixed">
                  {iv.title || iv.type || "Interview"}
                </p>
                <p className="mb-2 text-sm font-semibold text-white">
                  {[formatInterviewDisplayDate(iv.date), iv.time].filter(Boolean).join(", ") || "Date TBD"}
                </p>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/80">Status: Scheduled</p>
                {iv.link ? (
                  <a
                    href={iv.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-2 inline-block text-sm font-bold text-tertiary-fixed underline underline-offset-4 hover:text-white"
                  >
                    Join meeting
                  </a>
                ) : null}
                {iv.notes ? <p className="text-sm text-on-primary-container/80">{iv.notes}</p> : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
