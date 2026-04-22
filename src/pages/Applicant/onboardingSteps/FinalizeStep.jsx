import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingShell from "./OnboardingShell";

export default function FinalizeStep({ applicationId, onboarding, maxAllowed }) {
  const navigate = useNavigate();
  const app = onboarding?.application || {};

  const appIdDisplay = useMemo(() => {
    if (typeof app.id === "number") return `#ITH-${String(app.id).padStart(3, "0")}-${Math.abs(app.id % 9999).toString(16).toUpperCase().padStart(4, "0")}`;
    return applicationId ? `#${String(applicationId).slice(0, 16).toUpperCase()}` : "—";
  }, [app.id, applicationId]);

  return (
    <OnboardingShell
      stepNum={5}
      maxAllowed={maxAllowed}
      onNavigate={(n) => navigate(`/applicant/onboarding/${n}`)}
      eyebrow="Step 05 — Process Complete"
      title="Submission"
      titleAccent="Successful"
      rightPill="Bank-Grade Encryption"
    >
      <div className="rounded-2xl border border-outline-variant/10 bg-white p-10 shadow-sm text-center">
        <div className="mx-auto w-20 h-20 rounded-2xl bg-primary-container text-white flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
        </div>
        <h2 className="font-headline text-2xl font-extrabold text-primary">Onboarding Submitted Successfully</h2>
        <p className="mt-3 text-sm text-on-surface-variant max-w-xl mx-auto leading-relaxed">
          Your onboarding is under review. Please wait for admin approval. We have sent a confirmation email to your
          registered address with the next steps of your integration process.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/applicant/dashboard")}
            className="px-6 py-3 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow hover:opacity-95 active:scale-95 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-outline-variant/10 bg-white px-6 py-4 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Application ID</p>
          <p className="mt-1 text-sm font-bold text-primary">{appIdDisplay}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Review Status</p>
          <p className="mt-1 text-sm font-bold text-amber-700 inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> Pending Admin Approval
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Est. Response Time</p>
          <p className="mt-1 text-sm font-bold text-primary">24–48 Business Hours</p>
        </div>
      </div>
    </OnboardingShell>
  );
}
