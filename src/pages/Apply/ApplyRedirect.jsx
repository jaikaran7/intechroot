import { Navigate, useLocation } from "react-router-dom";

export default function ApplyRedirect() {
  const { search, state } = useLocation();
  return <Navigate to={{ pathname: "/careers", search, hash: "#apply" }} state={state} replace />;
}
