import { Link } from "react-router-dom";

/**
 * Static forgot-password UI (no API / state). Matches provided HTML structure and classes.
 */
export default function ForgotPassword() {
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
        <div className="mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-4xl text-tertiary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>
            dataset
          </span>
          <h1 className="font-headline text-3xl font-extrabold tracking-tighter text-white">InTechRoot</h1>
        </div>
        <div className="h-1 w-12 rounded-full bg-tertiary-fixed opacity-50" />
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
              />
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-tertiary-fixed-dim transition-all duration-300 group-focus-within:w-full" />
            </div>
          </div>
          <div className="pt-4">
            <button
              className="font-label flex w-full items-center justify-center gap-2 rounded-lg bg-primary-container py-4 text-sm font-bold tracking-wide text-on-primary shadow-lg transition-all hover:shadow-xl active:scale-95"
              type="submit"
            >
              <span>Send Reset Link</span>
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

      <footer className="z-10 mt-12 text-center">
        <p className="font-body text-xs tracking-wide text-[#7587a7]">© 2024 InTechRoot. Digital Monolith Architecture.</p>
        <div className="mt-4 flex justify-center gap-6">
          <a className="text-xs text-[#7587a7] transition-colors hover:text-tertiary-fixed" href="#">
            Security Standards
          </a>
          <a className="text-xs text-[#7587a7] transition-colors hover:text-tertiary-fixed" href="#">
            Privacy Policy
          </a>
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
