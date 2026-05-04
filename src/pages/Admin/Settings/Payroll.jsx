export default function Payroll() {
  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/60 backdrop-blur-xl border-b border-slate-200/50 shadow-sm shadow-slate-200/20 flex items-center justify-between h-16 px-8 ml-64">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Next Phase</p>
          <h1 className="text-lg font-extrabold text-primary">Payroll</h1>
        </div>
      </header>

      <main className="ml-64 p-12 min-h-[calc(100vh-64px)]">
        <section className="glass-card mx-auto flex min-h-[520px] max-w-5xl flex-col items-center justify-center rounded-2xl p-12 text-center shadow-ambient">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-container text-tertiary-fixed">
            <span className="material-symbols-outlined text-4xl">payments</span>
          </div>
          <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-secondary">Coming Soon</p>
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-primary">Payroll will arrive in the next phase</h2>
          <p className="max-w-2xl text-sm leading-6 text-on-surface-variant">
            Payroll dashboards, pay cycles, exports, and transaction data are intentionally paused for now. No payroll
            data is fetched or shown until this module is activated.
          </p>
        </section>
      </main>
    </>
  );
}
