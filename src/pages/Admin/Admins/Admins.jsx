import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { adminPanelService } from "../../../services/adminPanel.service";

export default function Admins() {
  const clientCountQuery = useQuery({
    queryKey: ["admin-panel-admins-count", "client", "Active"],
    queryFn: async () => {
      const res = await adminPanelService.getAdmins({ kind: "client", status: "Active", limit: 1, page: 1 });
      return res.meta?.total ?? 0;
    },
    staleTime: 30_000,
  });

  const hrCountQuery = useQuery({
    queryKey: ["admin-panel-admins-count", "hr", "Active"],
    queryFn: async () => {
      const res = await adminPanelService.getAdmins({ kind: "hr", status: "Active", limit: 1, page: 1 });
      return res.meta?.total ?? 0;
    },
    staleTime: 30_000,
  });

  const clientCount = clientCountQuery.data ?? "—";
  const hrCount = hrCountQuery.data ?? "—";

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/60 backdrop-blur-xl border-b border-slate-200/50 flex items-center justify-between h-16 px-8 ml-64 max-w-[calc(100%-16rem)]" />

      <main className="ml-64 p-12 min-h-screen">
        <div className="w-full max-w-5xl">
          <h2 className="text-4xl font-extrabold tracking-tight text-primary font-headline">Admins</h2>
          <p className="text-on-surface-variant mt-2 max-w-xl leading-relaxed mb-10">
            Choose a directory to view active administrators, assignments, and permissions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link
              to="/admin/admins/client"
              className="group rounded-xl border border-outline-variant/15 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-8 hover:shadow-lg hover:border-secondary/30 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">
                    Client Admins
                  </p>
                  <p className="text-4xl font-black text-primary tabular-nums">{clientCount}</p>
                  <p className="text-sm text-on-surface-variant mt-2">Active client administrators</p>
                </div>
                <span className="material-symbols-outlined text-3xl text-sky-600 bg-sky-50 rounded-xl p-3 group-hover:scale-105 transition-transform">
                  business_center
                </span>
              </div>
              <div className="mt-8 flex items-center gap-2 text-sm font-bold text-secondary group-hover:text-primary">
                <span>Open directory</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </div>
            </Link>

            <Link
              to="/admin/admins/hr"
              className="group rounded-xl border border-outline-variant/15 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-8 hover:shadow-lg hover:border-violet-300/60 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">
                    HR Admins
                  </p>
                  <p className="text-4xl font-black text-primary tabular-nums">{hrCount}</p>
                  <p className="text-sm text-on-surface-variant mt-2">Active HR administrators</p>
                </div>
                <span className="material-symbols-outlined text-3xl text-violet-700 bg-violet-50 rounded-xl p-3 group-hover:scale-105 transition-transform">
                  badge
                </span>
              </div>
              <div className="mt-8 flex items-center gap-2 text-sm font-bold text-secondary group-hover:text-primary">
                <span>Open directory</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
