import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authService } from "../../services/auth.service";
import { useAuthStore } from "../../store/authStore";

export default function ApplicantLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();
  const fromApply = Boolean(location.state?.fromApply);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = useMutation({
    mutationFn: (emailVal) => authService.applicantVerify(emailVal),
    onSuccess: (data) => {
      setAuth({
        user: { email: data.application?.email },
        role: 'applicant',
        accessToken: data.accessToken,
        applicationId: data.application?.id,
      });
      navigate('/applicant/dashboard', { replace: true });
    },
    onError: () => {
      setError("No application found for this email.");
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
    loginMutation.mutate(normalized);
  };

  return (
    <div className="min-h-screen bg-surface px-6 py-24 font-body text-on-surface">
      <div className="mx-auto max-w-md">
        <Link to="/" className="mb-8 inline-block font-headline text-xl font-black text-primary">
          INTECHROOT
        </Link>
        <h1 className="mb-2 font-headline text-2xl font-bold text-primary">Applicant portal</h1>
        <p className="mb-6 text-sm text-on-surface-variant">
          Sign in with the email address from your application to view your journey, documents, and messages.
        </p>
        {fromApply ? (
          <p className="mb-6 rounded-lg border border-outline-variant/20 bg-surface-container-low/80 p-4 text-sm text-on-surface-variant">
            Application submitted. Please wait for verification — or sign in below when your profile is active.
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
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Password</label>
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
          <Link className="text-secondary underline" to="/apply">
            Submit a new application
          </Link>
        </p>
      </div>
    </div>
  );
}
