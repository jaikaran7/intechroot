import { Link, useLocation, useNavigate } from "react-router-dom";
import "./premiumApplyScreens.css";

export default function AlreadyAppliedPremiumPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const jobTitle = location.state?.jobTitle || location.state?.discipline || "Senior Cloud Architect";
  const company = location.state?.company || "InTechRoot";
  const reference = location.state?.referenceId || "MONO-7729-QX";
  const lastUpdated =
    location.state?.lastUpdatedLabel ||
    new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="premium-apply-screen bg-[#F6F9FC] font-['Inter',sans-serif] text-[#1A1F23] min-h-screen flex flex-col selection:bg-[#0061FF]/20 overflow-x-hidden">
      <nav className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-xl border-b border-slate-200/50">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
          <Link to="/" className="text-xl font-extrabold text-[#0A2540] tracking-tighter font-['Plus_Jakarta_Sans',sans-serif]">
            The Digital Monolith
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/services"
              className="text-[#425466] hover:text-[#0A2540] font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-sm transition-all duration-300"
            >
              Services
            </Link>
            <Link
              to="/careers"
              className="text-[#425466] hover:text-[#0A2540] font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-sm transition-all duration-300"
            >
              Careers
            </Link>
            <Link
              to="/"
              className="text-[#425466] hover:text-[#0A2540] font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-sm transition-all duration-300"
            >
              About Us
            </Link>
          </div>
          <Link
            to="/apply"
            className="bg-[#0A2540] text-white px-6 py-2.5 rounded-lg font-['Plus_Jakarta_Sans',sans-serif] font-bold text-sm hover:shadow-lg transition-all duration-300"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <main className="flex-grow flex items-center justify-center px-6 py-20 relative pt-32">
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(0,97,255,0.03),transparent_70%)]"></div>
        <div className="fixed inset-0 -z-10 network-dots opacity-[0.15]"></div>
        <div className="fixed top-1/4 -left-20 w-96 h-96 bg-amber-400/5 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div
          className="fixed bottom-1/4 -right-20 w-96 h-96 bg-[#0061FF]/5 rounded-full blur-[100px] animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="relative z-10 w-full max-w-2xl group">
          <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/5 to-[#0061FF]/5 rounded-[2.5rem] blur-2xl opacity-50"></div>
          <div className="glass-layer-1 p-10 md:p-16 rounded-2xl relative flex flex-col items-center text-center animate-float">
            <div className="mb-12 relative">
              <div className="absolute inset-0 bg-amber-400/20 blur-3xl rounded-full animate-pulse-slow"></div>
              <div className="relative w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50">
                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center border border-amber-100">
                  <span
                    className="material-symbols-outlined text-amber-600 !text-5xl"
                    style={{ fontVariationSettings: "'wght' 300, 'FILL' 1" }}
                  >
                    info
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-10">
              <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-4xl md:text-5xl text-[#0A2540] tracking-tight leading-[1.1]">
                You&apos;ve Already{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">Applied.</span>
              </h1>
              <p className="text-[#425466] text-lg leading-relaxed max-w-md mx-auto">
                Our records indicate that you have already submitted an application for this position.
              </p>
            </div>

            <div className="w-full max-w-sm mb-12">
              <div className="glass-layer-2 py-4 px-6 rounded-xl flex items-center justify-center gap-3 border border-slate-200/50">
                <span className="material-symbols-outlined text-amber-600 text-xl">assignment_turned_in</span>
                <span className="text-[#0A2540] font-['Plus_Jakarta_Sans',sans-serif] font-bold tracking-tight text-sm uppercase">
                  Role: {jobTitle}
                </span>
              </div>
              {company ? (
                <p className="mt-2 text-center text-xs font-medium text-[#425466]/80">{company}</p>
              ) : null}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
              <button
                type="button"
                onClick={() => navigate("/applicant-dashboard")}
                className="premium-button w-full sm:w-auto px-10 py-4 bg-[#0A2540] text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-[#0A2540]/20 transition-all duration-300 flex items-center justify-center gap-2 group/btn"
              >
                View Application Status
                <span className="material-symbols-outlined text-lg transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
              </button>
              <Link
                to="/careers"
                className="w-full sm:w-auto px-8 py-4 text-[#425466] font-semibold hover:text-[#0A2540] transition-colors duration-200 border border-slate-200 hover:border-slate-300 rounded-xl text-center"
              >
                Back to Jobs
              </Link>
            </div>

            <div className="mt-12 w-full glass-layer-2 p-4 rounded-xl">
              <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-[10px] font-bold text-[#425466]/70 uppercase tracking-[0.2em]">
                <span>Reference: {reference}</span>
                <span className="hidden md:block opacity-30 text-lg leading-none">•</span>
                <span>Last Updated: {lastUpdated}</span>
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
        <div className="absolute top-[10%] left-[5%] w-px h-64 bg-gradient-to-b from-transparent via-amber-400/20 to-transparent rotate-45 animate-pulse-slow"></div>
        <div
          className="absolute bottom-[10%] right-[10%] w-px h-64 bg-gradient-to-b from-transparent via-[#0061FF]/20 to-transparent -rotate-45 animate-pulse-slow"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      <footer className="w-full py-12 bg-slate-50 border-t border-slate-200/50">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-8 max-w-7xl mx-auto gap-8 text-sm">
          <div className="text-lg font-extrabold text-[#0A2540] font-['Plus_Jakarta_Sans',sans-serif]">The Digital Monolith</div>
          <div className="flex gap-8">
            <Link to="/" className="text-[#425466] hover:text-[#0A2540] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/" className="text-[#425466] hover:text-[#0A2540] transition-colors">
              Terms of Service
            </Link>
            <Link to="/" className="text-[#425466] hover:text-[#0A2540] transition-colors">
              Cookie Policy
            </Link>
            <Link to="/" className="text-[#425466] hover:text-[#0A2540] transition-colors">
              Contact
            </Link>
          </div>
          <div className="text-[#425466]/60">© 2024 The Digital Monolith. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
