/** Converted from application_process/admin_final_approval/code.html — main canvas only. */

export default function AdminFinalApproval({ application, onFinalHire, hireMessage }) {
  const app = application || {};

  return (
    <main className="flex-1 px-8 py-12 bg-surface w-full max-w-full">
      <div className="max-w-4xl mx-auto mb-12">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-surface-container -z-10 -translate-y-1/2" />
          <div
            className="absolute top-1/2 left-0 h-[2px] bg-gradient-to-r from-primary-container to-primary-container -z-10 -translate-y-1/2"
            style={{ width: "100%" }}
          />
          <div className="flex flex-col items-center gap-3 bg-surface px-4">
            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>
            <span className="text-xs font-bold font-headline text-primary uppercase tracking-widest">Profiling</span>
          </div>
          <div className="flex flex-col items-center gap-3 bg-surface px-4">
            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>
            <span className="text-xs font-bold font-headline text-primary uppercase tracking-widest">Documentation</span>
          </div>
          <div className="flex flex-col items-center gap-3 bg-surface px-4">
            <div className="w-12 h-12 rounded-full border-4 border-primary-container bg-surface-container-lowest text-primary flex items-center justify-center shadow-xl ring-8 ring-blue-50">
              <span className="material-symbols-outlined text-xl font-bold">verified</span>
            </div>
            <span className="text-xs font-bold font-headline text-primary-container uppercase tracking-widest">Final Approval</span>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mb-10 flex justify-between items-end">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-headline font-extrabold text-primary tracking-tighter mb-4">Onboarding Completion Review</h1>
          <p className="text-on-surface-variant leading-relaxed">
            Review the final verification summary for <span className="font-semibold text-primary">{app.name || "Candidate"}</span> (
            {app.role || "Role"}). All automated background checks and manual document audits should be complete.
          </p>
        </div>
        <div className="flex gap-4">
          <button type="button" className="px-6 h-12 border border-outline-variant/30 text-primary font-bold text-sm tracking-tight rounded hover:bg-slate-50 transition-all">
            View Dossier
          </button>
        </div>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-6 items-start">
        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-8 rounded-xl relative overflow-hidden signature-glow">
            <div className="flex justify-between items-start mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-secondary font-label">Profile Status</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-[10px] font-bold rounded uppercase tracking-tighter">Verified</span>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <img
                alt="Candidate Photo"
                className="w-20 h-20 rounded-xl object-cover shadow-md"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlj9mBwoOnyBeG8PFNWmkDwhW6XDoajMZGFq1P-3OAe6qeTwuIIdh6NemcPnCprND4tMEcEoj0eOAPrL3XYTDTcVsTDGS52y0uuOpKH6N5bJFY75YvL2_i7IDmASsRKzFaGJo8mRKOXwE5eee1DnGS0PmxgwFC7xH52n7aQsYl2CIH_6o71_pBvhFmomHcv_MxG0_cHscBOtDe-no-nvfwe2jx0DhE4jfREMDk9cFbl_bqqSPblDV_lJO8Mq1ll-AET-vXGnh8WEua"
              />
              <div>
                <h3 className="font-headline font-bold text-lg text-primary">{app.name || "—"}</h3>
                <p className="text-sm text-on-surface-variant">{app.email || "—"}</p>
                <p className="text-sm font-medium text-secondary mt-1">{app.location || "—"}</p>
              </div>
            </div>
            <div className="space-y-3 pt-4 border-t border-outline-variant/10">
              <div className="flex justify-between text-xs">
                <span className="text-on-surface-variant">Experience Match</span>
                <span className="font-bold text-primary">98%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary-container h-full" style={{ width: "98%" }} />
              </div>
            </div>
          </div>
          <div className="glass-card p-8 rounded-xl">
            <div className="flex justify-between items-start mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-secondary font-label">Document Audit</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-[10px] font-bold rounded uppercase tracking-tighter">Approved</span>
            </div>
            <div className="space-y-4">
              {["Work Authorization", "Academic Credentials", "Government ID", "Bank Information"].map((label) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary text-xl">description</span>
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                  <span className="material-symbols-outlined text-green-600 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-2 glass-card p-8 rounded-xl">
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-secondary font-label">Background Verification (BGV)</span>
                <h2 className="text-xl font-headline font-bold text-primary mt-1">Screening Summary</h2>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-black text-on-surface-variant block mb-1">Risk Rating</span>
                <span className="text-2xl font-headline font-black text-green-600 tracking-tighter">CLEAR</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Criminal Record</p>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-600 text-lg">shield</span>
                  <span className="text-sm font-bold text-primary">No Records Found</span>
                </div>
                <p className="text-[10px] text-slate-500">Global & Local Database Check</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Past Employment</p>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-600 text-lg">work_history</span>
                  <span className="text-sm font-bold text-primary">Verified (8 years)</span>
                </div>
                <p className="text-[10px] text-slate-500">Confirmed with 3 former employers</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Reference Check</p>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-600 text-lg">recommend</span>
                  <span className="text-sm font-bold text-primary">Highly Recommended</span>
                </div>
                <p className="text-[10px] text-slate-500">All 3 references responded positive</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4 sticky top-32">
          <div className="bg-primary-container rounded-xl p-8 text-on-primary-container shadow-2xl relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
            <h2 className="text-2xl font-headline font-bold text-white mb-2">Ready for Decision</h2>
            <p className="text-blue-100/70 text-sm leading-relaxed mb-8">
              This candidate has passed compliance checkpoints for the role. Transitioning to &apos;Employee&apos; status will trigger asset provisioning
              and system access.
            </p>
            <div className="space-y-4">
              <button
                type="button"
                onClick={onFinalHire}
                className="w-full h-14 bg-white text-primary-container font-black text-sm uppercase tracking-widest rounded shadow-xl hover:scale-[1.02] transition-transform active:scale-95 duration-200 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">person_add</span>
                Approve & Move to Employee
              </button>
              <button
                type="button"
                className="w-full h-14 bg-transparent border border-white/20 text-white font-bold text-sm uppercase tracking-widest rounded hover:bg-white/5 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">cancel</span>
                Reject Application
              </button>
            </div>
            {hireMessage ? <p className="mt-4 text-xs text-white/90">{hireMessage}</p> : null}
            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-400/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm text-blue-200">lock</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tighter text-blue-100">Authenticated Admin Session Required</span>
              </div>
            </div>
          </div>
          <div className="mt-6 p-6 glass-card rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-secondary">info</span>
              <h4 className="text-sm font-bold text-primary">Post-Approval Steps</h4>
            </div>
            <ul className="space-y-3">
              <li className="flex gap-3 text-xs text-on-surface-variant">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1 shrink-0" />
                Corporate email creation
              </li>
              <li className="flex gap-3 text-xs text-on-surface-variant">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1 shrink-0" />
                Laptop & peripheral shipping request
              </li>
              <li className="flex gap-3 text-xs text-on-surface-variant">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1 shrink-0" />
                Welcome package automated dispatch
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
