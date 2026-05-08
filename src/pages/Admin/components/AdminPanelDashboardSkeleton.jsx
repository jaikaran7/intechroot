/** Pulse placeholders for Admin Control (locked admin panel) while dashboard API loads. */

function Bar({ className = "" }) {
  return <div className={`animate-pulse rounded-md bg-slate-200/80 dark:bg-white/10 ${className}`} />;
}

export default function AdminPanelDashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-8" aria-busy="true" aria-label="Loading dashboard">
      <div className="mb-10 flex items-end">
        <div className="space-y-2">
          <Bar className="h-3 w-40" />
          <Bar className="h-10 w-64" />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 mb-12">
        <div className="col-span-12 lg:col-span-8 glass-card rounded-xl p-8 flex flex-wrap items-center gap-8 md:justify-between">
          <div className="flex items-center gap-8">
            <Bar className="h-24 w-24 shrink-0 rounded-xl" />
            <div className="space-y-3 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <Bar className="h-8 w-48 max-w-full" />
                <Bar className="h-6 w-16 rounded-full" />
              </div>
              <Bar className="h-4 w-56 max-w-full" />
              <div className="flex gap-8 pt-2">
                <div className="space-y-2">
                  <Bar className="h-2 w-16" />
                  <Bar className="h-4 w-28" />
                </div>
                <div className="space-y-2">
                  <Bar className="h-2 w-12" />
                  <Bar className="h-4 w-24" />
                </div>
              </div>
            </div>
          </div>
          <div className="hidden md:block h-16 w-px bg-outline-variant/20 shrink-0" />
          <div className="flex flex-col items-end gap-2 w-full md:w-auto">
            <Bar className="h-12 w-20" />
            <Bar className="h-4 w-44" />
            <Bar className="h-3 w-52 max-w-full" />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 glass-card rounded-xl p-8 space-y-4">
          <div className="flex justify-between">
            <div className="space-y-2">
              <Bar className="h-2 w-28" />
              <Bar className="h-6 w-36" />
            </div>
            <Bar className="h-8 w-8 rounded-lg shrink-0" />
          </div>
          <div className="flex justify-between items-center">
            <Bar className="h-4 w-36" />
            <Bar className="h-4 w-8" />
          </div>
          <Bar className="h-1.5 w-full rounded-full" />
          <Bar className="h-3 w-full max-w-xs" />
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-8 py-6 border-b border-outline-variant/10">
          <Bar className="h-6 w-48" />
        </div>
        <div className="px-8 py-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-b border-outline-variant/5 last:border-0">
              <Bar className="h-10 w-10 rounded-full shrink-0" />
              <Bar className="h-4 flex-1 max-w-xs" />
              <Bar className="h-4 w-40 hidden sm:block" />
              <Bar className="h-4 w-24 hidden md:block" />
              <Bar className="h-4 w-16 hidden lg:block" />
              <Bar className="h-4 w-12 ml-auto" />
            </div>
          ))}
        </div>
        <div className="px-8 py-4 bg-surface-container-low/30 border-t border-outline-variant/10">
          <Bar className="h-3 w-64" />
        </div>
      </div>
    </div>
  );
}
