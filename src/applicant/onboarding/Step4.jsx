export default function Step4({ onBack, onSubmitFinal, application }) {
  return (
    <>
      <header className="w-full sticky top-0 z-50 bg-slate-50/60 backdrop-blur-xl shadow-[0_40px_40px_-15px_rgba(11,31,58,0.04)]">
        <nav className="flex justify-between items-center px-8 h-20 max-w-full">
          <div className="flex items-center gap-12">
            <span className="text-2xl font-black text-blue-950 tracking-tighter font-headline">InTechRoot</span>
            <div className="hidden md:flex gap-8 items-center">
              <a className="font-headline font-bold tracking-tight text-slate-500 hover:text-blue-800 transition-all" href="#">
                Applicants
              </a>
              <a className="font-headline font-bold tracking-tight text-blue-900 border-b-2 border-blue-900 pb-1 transition-all" href="#">
                Onboarding
              </a>
              <a className="font-headline font-bold tracking-tight text-slate-500 hover:text-blue-800 transition-all" href="#">
                Documents
              </a>
              <a className="font-headline font-bold tracking-tight text-slate-500 hover:text-blue-800 transition-all" href="#">
                Compliance
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button type="button" className="p-2 rounded-full hover:bg-slate-200/50 transition-all active:scale-95 duration-200">
              <span className="material-symbols-outlined text-slate-600">notifications</span>
            </button>
            <button type="button" className="p-2 rounded-full hover:bg-slate-200/50 transition-all active:scale-95 duration-200">
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
        <aside className="hidden md:flex flex-col h-[calc(100vh-80px)] w-64 border-r border-slate-100 bg-white sticky top-20 overflow-y-auto py-6">
          <div className="px-6 mb-8">
            <h3 className="font-headline font-bold text-blue-950 text-lg">Recruitment Portal</h3>
            <p className="text-xs text-slate-500 font-medium">Enterprise Admin</p>
          </div>
          <div className="flex flex-col gap-1 px-3 flex-grow">
            <button type="button" className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-500 hover:bg-slate-50 transition-all group">
              <span className="material-symbols-outlined group-hover:text-blue-900">dashboard</span>
              <span className="font-body text-sm font-medium">Dashboard</span>
            </button>
            <button type="button" className="flex items-center gap-3 px-3 py-3 rounded-lg bg-blue-50 text-blue-900 border-r-4 border-blue-900 transition-all">
              <span className="material-symbols-outlined">group</span>
              <span className="font-body text-sm font-medium">Candidate Flow</span>
            </button>
            <button type="button" className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-500 hover:bg-slate-50 transition-all group">
              <span className="material-symbols-outlined group-hover:text-blue-900">fact_check</span>
              <span className="font-body text-sm font-medium">Verification</span>
            </button>
            <button type="button" className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-500 hover:bg-slate-50 transition-all group">
              <span className="material-symbols-outlined group-hover:text-blue-900">rate_review</span>
              <span className="font-body text-sm font-medium">Review Board</span>
            </button>
            <button type="button" className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-500 hover:bg-slate-50 transition-all group">
              <span className="material-symbols-outlined group-hover:text-blue-900">inventory_2</span>
              <span className="font-body text-sm font-medium">Archive</span>
            </button>
          </div>
          <div className="mt-auto px-3 border-t border-slate-100 pt-6">
            <button type="button" className="flex items-center gap-3 px-3 py-3 w-full rounded-lg text-slate-500 hover:bg-slate-50 transition-all">
              <span className="material-symbols-outlined">help</span>
              <span className="font-body text-sm font-medium">Support</span>
            </button>
            <button type="button" className="flex items-center gap-3 px-3 py-3 w-full rounded-lg text-slate-500 hover:bg-slate-50 transition-all">
              <span className="material-symbols-outlined">logout</span>
              <span className="font-body text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </aside>
        <div className="flex-1 bg-surface relative overflow-hidden p-8 md:p-12 lg:p-20">
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern height="40" id="onboarding-s4-grid" patternUnits="userSpaceOnUse" width="40">
                  <path
                    className="text-outline-variant"
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect fill="url(#onboarding-s4-grid)" height="100%" width="100%" />
            </svg>
          </div>
          <div className="relative z-10 max-w-5xl mx-auto">
            <div className="mb-16">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div className="max-w-2xl">
                  <span className="text-secondary font-headline font-bold text-sm uppercase tracking-widest mb-4 block">Step 04 — Final Review</span>
                  <h1 className="text-display-lg text-5xl md:text-6xl font-headline font-extrabold text-primary tracking-tighter leading-tight">
                    Review &{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-tertiary-fixed-dim">Submit</span>
                  </h1>
                </div>
              </div>
              <div className="relative flex items-center justify-between w-full max-w-4xl mx-auto mb-16">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-surface-container -translate-y-1/2 -z-10" />
                <div className="absolute top-1/2 left-0 w-3/4 h-1 bg-secondary -translate-y-1/2 -z-10" />
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center shadow-lg mb-2">
                    <span className="material-symbols-outlined text-lg">check</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-secondary">Identity</span>
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
                  <div className="w-12 h-12 rounded-full bg-primary-container text-white flex items-center justify-center shadow-xl border-4 border-white mb-2 scale-110">
                    <span className="font-headline font-bold">04</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-primary">Review</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-surface-container text-slate-400 flex items-center justify-center mb-2">
                    <span className="font-headline font-bold">05</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">Finalize</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-8 space-y-10">
                <div className="mb-4">
                  <p className="text-on-surface-variant text-lg leading-relaxed max-w-2xl">
                    Please conduct a final review of your application data before submission. Accuracy at this stage accelerates the final onboarding
                    phase.
                  </p>
                </div>
                <div className="glass-card p-8 rounded-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-48 h-48 signature-glow rounded-bl-full -mr-20 -mt-20 opacity-50 transition-transform group-hover:scale-110 duration-700" />
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div>
                      <h2 className="text-2xl font-headline font-bold text-primary mb-2">Profile Summary</h2>
                      <p className="text-slate-600 leading-relaxed">Core identity details confirmed via LinkedIn</p>
                    </div>
                    <button type="button" className="text-secondary hover:underline font-semibold text-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">edit</span> Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12 relative z-10">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-1 block">Full Name</label>
                      <p className="font-semibold text-primary">{application?.name || "—"}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-1 block">Email Address</label>
                      <p className="font-semibold text-primary">{application?.email || "—"}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-1 block">Role Applied</label>
                      <p className="font-semibold text-primary">{application?.role || "—"}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-1 block">Primary Skillset</label>
                      <p className="px-2 py-0.5 bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold rounded inline-block">
                        AWS / AZURE / TERRAFORM
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/20 shadow-sm">
                    <h3 className="font-headline font-bold text-primary mb-6">Document Status</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-blue-600">description</span>
                          <span className="text-sm font-medium text-primary">Passport_Scan.pdf</span>
                        </div>
                        <span className="text-[10px] font-bold text-green-600 flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                            check_circle
                          </span>{" "}
                          VERIFIED
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-blue-600">work</span>
                          <span className="text-sm font-medium text-primary">Degree_Certificate.pdf</span>
                        </div>
                        <span className="text-[10px] font-bold text-green-600 flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                            check_circle
                          </span>{" "}
                          VERIFIED
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-blue-600">request_quote</span>
                          <span className="text-sm font-medium text-primary">Tax_Declaration.pdf</span>
                        </div>
                        <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                            pending
                          </span>{" "}
                          PENDING
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-primary-container p-8 rounded-xl text-white overflow-hidden relative">
                    <div className="absolute -bottom-4 -right-4 text-white/5">
                      <span className="material-symbols-outlined text-9xl">fingerprint</span>
                    </div>
                    <div className="relative z-10">
                      <h4 className="font-headline font-bold mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-tertiary-fixed-dim">verified_user</span>
                        Verification Engine
                      </h4>
                      <p className="text-on-primary-container text-xs leading-relaxed mb-6 opacity-80">
                        Background Verification (BGV) process has been initiated with global screening partners.
                      </p>
                      <div className="space-y-4">
                        <div>
                          <span className="text-[10px] uppercase tracking-widest font-bold opacity-60 block mb-1">Current Status</span>
                          <span className="text-xl font-black text-tertiary-fixed-dim italic">STAGE: IN-PROGRESS</span>
                        </div>
                        <div className="flex items-end justify-between">
                          <span className="text-xs font-bold">ETA: 48 Hours</span>
                          <div className="w-24 h-1 bg-on-primary-container/20 rounded-full overflow-hidden">
                            <div className="w-3/4 h-full bg-tertiary-fixed-dim" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-4 sticky top-32">
                <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/20 shadow-sm">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-6">Final Submission</h4>
                  <div className="space-y-6">
                    <div className="flex items-start gap-3">
                      <input className="mt-1 rounded-sm border-outline text-secondary focus:ring-secondary cursor-pointer" id="confirm" type="checkbox" />
                      <label className="text-sm text-slate-600 leading-relaxed cursor-pointer select-none" htmlFor="confirm">
                        I confirm that all information provided is correct and understand that false information may lead to rejection.
                      </label>
                    </div>
                    <div className="pt-4 space-y-3">
                      <button
                        type="button"
                        onClick={onSubmitFinal}
                        className="w-full h-14 bg-primary text-on-primary font-bold tracking-tight rounded-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
                      >
                        Submit for Approval
                        <span className="material-symbols-outlined">send</span>
                      </button>
                      <button
                        type="button"
                        className="w-full h-12 bg-transparent text-primary font-bold text-sm tracking-tight border border-outline-variant rounded-lg hover:bg-slate-50 transition-all"
                      >
                        Save as Draft
                      </button>
                    </div>
                    <div className="pt-6 border-t border-outline-variant/30">
                      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                        <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center">
                          <span className="material-symbols-outlined text-blue-700" style={{ fontVariationSettings: "'FILL' 1" }}>
                            lock
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-primary uppercase tracking-tight">Security Protocol</p>
                          <p className="text-[11px] text-slate-500">256-bit encrypted secure data transmission</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-8 p-6 bg-gradient-to-br from-secondary/5 to-tertiary-fixed-dim/5 rounded-xl border border-secondary/10">
                  <p className="text-xs text-slate-500 font-medium text-center">
                    Need assistance with your onboarding? <br />
                    <a className="text-secondary font-bold hover:underline" href="#">
                      Contact Support Specialist
                    </a>
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-16 pt-8 border-t border-outline-variant/10 flex flex-col sm:flex-row justify-between items-center gap-8">
              <button
                type="button"
                onClick={onBack}
                className="text-slate-500 font-bold text-sm flex items-center gap-2 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Back to Verification
              </button>
              <div className="flex items-center gap-6">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Progress</span>
                  <span className="text-sm font-bold text-primary">90% Complete</span>
                </div>
                <button
                  type="button"
                  onClick={onSubmitFinal}
                  className="bg-primary text-white px-10 py-4 rounded-lg font-bold hover:shadow-lg transition-all active:scale-95"
                >
                  Final Submission
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="max-w-7xl mx-auto px-8 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-center py-10 border-t border-outline-variant/15 opacity-60">
          <span className="text-xs font-bold tracking-widest text-primary uppercase">© 2024 InTechRoot Ecosystems</span>
          <div className="flex gap-8 mt-4 md:mt-0">
            <a className="text-xs font-medium hover:text-secondary" href="#">
              Privacy Policy
            </a>
            <a className="text-xs font-medium hover:text-secondary" href="#">
              Terms of Service
            </a>
            <a className="text-xs font-medium hover:text-secondary" href="#">
              Onboarding Guidelines
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
