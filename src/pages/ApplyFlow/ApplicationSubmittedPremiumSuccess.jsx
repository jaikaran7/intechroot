import { Link, useLocation } from "react-router-dom";
import "./premiumApplyScreens.css";

export default function ApplicationSubmittedPremiumSuccess() {
  const location = useLocation();
  const fromApply = Boolean(location.state?.fromApply);
  const reference = location.state?.referenceId || location.state?.reference || "MONO-7729-QX";
  const submittedAt =
    location.state?.submittedAtLabel ||
    location.state?.appliedAt ||
    new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="premium-apply-screen bg-[#F6F9FC] font-['Inter',sans-serif] text-[#1A1F23] min-h-screen flex flex-col selection:bg-[#0061FF]/20 overflow-x-hidden">
      <main className="flex-grow flex items-center justify-center px-6 py-20 relative">
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(0,97,255,0.03),transparent_70%)]"></div>
        <div className="fixed inset-0 -z-10 network-dots opacity-[0.15]"></div>
        <div className="fixed top-1/4 -left-20 w-96 h-96 bg-[#0061FF]/5 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div
          className="fixed bottom-1/4 -right-20 w-96 h-96 bg-[#60EFFF]/5 rounded-full blur-[100px] animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="relative z-10 w-full max-w-2xl group">
          <div className="absolute -inset-4 bg-gradient-to-r from-[#0061FF]/5 to-[#60EFFF]/5 rounded-[2.5rem] blur-2xl opacity-50"></div>
          <div className="glass-layer-1 p-10 md:p-16 rounded-2xl relative flex flex-col items-center text-center animate-float">
            <div className="mb-12 relative">
              <div className="absolute inset-0 bg-emerald-400/20 blur-3xl rounded-full animate-pulse-slow"></div>
              <div className="relative w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100">
                  <span
                    className="material-symbols-outlined text-emerald-500 !text-5xl"
                    style={{ fontVariationSettings: "'wght' 300, 'FILL' 1" }}
                  >
                    check_circle
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-12">
              <h1
                className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-4xl md:text-5xl text-[#0A2540] tracking-tight leading-[1.1]"
              >
                Application{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0061FF] to-[#60EFFF]">Received.</span>
              </h1>
              <p className="text-[#425466] text-lg leading-relaxed max-w-md mx-auto">
                We&apos;ve received your submission. An administrator will review your application first. You will{" "}
                <strong>not</strong> have portal access until you receive our approval email with your login link and
                temporary password.
              </p>
              {fromApply ? (
                <p className="text-[#425466] text-sm leading-relaxed max-w-md mx-auto mt-3 rounded-lg bg-white/60 border border-slate-200/80 px-4 py-3">
                  Watch your inbox for that message. It will also remind you to upload documents when asked, check interview
                  links, and read messages for updates.
                </p>
              ) : null}
            </div>

            <div className="w-full max-w-md mb-12 px-4">
              <div className="relative flex justify-between items-center">
                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-200 -translate-y-1/2 -z-10">
                  <div className="h-full bg-[#0061FF] w-1/2 rounded-full shadow-[0_0_10px_rgba(0,97,255,0.4)]"></div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-[#0061FF] text-white flex items-center justify-center text-sm ring-4 ring-white shadow-sm">
                    <span className="material-symbols-outlined text-sm">description</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0061FF]">Applied</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-[#0061FF] text-white flex items-center justify-center text-sm ring-4 ring-white shadow-sm">
                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0061FF]">Reviewing</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-sm ring-4 ring-white">
                    <span className="material-symbols-outlined text-sm">forum</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Interview</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
              <Link
                to="/applicant/login"
                className="w-full sm:w-auto px-8 py-4 text-[#425466] font-semibold hover:text-[#0A2540] transition-colors duration-200 border border-slate-200 hover:border-slate-300 rounded-xl text-center"
              >
                Applicant sign-in
                <span className="block text-xs font-normal text-[#425466]/80 mt-1">Use this only after you receive the approval email</span>
              </Link>
              <Link
                to="/careers"
                className="premium-button w-full sm:w-auto px-10 py-4 bg-[#0A2540] text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-[#0A2540]/20 transition-all duration-300 flex items-center justify-center gap-2 group/btn"
              >
                Back to Careers
                <span className="material-symbols-outlined text-lg transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
              </Link>
            </div>

            <div className="mt-12 w-full glass-layer-2 p-4 rounded-xl">
              <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-xs font-medium text-[#425466]/70 uppercase tracking-widest">
                <span>Reference: {reference}</span>
                <span className="hidden md:block opacity-30">•</span>
                <span>Submission: {submittedAt}</span>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="text-xs text-[#425466]/60 font-medium tracking-wide">
              © 2024 The Azure Meridian. Powered by The Digital Monolith.
            </p>
          </div>
        </div>
      </main>

      <div className="fixed inset-0 -z-20 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-px h-64 bg-gradient-to-b from-transparent via-[#0061FF]/20 to-transparent rotate-45 animate-pulse-slow"></div>
        <div
          className="absolute bottom-[10%] right-[10%] w-px h-64 bg-gradient-to-b from-transparent via-[#60EFFF]/20 to-transparent -rotate-45 animate-pulse-slow"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>
    </div>
  );
}
