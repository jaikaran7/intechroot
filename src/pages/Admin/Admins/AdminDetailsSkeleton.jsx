function Pulse({ className = "" }) {
  return <div className={`animate-pulse rounded-md bg-slate-200/90 ${className}`} />;
}

/** Shown while admin record is loading — avoids placeholder names like "Admin". */
export default function AdminDetailsSkeleton() {
  return (
    <>
      <div className="flex-1 space-y-8 animate-pulse" aria-busy="true" aria-label="Loading admin details">
        <div className="flex items-center gap-2">
          <Pulse className="h-4 w-16" />
          <Pulse className="h-3 w-3 rounded-full" />
          <Pulse className="h-4 w-28" />
        </div>
        <div className="flex items-center justify-between">
          <Pulse className="h-9 w-48" />
          <div className="flex gap-3">
            <Pulse className="h-10 w-28" />
            <Pulse className="h-10 w-24" />
          </div>
        </div>

        <section className="glass-card p-8 rounded-full flex gap-8 items-start">
          <Pulse className="h-24 w-24 shrink-0 rounded-xl" />
          <div className="flex-1 grid grid-cols-2 gap-y-6 gap-x-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-2">
                <Pulse className="h-2 w-20" />
                <Pulse className="h-5 w-full max-w-xs" />
              </div>
            ))}
          </div>
        </section>

        <section className="bg-primary-container/80 rounded-full p-8 flex items-center gap-8">
          <Pulse className="h-16 w-20 bg-white/20" />
          <div className="flex-1 space-y-3">
            <Pulse className="h-6 w-48 bg-white/25" />
            <Pulse className="h-4 w-full max-w-lg bg-white/20" />
          </div>
        </section>

        <section className="glass-card rounded-full overflow-hidden">
          <div className="p-6 border-b border-outline-variant/10 flex justify-between">
            <Pulse className="h-6 w-40" />
            <Pulse className="h-9 w-36" />
          </div>
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Pulse className="h-9 w-9 rounded-lg" />
                <Pulse className="h-4 flex-1 max-w-md" />
                <Pulse className="h-4 w-24" />
              </div>
            ))}
          </div>
        </section>
      </div>

      <aside className="w-80 space-y-6 shrink-0 animate-pulse">
        <section className="glass-card p-6 rounded-full space-y-4">
          <Pulse className="h-4 w-32" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center gap-4">
              <div className="space-y-2 flex-1">
                <Pulse className="h-4 w-36" />
                <Pulse className="h-3 w-full max-w-[10rem]" />
              </div>
              <Pulse className="h-5 w-10 rounded-full" />
            </div>
          ))}
        </section>
        <section className="glass-card p-6 rounded-full space-y-3">
          <Pulse className="h-4 w-36" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between border-b border-outline-variant/10 pb-2">
              <Pulse className="h-3 w-28" />
              <Pulse className="h-5 w-8" />
            </div>
          ))}
        </section>
        <section className="glass-card p-6 rounded-full">
          <Pulse className="h-4 w-28 mb-4" />
          <div className="flex items-end justify-between h-24 gap-1">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Pulse key={i} className="h-full min-h-[2rem] flex-1 rounded-t-sm" />
            ))}
          </div>
        </section>
      </aside>
    </>
  );
}
