import { useCallback, useEffect, useMemo, useRef } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
  applicantAcknowledgeBgvStep,
  applicantMarkOnboardingProfileComplete,
  applicantSetOnboardingStep,
  applicantSubmitOnboardingFinal,
  getMaxAllowedApplicantOnboardingStep,
  useApplicationsSync,
} from "@/data/applicationsStore";
import { getApplicantSessionId } from "./applicantSession";
import { buildDocumentsTableSyncPayload } from "@/utils/applicantDocumentRows";

function onboardingFrameSrc(stepNum) {
  return `/onboarding/step${stepNum}/code.html`;
}

export default function ApplicantOnboardingPage() {
  const { step } = useParams();
  const stepNum = Math.max(1, Math.min(5, Number(step) || 1));
  const applicantId = getApplicantSessionId();
  const navigate = useNavigate();
  const { applications } = useApplicationsSync();

  const application = useMemo(
    () => (applicantId != null ? applications.find((a) => Number(a.id) === Number(applicantId)) ?? null : null),
    [applications, applicantId],
  );

  const ob = application?.onboarding;
  const maxAllowed = getMaxAllowedApplicantOnboardingStep(ob);
  const iframeRef = useRef(null);

  const syncIframeFromParent = useCallback(() => {
    const win = iframeRef.current?.contentWindow;
    if (!win || !application) return;
    if (stepNum === 2) {
      const docPayload = buildDocumentsTableSyncPayload(application);
      win.postMessage(
        {
          source: "intechroot-parent",
          type: "documents-full-sync",
          ...docPayload,
        },
        "*",
      );
      return;
    }
    if (stepNum === 3) {
      win.postMessage(
        {
          source: "intechroot-parent",
          type: "bgv-update",
          bgvLink: String(ob?.bgvLink || "").trim(),
          bgvNote: String(ob?.bgvNote || "").trim(),
          bgvRequests: application.adminBgvRequests || [],
        },
        "*",
      );
    }
  }, [stepNum, application, ob?.bgvLink, ob?.bgvNote]);

  useEffect(() => {
    syncIframeFromParent();
  }, [syncIframeFromParent]);

  const go = useCallback(
    (n) => {
      if (!application?.id) return;
      const next = Math.max(1, Math.min(5, Number(n) || 1));
      applicantSetOnboardingStep(application.id, next);
      navigate(`/applicant/onboarding/${next}`, { replace: true });
    },
    [application?.id, navigate],
  );

  const tryNext = useCallback(() => {
    const target = Math.min(stepNum + 1, maxAllowed);
    if (target > stepNum) go(target);
  }, [go, maxAllowed, stepNum]);

  const tryBack = useCallback(() => {
    go(Math.max(1, stepNum - 1));
  }, [go, stepNum]);

  const handleSubmitFinal = useCallback(() => {
    if (!application?.id || stepNum !== 4) return;
    applicantSubmitOnboardingFinal(application.id);
    go(5);
  }, [application?.id, go, stepNum]);

  const handleDashboard = useCallback(() => {
    navigate("/employee/dashboard");
  }, [navigate]);

  useEffect(() => {
    if (!application?.id || application.onboarding?.finalSubmitted) return;
    if (application.onboarding?.step !== stepNum) {
      applicantSetOnboardingStep(application.id, stepNum);
    }
  }, [application?.id, application?.onboarding?.finalSubmitted, application?.onboarding?.step, stepNum]);

  useEffect(() => {
    function onMessage(e) {
      const d = e.data;

      if (!d || d.source !== "intechroot-onboarding") return;
      if (d.action !== "continue") return;

      const appId = application?.id;
      if (!appId) return;

      console.log("STEP CLICKED:", d.step);

      if (d.step === 1) {
        applicantMarkOnboardingProfileComplete(appId);
        go(2);
        return;
      }

      if (d.step === 2) {
        go(3);
        return;
      }

      if (d.step === 3) {
        applicantAcknowledgeBgvStep(appId);
        go(4);
        return;
      }

      if (d.step === 4) {
        applicantSubmitOnboardingFinal(appId);
        go(5);
        return;
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [application?.id, go]);

  if (applicantId == null) {
    return <Navigate to="/applicant/login" replace />;
  }
  if (!application) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6 font-body">
        <p className="text-on-surface-variant">Loading application…</p>
      </div>
    );
  }

  if (!ob?.enabled) {
    return <Navigate to="/applicant/dashboard" replace />;
  }

  if (application.lifecycleStage === "employee" && application.employeeId) {
    return <Navigate to="/employee/dashboard" replace />;
  }

  if (ob.finalSubmitted && stepNum !== 5) {
    return <Navigate to="/applicant/onboarding/5" replace />;
  }

  if (!ob.finalSubmitted && stepNum === 5) {
    return <Navigate to="/applicant/onboarding/4" replace />;
  }

  if (stepNum > maxAllowed) {
    return <Navigate to={`/applicant/onboarding/${maxAllowed}`} replace />;
  }

  const canGoNext = stepNum < maxAllowed && stepNum < 4;
  const showSubmit = stepNum === 4 && !ob.finalSubmitted;

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col">
      <iframe
        ref={iframeRef}
        key={stepNum}
        title={`Onboarding step ${stepNum}`}
        src={onboardingFrameSrc(stepNum)}
        className="w-full flex-1 min-h-[70vh] border-0 bg-surface"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        onLoad={syncIframeFromParent}
      />
      <footer className="border-t border-outline-variant bg-surface-container-low px-4 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <p className="text-xs text-on-surface-variant">
          Step {stepNum} of 5 · Use your application status in the main app for document uploads and messages.
        </p>
        <div className="flex flex-wrap gap-2">
          {stepNum > 1 && (
            <button
              type="button"
              className="px-4 py-2 rounded-lg text-sm font-medium border border-outline bg-surface text-on-surface hover:bg-surface-container-high"
              onClick={tryBack}
            >
              Back
            </button>
          )}
          {canGoNext && (
            <button
              type="button"
              className="px-4 py-2 rounded-lg text-sm font-bold bg-primary-container text-on-primary"
              onClick={tryNext}
            >
              Next
            </button>
          )}
          {showSubmit && (
            <button
              type="button"
              className="px-4 py-2 rounded-lg text-sm font-bold bg-primary-container text-on-primary"
              onClick={handleSubmitFinal}
            >
              Submit for review
            </button>
          )}
          {stepNum === 5 && (
            <button
              type="button"
              className="px-4 py-2 rounded-lg text-sm font-bold bg-primary-container text-on-primary"
              onClick={handleDashboard}
            >
              Continue to employee portal
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
