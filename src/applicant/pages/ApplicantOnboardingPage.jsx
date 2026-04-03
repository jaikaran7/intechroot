import { useCallback, useEffect, useMemo } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Step1 from "../onboarding/Step1";
import Step2 from "../onboarding/Step2";
import Step3 from "../onboarding/Step3";
import Step4 from "../onboarding/Step4";
import Step5 from "../onboarding/Step5";
import {
  ONBOARDING_REQUIRE_COMPLETE_DOCUMENTS,
  applicantSetOnboardingStep,
  applicantSubmitOnboardingFinal,
  useApplicationsSync,
} from "../../data/applicationsStore";
import { getApplicantSessionId } from "../applicantSession";

function getMaxAllowedOnboardingStep(onboarding) {
  const ob = onboarding || {};
  if (!ob.profileCompleted) return 1;
  if (ONBOARDING_REQUIRE_COMPLETE_DOCUMENTS && !ob.documentsCompleted) return 2;
  if (!ob.bgvCompleted) return 3;
  if (!ob.finalSubmitted) return 4;
  return 5;
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
  const maxAllowed = getMaxAllowedOnboardingStep(ob);

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

  return (
    <div className="bg-surface font-body text-on-surface selection:bg-tertiary-fixed-dim/30 min-h-screen">
      {stepNum === 1 && (
        <Step1 onNext={tryNext} onDashboard={handleDashboard} application={application} />
      )}
      {stepNum === 2 && <Step2 onNext={tryNext} onBack={tryBack} />}
      {stepNum === 3 && (
        <Step3
          onNext={tryNext}
          onBack={tryBack}
          bgvLink={ob.bgvLink}
          canProceedToReview={Boolean(ob.bgvCompleted)}
        />
      )}
      {stepNum === 4 && (
        <Step4 onBack={tryBack} onSubmitFinal={handleSubmitFinal} application={application} />
      )}
      {stepNum === 5 && <Step5 onDashboard={handleDashboard} application={application} />}
    </div>
  );
}
