export default function Step2({ onNext, onBack }) {
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
            <div className="relative">
              <button
                type="button"
                className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-all active:scale-95 duration-200"
              >
                <span className="material-symbols-outlined text-slate-600">notifications</span>
              </button>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
            </div>
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
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOx1TCHOAhGWrDkBMMxkT3BRR8d0gsMkSiluzI5DWZLUTf3NQuysr2TdeBxaWWC7dVdhJugxLL9dM_2acgqFZ_8SiGXxhnvxwe8zHNEIRPWhRWnBiDdgysBxpP5y2AJVEXi8dOOrHJ8-jG4Hj4z0yr7l2pLTBmXJ-WiCpaWJAkFqK3xlw3_eK_3rT8cH3s7_aX-wNG2tZD2W5ksEoyQYqFdBTSYuzSRu4Km3f63nJqapxlKH5pYjeIv11z4MLhh6GQeGxlR7d1RZ2p"
              />
            </div>
          </div>
        </nav>
      </header>
      <main className="min-h-[calc(100vh-80px)] flex flex-col md:flex-row relative">
        <aside className="hidden md:flex flex-col h-[calc(100vh-80px)] w-64 border-r border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-20 overflow-y-auto py-6">
          <div className="px-6 mb-8">
            <h3 className="font-headline font-bold text-blue-950 dark:text-white text-lg">Recruitment Portal</h3>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-1">Enterprise Admin</p>
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
          <div className="px-6 mb-6">
            <button
              type="button"
              className="w-full bg-primary-container text-on-primary py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:scale-95 transition-all duration-200"
            >
              <span className="material-symbols-outlined text-sm">add</span> New Application
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
                <pattern height="40" id="onboarding-s2-grid" patternUnits="userSpaceOnUse" width="40">
                  <path
                    className="text-outline-variant"
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect fill="url(#onboarding-s2-grid)" height="100%" width="100%" />
            </svg>
          </div>
          <div className="relative z-10 max-w-5xl mx-auto">
            <div className="mb-16">
              <div className="max-w-3xl mb-12">
                <span className="text-secondary font-headline font-bold text-sm uppercase tracking-widest mb-4 block">Onboarding Journey</span>
                <h1 className="text-display-lg text-5xl md:text-6xl font-headline font-extrabold text-primary tracking-tighter leading-tight mb-4">
                  Required{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-tertiary-fixed-dim">Documents</span>
                </h1>
                <p className="text-slate-600 leading-relaxed max-w-2xl">
                  Ensure all digital assets are uploaded and valid for the upcoming technical screening. All documents must be clearly legible and
                  within their expiry dates.
                </p>
              </div>
              <div className="relative flex items-center justify-between w-full max-w-4xl mx-auto mb-16">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-surface-container-highest -translate-y-1/2 -z-10" />
                <div className="absolute top-1/2 left-0 w-[25%] h-1 bg-secondary -translate-y-1/2 -z-10 transition-all duration-500" />
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center shadow-lg mb-2">
                    <span className="material-symbols-outlined text-lg">check</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-secondary">Profile</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary-container text-white flex items-center justify-center shadow-xl border-4 border-white mb-2 scale-110">
                    <span className="font-headline font-bold">02</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-primary">Documents</span>
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
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">Completion</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-surface-container text-slate-400 flex items-center justify-center mb-2">
                    <span className="font-headline font-bold">05</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">Final Review</span>
                </div>
              </div>
            </div>
            <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_40px_-15px_rgba(11,31,58,0.06)] overflow-hidden border border-outline-variant/10">
              <div className="p-6 border-b border-surface-container flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative w-full md:w-96">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                  <input
                    className="w-full pl-12 pr-4 py-3 bg-surface-container-low border-none rounded-lg text-sm focus:ring-2 focus:ring-tertiary-fixed-dim transition-all"
                    placeholder="Filter documents..."
                    type="text"
                  />
                </div>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">add_circle</span>
                  Add New Document
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low/50">
                      <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-on-surface-variant">Document Name</th>
                      <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-on-surface-variant">Status</th>
                      <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-on-surface-variant">Expiry Date</th>
                      <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-on-surface-variant">Verification</th>
                      <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-on-surface-variant text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container">
                    <tr className="group hover:bg-surface-container-low transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center text-blue-600">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                              description
                            </span>
                          </div>
                          <div>
                            <p className="font-bold text-primary">Passport Copy</p>
                            <p className="text-xs text-on-surface-variant">PDF • 2.4 MB</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-800">
                          Uploaded
                        </span>
                      </td>
                      <td className="px-6 py-6 text-sm font-medium text-on-surface">Oct 12, 2028</td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-emerald-600">
                          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                            verified
                          </span>
                          <span className="text-xs font-bold uppercase tracking-tight">Verified</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button
                          type="button"
                          className="px-4 py-2 text-xs font-bold text-secondary border border-secondary rounded-lg hover:bg-secondary hover:text-white transition-all"
                        >
                          Replace
                        </button>
                      </td>
                    </tr>
                    <tr className="group hover:bg-surface-container-low transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded bg-rose-50 flex items-center justify-center text-rose-600">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                              badge
                            </span>
                          </div>
                          <div>
                            <p className="font-bold text-primary">Work Visa</p>
                            <p className="text-xs text-on-surface-variant">JPEG • 1.1 MB</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-rose-100 text-rose-800">
                          Expired
                        </span>
                      </td>
                      <td className="px-6 py-6 text-sm font-medium text-rose-600">Jan 15, 2024</td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-rose-600">
                          <span className="material-symbols-outlined text-sm">error</span>
                          <span className="text-xs font-bold uppercase tracking-tight">Rejected</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button type="button" className="px-4 py-2 text-xs font-bold bg-primary text-white rounded-lg hover:shadow-lg transition-all">
                          Re-upload
                        </button>
                      </td>
                    </tr>
                    <tr className="group hover:bg-surface-container-low transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-slate-400">
                            <span className="material-symbols-outlined">folder_zip</span>
                          </div>
                          <div>
                            <p className="font-bold text-primary">Educational Certs</p>
                            <p className="text-xs text-on-surface-variant">Required • ZIP</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-200 text-slate-600">
                          Not Uploaded
                        </span>
                      </td>
                      <td className="px-6 py-6 text-sm font-medium text-on-surface-variant">—</td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-on-surface-variant">
                          <span className="material-symbols-outlined text-sm">schedule</span>
                          <span className="text-xs font-bold uppercase tracking-tight">Waiting</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button
                          type="button"
                          className="px-4 py-2 text-xs font-bold bg-primary-container text-on-primary rounded-lg hover:scale-105 transition-all"
                        >
                          Upload
                        </button>
                      </td>
                    </tr>
                    <tr className="group hover:bg-surface-container-low transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded bg-amber-50 flex items-center justify-center text-amber-600">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                              account_balance
                            </span>
                          </div>
                          <div>
                            <p className="font-bold text-primary">Tax Identification</p>
                            <p className="text-xs text-on-surface-variant">PDF • 850 KB</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-800">
                          Uploaded
                        </span>
                      </td>
                      <td className="px-6 py-6 text-sm font-medium text-on-surface">N/A</td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-amber-600">
                          <span className="material-symbols-outlined text-sm">sync</span>
                          <span className="text-xs font-bold uppercase tracking-tight italic">Waiting</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button
                          type="button"
                          className="px-4 py-2 text-xs font-bold text-secondary border border-secondary rounded-lg hover:bg-secondary hover:text-white transition-all"
                        >
                          Replace
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-6 bg-surface-container-low/30 flex items-center justify-between">
                <p className="text-xs font-medium text-on-surface-variant">Showing 4 of 4 documents</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="p-2 border border-outline-variant/30 rounded bg-white text-on-surface-variant hover:bg-slate-50 disabled:opacity-50"
                    disabled
                  >
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </button>
                  <button
                    type="button"
                    className="p-2 border border-outline-variant/30 rounded bg-white text-on-surface-variant hover:bg-slate-50"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
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
                Back to Profile
              </button>
              <div className="flex items-center gap-6">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Step Progress</span>
                  <span className="text-sm font-bold text-primary">25% Complete</span>
                </div>
                <button
                  type="button"
                  onClick={onNext}
                  className="bg-primary-container text-white px-10 py-4 rounded-lg font-bold hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                  Next Step: Verification
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
