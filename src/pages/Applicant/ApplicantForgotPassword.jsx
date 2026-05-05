import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";

export default function ApplicantForgotPassword() {
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: (payload) => authService.forgotPassword(payload),
    onSuccess: () => {
      setError("");
      setNotice("If an account exists for that email, a reset link has been sent.");
    },
    onError: (err) => {
      setNotice("");
      setError(err?.response?.data?.error?.message || "Unable to send reset link. Please try again.");
    },
  });

  return (
    <div className="min-h-screen bg-surface px-6 py-24 font-body text-on-surface">
      <div className="mx-auto max-w-md">
        <Link to="/" className="mb-8 inline-block font-headline text-xl font-black text-primary">
          INTECHROOT
        </Link>
        <h1 className="mb-2 font-headline text-2xl font-bold text-primary">Reset password</h1>
        <p className="mb-6 text-sm text-on-surface-variant">
          Enter the email address you used to apply. We’ll send you a secure reset link.
        </p>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setError("");
            setNotice("");
            const normalized = email.trim().toLowerCase();
            if (!normalized) {
              setError("Enter your email.");
              return;
            }
            mutation.mutate({ email: normalized, role: "applicant" });
          }}
        >
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Email</label>
            <input
              className="w-full rounded-lg border border-outline-variant/30 bg-white px-4 py-3 text-sm"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              required
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
            {mutation.isPending ? "Sending…" : "Send reset link"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-on-surface-variant">
          <Link className="text-secondary underline" to="/applicant/login">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

