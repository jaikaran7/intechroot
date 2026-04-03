import { Navigate } from "react-router-dom";
import { getApplicantSessionId } from "../applicantSession";

export default function ProtectedApplicant({ children }) {
  const id = getApplicantSessionId();
  if (id == null) {
    return <Navigate to="/applicant/login" replace />;
  }
  return children;
}
