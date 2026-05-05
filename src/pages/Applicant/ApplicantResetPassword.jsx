import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";

export default function ApplicantResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token") || "";

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
      window.setTimeout(() => navigate("/applicant/login", { replace: true }), 900);
    },
    onError: (err) => {
      setNotice("");
      setError(err?.response?.data?.error?.message || "Reset failed. Please request a new link.");
    },
  });

  return (
    <div className="min-h-screen bg-surface px-6 py-24 font-body text-on-surface">
      <div className="mx-auto max-w-md">
        <Link to="/" className="mb-8 inline-block font-headline text-xl font-black text-primary">
          INTECHROOT
        </Link>
        <h1 className="mb-2 font-headline text-2xl font-bold text-primary">Set a new password</h1>
        <p className="mb-6 text-sm text-on-surface-variant">
          Choose a strong password. This link is valid for 30 minutes.
        </p>

        {!tokenValid ? (
          <div className="rounded-lg border border-outline-variant/20 bg-surface-container-low/80 p-4 text-sm text-on-surface-variant">
            Invalid or missing reset token. Please{" "}
            <Link className="text-secondary underline" to="/applicant/forgot-password">
              request a new reset link
            </Link>
            .
          </div>
        ) : (
          <form
            className="space-y-4"
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
              mutation.mutate({ token, password, role: "applicant" });
            }}
          >
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                New password
              </label>
              <input
                className="w-full rounded-lg border border-outline-variant/30 bg-white px-4 py-3 text-sm"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Confirm password
              </label>
              <input
                className="w-full rounded-lg border border-outline-variant/30 bg-white px-4 py-3 text-sm"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(ev) => setConfirmPassword(ev.target.value)}
              />
            </div>

            {notice ? (
              <p className="rounded-lg border border-outline-variant/20 bg-surface-container-low/80 p-4 text-sm text-on-surface-variant">
                {notice}
              </p>
            ) : null}
            {error ? <p className="text-sm text-error">{error}</p> : null}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full rounded-lg bg-primary-container py-3 text-sm font-bold text-white shadow-lg transition-transform active:scale-[0.99] disabled:opacity-60"
            >
              {mutation.isPending ? "Resetting…" : "Reset password"}
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-xs text-on-surface-variant">
          <Link className="text-secondary underline" to="/applicant/login">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

