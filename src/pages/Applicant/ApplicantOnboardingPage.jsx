import { Navigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../store/authStore";
import { onboardingService } from "../../services/onboarding.service";
import ProfileStep from "./onboardingSteps/ProfileStep";
import DocumentsStep from "./onboardingSteps/DocumentsStep";
import VerificationStep from "./onboardingSteps/VerificationStep";
import ReviewStep from "./onboardingSteps/ReviewStep";
import FinalizeStep from "./onboardingSteps/FinalizeStep";

/** Compute the highest step the applicant is allowed to navigate to. */
function computeMaxAllowed(ob) {
  if (!ob?.enabled) return 0;
  if (ob.finalSubmitted) return 5;
  if (ob.bgvApplicantAcknowledged) return 4;
  if (ob.documentsCompleted) return 3;
  if (ob.profileCompleted) return 2;
  return 1;
}

export default function ApplicantOnboardingPage() {
  const { step } = useParams();
  const stepNum = Math.max(1, Math.min(5, Number(step) || 1));
  const { applicationId } = useAuthStore();

  const { data: ob, isLoading } = useQuery({
    queryKey: ['onboarding', applicationId],
    queryFn: () => onboardingService.getState(applicationId),
    enabled: !!applicationId,
    staleTime: 30_000,
  });

  if (!applicationId) {
    return <Navigate to="/applicant/login" replace />;
  }

  if (isLoading || !ob) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6 font-body">
        <p className="text-on-surface-variant">Loading application…</p>
      </div>
    );
  }

  if (!ob.enabled) {
    return <Navigate to="/applicant/dashboard" replace />;
  }

  if (ob.application?.lifecycleStage === "employee") {
    return <Navigate to="/employee/dashboard" replace />;
  }

  const maxAllowed = computeMaxAllowed(ob);

  if (ob.finalSubmitted && stepNum !== 5) {
    return <Navigate to="/applicant/onboarding/5" replace />;
  }
  if (!ob.finalSubmitted && stepNum === 5) {
    return <Navigate to="/applicant/onboarding/4" replace />;
  }
  if (stepNum > maxAllowed) {
    return <Navigate to={`/applicant/onboarding/${maxAllowed}`} replace />;
  }

  const commonProps = { applicationId, onboarding: ob, maxAllowed };

  switch (stepNum) {
    case 1:
      return <ProfileStep {...commonProps} />;
    case 2:
      return <DocumentsStep {...commonProps} />;
    case 3:
      return <VerificationStep {...commonProps} />;
    case 4:
      return <ReviewStep {...commonProps} />;
    case 5:
      return <FinalizeStep {...commonProps} />;
    default:
      return <Navigate to="/applicant/onboarding/1" replace />;
  }
}
