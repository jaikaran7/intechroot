import { Link, useNavigate } from "react-router-dom";
import CompanyContactBlock from "../components/CompanyContactBlock";
import CompanyLogo from "../components/CompanyLogo";
import { COMPANY_COPYRIGHT } from "../constants/companyBrand";
import { LEGAL_PATHS } from "../constants/legalRoutes";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { authService } from "@/services/auth.service";

/**
 * Static forgot-password UI (no API / state). Matches provided HTML structure and classes.
 */
export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [debugLink, setDebugLink] = useState("");

  const mutation = useMutation({
    mutationFn: (payload) => authService.forgotPassword(payload),
    onSuccess: (data) => {
      setError("");
      const link = data?.debugResetLink ? String(data.debugResetLink) : "";
      setDebugLink(link);
      setNotice("If an account exists for that email, a reset link has been sent.");
    },
    onError: (err) => {
      setNotice("");
      setDebugLink("");
      setError(err?.response?.data?.error?.message || "Unable to send reset link. Please try again.");
    },
  });

  return (
    <div className="bg-background font-body text-on-surface antialiased">
    <main className="forgot-password-page network-bg relative flex min-h-screen w-full flex-col items-center justify-center p-6">
      <div className="signature-glow top-[-10%] left-[-10%]" />
      <div className="signature-glow bottom-[-10%] right-[-10%]" />
      <div className="network-motif" data-alt="abstract architectural grid with glowing blue nodes and connecting lines on a deep obsidian background">
        <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern height="100" id="grid" patternUnits="userSpaceOnUse" width="100">
              <path d="M 100 0 L 0 0 0 100" fill="none" opacity="0.2" stroke="#4cd7f6" strokeWidth="0.5" />
              <circle cx="0" cy="0" fill="#acedff" r="1.5" />
            </pattern>
          </defs>
          <rect fill="url(#grid)" height="100%" width="100%" />
        </svg>
      </div>

      <div className="z-10 mb-12 flex flex-col items-center">
        <CompanyLogo
          to={null}
          markClassName="h-12 w-12 rounded-xl object-cover shadow-lg"
          textClassName="tracking-[0.15em] text-2xl font-headline font-black text-white"
          linkClassName="inline-flex items-center gap-3"
        />
        <div className="mt-4 h-1 w-12 rounded-full bg-tertiary-fixed opacity-50" />
      </div>

      <div className="glass-panel z-10 w-full max-w-md rounded-xl p-10">
        <div className="mb-8">
          <h2 className="mb-2 font-headline text-2xl font-bold tracking-tight text-primary">Reset Password</h2>
          <p className="text-sm leading-relaxed text-on-surface-variant">
            Enter the email address associated with your InTechRoot executive account. We will transmit a secure recovery link to your inbox.
          </p>
        </div>
        <form
          action="#"
          className="space-y-8"
          onSubmit={(e) => {
            e.preventDefault();
            setError("");
            setNotice("");
            const normalized = email.trim().toLowerCase();
            if (!normalized) {
              setError("Enter your email.");
              return;
            }
            mutation.mutate({ email: normalized, role: "employee" });
          }}
        >
          <div className="space-y-2">
            <label className="font-label text-xs font-semibold uppercase tracking-widest text-on-primary-container" htmlFor="email">
              Corporate Email
            </label>
            <div className="group relative">
              <input
                className="w-full border-0 border-b border-outline-variant bg-transparent px-0 py-3 text-primary transition-all placeholder:text-outline/40 focus:border-tertiary-fixed-dim focus:ring-0"
                id="email"
                name="email"
                placeholder="executive@intechroot.com"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-tertiary-fixed-dim transition-all duration-300 group-focus-within:w-full" />
            </div>
          </div>
          {notice ? <p className="text-sm text-on-surface-variant">{notice}</p> : null}
          {debugLink ? (
            <div className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-3 text-sm text-primary">
              <p className="font-semibold">Dev mode:</p>
              <p className="mt-1 break-words">
                Email sending isn’t configured on this environment. Use this reset link:
              </p>
              <a className="mt-2 inline-block text-secondary underline break-words" href={debugLink}>
                {debugLink}
              </a>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  className="rounded-lg bg-primary-container px-3 py-2 text-xs font-bold text-white"
                  onClick={() => navigate(debugLink.replace(window.location.origin, ""))}
                >
                  Open reset page
                </button>
              </div>
            </div>
          ) : null}
          {error ? <p className="text-sm text-error">{error}</p> : null}
          <div className="pt-4">
            <button
              className="font-label flex w-full items-center justify-center gap-2 rounded-lg bg-primary-container py-4 text-sm font-bold tracking-wide text-on-primary shadow-lg transition-all hover:shadow-xl active:scale-95 disabled:opacity-60"
              type="submit"
              disabled={mutation.isPending}
            >
              <span>{mutation.isPending ? "Sending…" : "Send Reset Link"}</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </form>
        <div className="mt-10 flex flex-col items-center gap-6">
          <Link
            className="group flex items-center gap-2 text-sm font-semibold text-secondary transition-colors hover:text-tertiary-fixed-dim"
            to="/login"
          >
            <span className="material-symbols-outlined text-lg transition-transform group-hover:-translate-x-1">arrow_back</span>
            Back to Login
          </Link>
        </div>
      </div>

      <footer className="z-10 mt-12 flex flex-col items-center gap-6 text-center px-8">
        <CompanyContactBlock className="max-w-md" />
        <p className="font-body text-xs tracking-wide text-[#7587a7]">{COMPANY_COPYRIGHT}</p>
        <div className="flex justify-center gap-6">
          <a className="text-xs text-[#7587a7] transition-colors hover:text-tertiary-fixed" href="#">
            Security Standards
          </a>
          <Link className="text-xs text-[#7587a7] transition-colors hover:text-tertiary-fixed" to={LEGAL_PATHS.privacy}>
            Privacy Policy
          </Link>
        </div>
      </footer>

      <button
        className="glass-panel group fixed bottom-8 right-8 flex h-12 w-12 items-center justify-center rounded-full text-primary shadow-2xl transition-all hover:bg-surface-container-lowest"
        type="button"
      >
        <span className="material-symbols-outlined transition-transform group-hover:scale-110">help_outline</span>
      </button>
    </main>
    </div>
  );
}
