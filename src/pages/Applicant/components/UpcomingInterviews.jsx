import { useState } from "react";

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

function readOnlyFieldClass() {
  return "w-full rounded-lg border border-slate-200 bg-slate-50/80 px-2.5 py-2 text-sm text-primary";
}

export default function UpcomingInterviews({ application, applicationId }) {
  const interviews = application?.interviews || [];
  const upcoming = interviews.filter((i) => effectiveInterviewStatus(i) === "scheduled");
  const [detailInterview, setDetailInterview] = useState(null);

  const closeDetail = () => {
    setDetailInterview(null);
  };

  return (
    <>
      <div className="flex max-h-[min(30rem,72vh)] w-full flex-col rounded-xl bg-primary-container p-8 text-white md:col-span-5 md:self-start md:max-h-[28rem]">
        <h4 className="mb-6 shrink-0 font-headline text-2xl font-bold">Upcoming Interviews</h4>
        {upcoming.length === 0 ? (
          <p className="text-sm leading-relaxed text-on-primary-container/80">
            No interviews scheduled yet.
          </p>
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-1 [-webkit-overflow-scrolling:touch]">
            <div className="space-y-8 pb-1">
              {upcoming.map((iv, idx) => (
                <div
                  key={iv.id || `iv-${idx}`}
                  role="button"
                  tabIndex={0}
                  title="View interview details"
                  onClick={() => {
                    if (!applicationId) return;
                    setDetailInterview(iv);
                  }}
                  onKeyDown={(e) => {
                    if (!applicationId) return;
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setDetailInterview(iv);
                    }
                  }}
                  className={`flex items-start gap-6 rounded-lg outline-none ring-white/0 transition-opacity focus-visible:ring-2 focus-visible:ring-tertiary-fixed ${
                    applicationId ? "cursor-pointer hover:opacity-95" : "cursor-default"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={
                        idx === 0
                          ? "h-3 w-3 rounded-full bg-tertiary-fixed shadow-[0_0_10px_#acedff]"
                          : "h-3 w-3 rounded-full bg-white/40"
                      }
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="mb-1 text-xs font-bold uppercase tracking-widest text-tertiary-fixed">
                      {iv.title || iv.type || "Interview"}
                    </p>
                    <p className="mb-2 text-sm font-semibold text-white">
                      {[formatInterviewDisplayDate(iv.date), iv.time].filter(Boolean).join(", ") || "Date TBD"}
                    </p>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/80">
                      Status: Scheduled
                    </p>
                    {iv.link ? (
                      <a
                        href={iv.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mb-2 inline-block text-sm font-bold text-tertiary-fixed underline underline-offset-4 hover:text-white"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Join meeting
                      </a>
                    ) : null}
                    {iv.notes ? (
                      <p className="break-words text-sm text-on-primary-container/80">{iv.notes}</p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {detailInterview && applicationId ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000615]/30 backdrop-blur-md">
          <div className="glass-card w-[min(92vw,32rem)] rounded-xl border border-white/20 p-6 shadow-2xl">
            <h4 className="mb-3 text-lg font-bold text-primary">Interview details</h4>
            <div className="space-y-3 text-sm">
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-outline">Interview type</p>
                <div className={readOnlyFieldClass()}>{detailInterview.title || detailInterview.type || "—"}</div>
              </div>
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-outline">Date</p>
                <div className={readOnlyFieldClass()}>
                  {formatInterviewDisplayDate(detailInterview.date) || "—"}
                </div>
              </div>
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-outline">Time</p>
                <div className={readOnlyFieldClass()}>{detailInterview.time || "—"}</div>
              </div>
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-outline">Meeting link</p>
                <div className={`${readOnlyFieldClass()} break-all`}>
                  {detailInterview.link ? (
                    <a
                      className="text-secondary underline"
                      href={detailInterview.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {detailInterview.link}
                    </a>
                  ) : (
                    "—"
                  )}
                </div>
              </div>
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-outline">Notes</p>
                <div className={`${readOnlyFieldClass()} max-h-28 overflow-y-auto whitespace-pre-wrap break-words`}>
                  {detailInterview.notes?.trim() ? detailInterview.notes : "—"}
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold"
                onClick={closeDetail}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
