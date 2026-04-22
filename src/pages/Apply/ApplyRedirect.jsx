import { Navigate, useLocation } from "react-router-dom";

export default function ApplyRedirect() {
  const { state } = useLocation();
  return <Navigate to={{ pathname: "/careers", hash: "#apply" }} state={state} replace />;
}
