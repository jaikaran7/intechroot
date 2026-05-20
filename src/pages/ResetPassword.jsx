import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import CompanyContactBlock from "../components/CompanyContactBlock";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const role = params.get("role") || "employee";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const tokenValid = useMemo(() => token.trim().length > 0, [token]);

  const mutation = useMutation({
    mutationFn: (payload) => authService.resetPassword(payload),
    onSuccess: () => {
      setError("");
      setNotice("Password reset successfully. Redirecting to login…");
      window.setTimeout(() => navigate("/login", { replace: true }), 900);
    },
    onError: (err) => {
      setNotice("");
      setError(err?.response?.data?.error?.message || "Reset failed. Please request a new link.");
    },
  });

  return (
    <div className="bg-background font-body text-on-surface antialiased">
      <main className="forgot-password-page network-bg relative flex min-h-screen w-full flex-col items-center justify-center p-6">
        <div className="glass-panel z-10 w-full max-w-md rounded-xl p-10">
          <div className="mb-8">
            <h2 className="mb-2 font-headline text-2xl font-bold tracking-tight text-primary">Set New Password</h2>
            <p className="text-sm leading-relaxed text-on-surface-variant">
              Choose a strong password. This link is valid for 30 minutes.
            </p>
          </div>

          {!tokenValid ? (
            <p className="text-sm text-error">
              Invalid or missing token. Please{" "}
              <Link className="text-secondary underline" to="/forgot-password">
                request a new link
              </Link>
              .
            </p>
          ) : (
            <form
              action="#"
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                setError("");
                setNotice("");
                if (!password.trim() || password.trim().length < 8) {
                  setError("Password must be at least 8 characters.");
                  return;
                }
                if (password !== confirmPassword) {
                  setError("Passwords do not match.");
                  return;
                }
                mutation.mutate({ token, password, role });
              }}
            >
              <div className="space-y-2">
                <label className="font-label text-xs font-semibold uppercase tracking-widest text-on-primary-container">
                  New Password
                </label>
                <input
                  className="w-full border-0 border-b border-outline-variant bg-transparent px-0 py-3 text-primary transition-all placeholder:text-outline/40 focus:border-tertiary-fixed-dim focus:ring-0"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="font-label text-xs font-semibold uppercase tracking-widest text-on-primary-container">
                  Confirm Password
                </label>
                <input
                  className="w-full border-0 border-b border-outline-variant bg-transparent px-0 py-3 text-primary transition-all placeholder:text-outline/40 focus:border-tertiary-fixed-dim focus:ring-0"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {notice ? (
                <p className="text-sm text-on-surface-variant">{notice}</p>
              ) : null}
              {error ? <p className="text-sm text-error">{error}</p> : null}

              <div className="pt-2">
                <button
                  className="font-label flex w-full items-center justify-center gap-2 rounded-lg bg-primary-container py-4 text-sm font-bold tracking-wide text-on-primary shadow-lg transition-all hover:shadow-xl active:scale-95 disabled:opacity-60"
                  type="submit"
                  disabled={mutation.isPending}
                >
                  <span>{mutation.isPending ? "Resetting…" : "Reset Password"}</span>
                </button>
              </div>
            </form>
          )}

          <div className="mt-10 flex flex-col items-center gap-6">
            <Link className="group flex items-center gap-2 text-sm font-semibold text-secondary transition-colors hover:text-tertiary-fixed-dim" to="/login">
              <span className="material-symbols-outlined text-lg transition-transform group-hover:-translate-x-1">arrow_back</span>
              Back to Login
            </Link>
            <CompanyContactBlock className="text-center max-w-sm" linkClassName="hover:text-tertiary-fixed-dim transition-colors" />
          </div>
        </div>
      </main>
    </div>
  );
}

