import { Navigate } from "react-router-dom";

/** Legacy URL: onboarding is now a single-route wizard. */
export default function OnboardingReview() {
  return <Navigate to="/admin/employees/onboarding" replace />;
}
