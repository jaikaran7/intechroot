import { Fragment } from "react";
import { Link } from "react-router-dom";

const STEPS = [
  { num: 1, label: "Profile" },
  { num: 2, label: "Documents" },
  { num: 3, label: "Verification" },
  { num: 4, label: "Review" },
  { num: 5, label: "Finalize" },
];

/** Shared layout: header, 5-step progress tracker, and footer slot. */
export default function OnboardingShell({
  stepNum,
  maxAllowed,
  onNavigate,
  eyebrow,
  title,
  titleAccent,
  rightPill,
  children,
  footer,
}) {
  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col">
      <header className="border-b border-outline-variant/10 bg-white/60 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-8 py-5 flex items-center justify-between">
          <Link to="/applicant/dashboard" className="font-headline text-xl font-black tracking-tighter text-primary">
            INTECHROOT
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-secondary">
            Onboarding Portal
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-8 py-12">
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-secondary">{eyebrow}</p>
            <h1 className="mt-1 font-headline text-4xl font-extrabold tracking-tight text-primary">
              {title} {titleAccent ? <span className="text-secondary">{titleAccent}</span> : null}
            </h1>
          </div>
          {rightPill ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-800 text-xs font-bold">
              <span className="material-symbols-outlined text-base">verified_user</span>
              {rightPill}
            </div>
          ) : null}
        </div>

        <div className="mb-10">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {STEPS.map((s, i) => {
              const completed = s.num < stepNum;
              const current = s.num === stepNum;
              const canNav = s.num <= maxAllowed;
              const circleBase =
                "relative flex flex-col items-center z-10 transition-colors";
              return (
                <Fragment key={s.num}>
                  {i > 0 ? (
                    <div
                      className={`flex-1 h-0.5 mx-1 -mt-6 ${s.num <= stepNum ? "bg-primary" : "bg-slate-200"}`}
                    />
                  ) : null}
                  <button
                    type="button"
                    disabled={!canNav || s.num === stepNum}
                    onClick={() => canNav && onNavigate?.(s.num)}
                    className={`${circleBase} ${canNav ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
                    aria-current={current ? "step" : undefined}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-surface ${
                        completed
                          ? "bg-secondary text-white"
                          : current
                            ? "bg-primary text-white shadow-lg"
                            : "bg-surface-container text-on-surface-variant"
                      }`}
                    >
                      {completed ? (
                        <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                          check
                        </span>
                      ) : (
                        String(s.num).padStart(2, "0")
                      )}
                    </div>
                    <span
                      className={`mt-2 text-[10px] font-bold uppercase tracking-widest ${
                        current ? "text-primary" : completed ? "text-secondary" : "text-slate-400"
                      }`}
                    >
                      {s.label}
                    </span>
                  </button>
                </Fragment>
              );
            })}
          </div>
        </div>

        {children}

        {footer ? <div className="mt-10">{footer}</div> : null}
      </main>
    </div>
  );
}
