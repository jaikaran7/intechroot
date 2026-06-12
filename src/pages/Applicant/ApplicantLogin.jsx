import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authService } from "../../services/auth.service";
import { useAuthStore } from "../../store/authStore";
import CompanyContactBlock from "../../components/CompanyContactBlock";
import CompanyLogo from "../../components/CompanyLogo";

export default function ApplicantLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();
  const fromApply = Boolean(location.state?.fromApply);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = useMutation({
    mutationFn: ({ email: em, password: pw }) =>
      authService.applicantLogin(em, pw?.trim() ? pw.trim() : ""),
    onSuccess: (data) => {
      setAuth({
        user: { email: data.application?.email },
        role: 'applicant',
        accessToken: data.accessToken,
        applicationId: data.application?.id,
      });
      navigate('/applicant/dashboard', { replace: true });
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        (err?.response?.status === 403
          ? "Your application is still pending approval, or access was not granted yet."
          : "Sign-in failed. Check your email and password.");
      setError(msg);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const normalized = email.trim().toLowerCase();
    if (!normalized) {
      setError("Enter the email you used on your application.");
      return;
    }
    if (!password.trim()) {
      setError("Enter your password.");
      return;
    }
    loginMutation.mutate({ email: normalized, password });
  };

  return (
    <div className="min-h-screen bg-surface px-6 py-24 font-body text-on-surface">
      <div className="mx-auto max-w-md">
        <CompanyLogo markClassName="h-9 w-9 rounded-xl object-cover shadow-md" linkClassName="mb-8 inline-flex items-center gap-3" />
        <h1 className="mb-2 font-headline text-2xl font-bold text-primary">Applicant portal</h1>
        <p className="mb-6 text-sm text-on-surface-variant">
          After your application is approved, you will receive an email with a temporary password. Use that email and
          password to open your applicant portal (documents, interviews, and messages).
        </p>
        {fromApply ? (
          <p className="mb-6 rounded-lg border border-outline-variant/20 bg-surface-container-low/80 p-4 text-sm text-on-surface-variant">
            Application received. An administrator will review it shortly. You can sign in only after your application
            is approved
            {" and you receive the email with login details."}
          </p>
        ) : null}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Email</label>
            <input
              className="w-full rounded-lg border border-outline-variant/30 bg-white px-4 py-3 text-sm"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
            />
          </div>
          <div>
            <div className="flex items-end justify-between">
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Password
              </label>
              <Link className="text-[11px] font-bold text-secondary underline" to="/applicant/forgot-password">
                Forgot Password?
              </Link>
            </div>
            <input
              className="w-full rounded-lg border border-outline-variant/30 bg-white px-4 py-3 text-sm"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-error">{error}</p> : null}
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full rounded-lg bg-primary-container py-3 text-sm font-bold text-white shadow-lg transition-transform active:scale-[0.99] disabled:opacity-60"
          >
            {loginMutation.isPending ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="mt-8 text-center text-xs text-on-surface-variant">
          <Link className="text-secondary underline" to="/careers#apply">
            Submit a new application
          </Link>
        </p>
        <div className="mt-10 border-t border-outline-variant/20 pt-8">
          <CompanyContactBlock className="text-center" linkClassName="hover:text-secondary transition-colors" />
        </div>
      </div>
    </div>
  );
}
