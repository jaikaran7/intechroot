export default function Step5({ onDashboard, application }) {
  const appIdLabel = application?.id != null ? `#ITH-${String(application.id).padStart(3, "0")}` : "#ITH-—";

  return (
    <>
      <header className="w-full sticky top-0 z-50 bg-slate-50/60 dark:bg-slate-950/60 backdrop-blur-xl shadow-[0_40px_40px_-15px_rgba(11,31,58,0.04)]">
        <nav className="flex justify-between items-center px-8 h-20 max-w-full">
          <div className="flex items-center gap-12">
            <span className="text-2xl font-black text-blue-950 dark:text-white tracking-tighter font-headline">InTechRoot</span>
            <div className="hidden md:flex gap-8 items-center">
              <a className="font-headline font-bold tracking-tight text-slate-500 dark:text-slate-400 hover:text-blue-800 transition-all" href="#">
                Applicants
              </a>
              <a
                className="font-headline font-bold tracking-tight text-blue-900 dark:text-blue-300 border-b-2 border-blue-900 dark:border-blue-400 pb-1 transition-all"
                href="#"
              >
                Onboarding
              </a>
              <a className="font-headline font-bold tracking-tight text-slate-500 dark:text-slate-400 hover:text-blue-800 transition-all" href="#">
                Documents
              </a>
              <a className="font-headline font-bold tracking-tight text-slate-500 dark:text-slate-400 hover:text-blue-800 transition-all" href="#">
                Compliance
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-all active:scale-95 duration-200"
            >
              <span className="material-symbols-outlined text-slate-600">notifications</span>
            </button>
            <button
              type="button"
              className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-all active:scale-95 duration-200"
            >
              <span className="material-symbols-outlined text-slate-600">settings</span>
            </button>
            <div className="w-10 h-10 rounded-full bg-surface-container overflow-hidden">
              <img
                alt="Admin Profile"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvWKmDSthFMXe_dgWVzTvw4Y-Tdyx15edfdlZcvgWHHUXPm_WBzi-K-ZUMDUdVX6S2XqHYPNUt27-mIuK7OPyUIj0qCtjnkN1IO7bvyOR8sDHOJzR2kQ0vji5H2mxXAcVlFIFu7jgk3rOuBK6Pb87EKs3IWlkp2Kb-1uFXi7eCJcJ-QUVT0Ol4efPmGnSoZJLMQKz32tbPPExA6cgvtcExRa5gKTc4jtTa5JVDF5eStwo0Dy1XR8KC6M13z5-axkFjqBb1dv0Jz9Vo"
              />
            </div>
          </div>
        </nav>
      </header>
      <main className="min-h-[calc(100vh-80px)] flex flex-col md:flex-row relative">
        <aside className="hidden md:flex flex-col h-[calc(100vh-80px)] w-64 border-r border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-20 overflow-y-auto py-6">
          <div className="px-6 mb-8">
            <h3 className="font-headline font-bold text-blue-950 dark:text-white text-lg">Recruitment Portal</h3>
            <p className="text-xs text-slate-500 font-medium">Enterprise Admin</p>
          </div>
          <div className="flex flex-col gap-1 px-3 flex-grow">
            <button
              type="button"
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all group"
            >
              <span className="material-symbols-outlined group-hover:text-blue-900">dashboard</span>
              <span className="font-body text-sm font-medium">Dashboard</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-3 px-3 py-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-300 border-r-4 border-blue-900 transition-all"
            >
              <span className="material-symbols-outlined">group</span>
              <span className="font-body text-sm font-medium">Candidate Flow</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all group"
            >
              <span className="material-symbols-outlined group-hover:text-blue-900">fact_check</span>
              <span className="font-body text-sm font-medium">Verification</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all group"
            >
              <span className="material-symbols-outlined group-hover:text-blue-900">rate_review</span>
              <span className="font-body text-sm font-medium">Review Board</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all group"
            >
              <span className="material-symbols-outlined group-hover:text-blue-900">inventory_2</span>
              <span className="font-body text-sm font-medium">Archive</span>
            </button>
          </div>
          <div className="mt-auto px-3 border-t border-slate-100 pt-6">
            <button
              type="button"
              className="flex items-center gap-3 px-3 py-3 w-full rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
            >
              <span className="material-symbols-outlined">help</span>
              <span className="font-body text-sm font-medium">Support</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-3 px-3 py-3 w-full rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
            >
              <span className="material-symbols-outlined">logout</span>
              <span className="font-body text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </aside>
        <div className="flex-1 bg-surface relative overflow-hidden p-8 md:p-12 lg:p-20">
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern height="40" id="onboarding-s5-grid" patternUnits="userSpaceOnUse" width="40">
                  <path
                    className="text-outline-variant"
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect fill="url(#onboarding-s5-grid)" height="100%" width="100%" />
            </svg>
          </div>
          <div className="relative z-10 max-w-5xl mx-auto">
            <div className="mb-16">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div className="max-w-2xl">
                  <span className="text-secondary font-headline font-bold text-sm uppercase tracking-widest mb-4 block">Step 05 — Process Complete</span>
                  <h1 className="text-display-lg text-5xl md:text-6xl font-headline font-extrabold text-primary tracking-tighter leading-tight">
                    Submission{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-tertiary-fixed-dim">Successful</span>
                  </h1>
                </div>
                <div className="flex items-center gap-3 bg-white/50 backdrop-blur px-4 py-2 rounded-lg border border-outline-variant/15">
                  <span className="material-symbols-outlined text-green-600" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified_user
                  </span>
                  <span className="text-sm font-medium text-slate-700">Bank-Grade Encryption</span>
                </div>
              </div>
              <div className="relative flex items-center justify-between w-full max-w-4xl mx-auto mb-16">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-surface-container -translate-y-1/2 -z-10" />
                <div className="absolute top-1/2 left-0 w-full h-1 bg-secondary -translate-y-1/2 -z-10" />
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center shadow-lg mb-2">
                    <span className="material-symbols-outlined text-lg">check</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-secondary">Profile</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center shadow-lg mb-2">
                    <span className="material-symbols-outlined text-lg">check</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-secondary">Documents</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center shadow-lg mb-2">
                    <span className="material-symbols-outlined text-lg">check</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-secondary">Verification</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center shadow-lg mb-2">
                    <span className="material-symbols-outlined text-lg">check</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-secondary">Review</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary-container text-white flex items-center justify-center shadow-xl border-4 border-white mb-2 scale-110">
                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      verified
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-primary">Finalize</span>
                </div>
              </div>
            </div>
            <div className="glass-card rounded-xl p-12 md:p-16 text-center flex flex-col items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 signature-glow rounded-bl-full -mr-32 -mt-32 opacity-30" />
              <div className="w-24 h-24 bg-gradient-to-br from-primary-container to-secondary-container rounded-full flex items-center justify-center relative z-10 shadow-xl mb-8">
                <span className="material-symbols-outlined text-5xl text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              </div>
              <h2 className="font-headline text-4xl font-extrabold text-primary mb-6">Onboarding Submitted Successfully</h2>
              <p className="font-body text-slate-600 text-lg max-w-xl mx-auto leading-relaxed mb-10">
                Your onboarding is under review. Please wait for admin approval. We have sent a confirmation email to your registered address with the
                next steps of your integration process.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md mb-12">
                <button
                  type="button"
                  onClick={onDashboard}
                  className="flex-1 bg-primary-container text-white px-8 py-4 rounded-lg font-bold shadow-md hover:translate-y-[-2px] transition-all duration-200"
                >
                  Go to Dashboard
                </button>
                <button
                  type="button"
                  className="flex-1 border border-outline-variant/30 text-primary-container px-8 py-4 rounded-lg font-bold hover:bg-slate-50 transition-all duration-200"
                >
                  Download Receipt
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full pt-10 border-t border-outline-variant/10 text-left">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Application ID</div>
                  <div className="font-mono text-sm font-bold text-primary">{appIdLabel}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Review Status</div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-sm font-bold text-primary">Pending Verification</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Est. Response Time</div>
                  <div className="text-sm font-bold text-primary">24-48 Business Hours</div>
                </div>
              </div>
            </div>
            <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-8 opacity-70">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary-container">support_agent</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-primary">Need assistance?</div>
                  <div className="text-xs text-slate-500">Our support team is available 24/7</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <img
                  className="h-8 grayscale opacity-50"
                  alt=""
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhI-VvPOHpIkXIAQMG2h2XAldYwvpZAS7gR4ZBNtgk2pqv7RmYq7Fmm7M1E-Q5d4iGQbegI2vCs6dGgAs2JDYKpwI_nlIC1Mn-QttxroqbtUsnhRnCSJyqotqrnRZe7GnHUE_a92irtH1qSJbhm3gPrLWCZaCh7YIOhqAEC9l6MTwDyimqDDRd_vo2IEoamcEBQU0mNMQPL-_m7NGrSwodSqJsiCoKlMMwjOULt1LV89w6SLMJSlYigH_-1eEaUe_9H9KQaTji0oUm"
                />
                <div className="h-4 w-[1px] bg-outline-variant/30" />
                <div className="text-[10px] font-medium text-slate-400 max-w-[200px] leading-tight">
                  All submitted data is encrypted with enterprise-grade AES-256 protocols.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="w-full py-8 px-8 border-t border-outline-variant/10 bg-white dark:bg-slate-950 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400 font-medium">© 2024 InTechRoot Solutions. All rights reserved.</p>
          <div className="flex gap-8">
            <a className="text-xs text-slate-500 hover:text-primary transition-colors" href="#">
              Privacy Policy
            </a>
            <a className="text-xs text-slate-500 hover:text-primary transition-colors" href="#">
              Terms of Service
            </a>
            <a className="text-xs text-slate-500 hover:text-primary transition-colors" href="#">
              Security Standards
            </a>
          </div>
        </div>
      </footer>
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-lg border-t border-slate-100 flex justify-around items-center h-16 z-50">
        <button type="button" className="flex flex-col items-center gap-1 text-slate-400">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button type="button" className="flex flex-col items-center gap-1 text-blue-900">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            group
          </span>
          <span className="text-[10px] font-bold">Flow</span>
        </button>
        <button type="button" className="flex flex-col items-center gap-1 text-slate-400">
          <span className="material-symbols-outlined">fact_check</span>
          <span className="text-[10px] font-bold">Verify</span>
        </button>
        <button type="button" className="flex flex-col items-center gap-1 text-slate-400">
          <span className="material-symbols-outlined">settings</span>
          <span className="text-[10px] font-bold">Settings</span>
        </button>
      </nav>
    </>
  );
}
