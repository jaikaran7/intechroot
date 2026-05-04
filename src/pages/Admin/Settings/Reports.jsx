export default function Reports() {
  return (
    <>
      <header className="fixed top-0 right-0 left-64 h-16 bg-white/60 backdrop-blur-xl z-40 flex items-center justify-between px-8 border-b border-slate-200/50 shadow-sm shadow-slate-200/20">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Next Phase</p>
          <h1 className="text-lg font-extrabold text-primary">Reports</h1>
        </div>
      </header>

      <main className="ml-64 pt-16 min-h-screen">
        <div className="p-12">
          <section className="glass-card mx-auto flex min-h-[520px] max-w-5xl flex-col items-center justify-center rounded-2xl p-12 text-center shadow-ambient">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-container text-tertiary-fixed">
              <span className="material-symbols-outlined text-4xl">assessment</span>
            </div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-secondary">Coming Soon</p>
            <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-primary">Reports are planned for the next phase</h2>
            <p className="max-w-2xl text-sm leading-6 text-on-surface-variant">
              Analytics, exports, regional performance, and executive report cards are intentionally disabled for now.
              This page does not fetch or display placeholder business metrics.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
