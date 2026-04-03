export default function Step1({ onNext, onDashboard, application }) {
  const name = (application?.name || "").trim();
  const parts = name.split(/\s+/).filter(Boolean);
  const firstDefault = parts[0] || "";
  const lastDefault = parts.slice(1).join(" ") || "";

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
                <pattern height="40" id="onboarding-s1-grid" patternUnits="userSpaceOnUse" width="40">
                  <path
                    className="text-outline-variant"
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect fill="url(#onboarding-s1-grid)" height="100%" width="100%" />
            </svg>
          </div>
          <div className="relative z-10 max-w-5xl mx-auto">
            <div className="mb-16">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div className="max-w-2xl">
                  <span className="text-secondary font-headline font-bold text-sm uppercase tracking-widest mb-4 block">Step 01 — Getting Started</span>
                  <h1 className="text-display-lg text-5xl md:text-6xl font-headline font-extrabold text-primary tracking-tighter leading-tight">
                    Profile{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-tertiary-fixed-dim">Identity</span>
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
                <div className="absolute top-1/2 left-0 w-0 h-1 bg-secondary -translate-y-1/2 -z-10" />
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary-container text-white flex items-center justify-center shadow-xl border-4 border-white mb-2 scale-110">
                    <span className="font-headline font-bold">01</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-primary">Profile</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-surface-container text-slate-400 flex items-center justify-center mb-2">
                    <span className="font-headline font-bold">02</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">History</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-surface-container text-slate-400 flex items-center justify-center mb-2">
                    <span className="font-headline font-bold">03</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">Verification</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-surface-container text-slate-400 flex items-center justify-center mb-2">
                    <span className="font-headline font-bold">04</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">Review</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-surface-container text-slate-400 flex items-center justify-center mb-2">
                    <span className="font-headline font-bold">05</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">Finalize</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 glass-card p-8 rounded-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 signature-glow rounded-bl-full -mr-20 -mt-20 opacity-50 transition-transform group-hover:scale-110 duration-700" />
                <div className="flex items-start gap-6 mb-8 relative z-10">
                  <div className="bg-primary-container text-white p-4 rounded-xl">
                    <span className="material-symbols-outlined text-3xl">person</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-headline font-bold text-primary mb-2">Legal Identity</h2>
                    <p className="text-slate-600 leading-relaxed max-w-md">
                      Start your onboarding by providing your legal information. Ensure the details match your official documents.
                    </p>
                  </div>
                </div>
                <form className="space-y-8 relative z-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
                    <div className="group">
                      <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">First Name</label>
                      <input
                        className="w-full bg-transparent border-0 border-b-2 border-outline-variant focus:border-secondary focus:ring-0 px-0 py-3 text-lg font-medium transition-all"
                        defaultValue={firstDefault}
                        placeholder="e.g. Jonathan"
                        type="text"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Last Name</label>
                      <input
                        className="w-full bg-transparent border-0 border-b-2 border-outline-variant focus:border-secondary focus:ring-0 px-0 py-3 text-lg font-medium transition-all"
                        defaultValue={lastDefault}
                        placeholder="e.g. Sterling"
                        type="text"
                      />
                    </div>
                    <div className="sm:col-span-2 group">
                      <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Email Address</label>
                      <input
                        className="w-full bg-transparent border-0 border-b-2 border-outline-variant focus:border-secondary focus:ring-0 px-0 py-3 text-lg font-medium transition-all"
                        defaultValue={application?.email || ""}
                        placeholder="j.sterling@example.com"
                        type="email"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Phone Number</label>
                      <input
                        className="w-full bg-transparent border-0 border-b-2 border-outline-variant focus:border-secondary focus:ring-0 px-0 py-3 text-lg font-medium transition-all"
                        placeholder="+1 (555) 000-0000"
                        type="tel"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Date of Birth</label>
                      <input
                        className="w-full bg-transparent border-0 border-b-2 border-outline-variant focus:border-secondary focus:ring-0 px-0 py-3 text-lg font-medium transition-all"
                        type="date"
                      />
                    </div>
                    <div className="sm:col-span-2 group">
                      <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Nationality</label>
                      <select className="w-full bg-transparent border-0 border-b-2 border-outline-variant focus:border-secondary focus:ring-0 px-0 py-3 text-lg font-medium transition-all appearance-none">
                        <option value="">Select your country</option>
                        <option value="US">United States</option>
                        <option value="UK">United Kingdom</option>
                        <option value="CA">Canada</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="IN">India</option>
                      </select>
                    </div>
                  </div>
                </form>
              </div>
              <div className="lg:col-span-5 flex flex-col gap-8">
                <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/20 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-headline font-bold text-primary">Profile Photo</h3>
                    <span className="px-2 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded uppercase">Required</span>
                  </div>
                  <div className="border-2 border-dashed border-outline-variant/30 rounded-xl p-10 flex flex-col items-center text-center hover:border-secondary/50 transition-colors cursor-pointer group relative">
                    <input className="absolute inset-0 opacity-0 cursor-pointer" type="file" />
                    <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4 group-hover:bg-secondary/10 transition-colors">
                      <span className="material-symbols-outlined text-slate-400 group-hover:text-secondary">add_a_photo</span>
                    </div>
                    <span className="font-bold text-slate-900 mb-1">Click to upload photo</span>
                    <p className="text-xs text-slate-500">JPG, PNG up to 5MB</p>
                  </div>
                </div>
                <div className="bg-primary-container p-6 rounded-xl text-white overflow-hidden relative">
                  <div className="absolute -bottom-4 -right-4 text-white/5">
                    <span className="material-symbols-outlined text-9xl">badge</span>
                  </div>
                  <div className="relative z-10">
                    <h4 className="font-headline font-bold mb-4">Why this matters?</h4>
                    <p className="text-sm opacity-80 leading-relaxed mb-4">
                      Your profile photo will be used for your internal identity card and system access once onboarding is complete.
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-sm font-medium opacity-90">Auto-ID Recognition Enabled</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-16 pt-8 border-t border-outline-variant/10 flex flex-col sm:flex-row justify-between items-center gap-8">
              <button
                type="button"
                onClick={onDashboard}
                className="text-slate-500 font-bold text-sm flex items-center gap-2 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-sm">close</span>
                Cancel Application
              </button>
              <div className="flex items-center gap-6">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Progress</span>
                  <span className="text-sm font-bold text-primary">20% Complete</span>
                </div>
                <button
                  type="button"
                  onClick={onNext}
                  className="bg-primary-container text-white px-10 py-4 rounded-lg font-bold flex items-center gap-3 shadow-lg hover:shadow-xl transition-all active:scale-95 group"
                >
                  Save & Continue
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
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
