import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Card from "./Card";
import { jobsService } from "../services/jobs.service";
import { presentJobForFeatured } from "../pages/Careers/utils/presentJob";

/**
 * Floating hero card — shows the first featured role from the careers pipeline.
 * @param {"home" | "services"} variant
 */
export default function FeaturedRoleSpotlightCard({ variant = "home" }) {
  const { data } = useQuery({
    queryKey: ["jobs", { status: "Active", spotlight: true }],
    queryFn: () => jobsService.getAll({ status: "Active", limit: 100 }),
    staleTime: 300_000,
  });

  const role = useMemo(() => {
    const list = Array.isArray(data?.data) ? data.data : [];
    const featured = list.filter((j) => Boolean(j.featured));
    const first = featured[0];
    if (!first) return null;
    return { raw: first, ...presentJobForFeatured(first, 0) };
  }, [data]);

  if (!role) return null;

  const applyTo = {
    pathname: "/careers",
    search: `?jobId=${encodeURIComponent(role.id)}&jobTitle=${encodeURIComponent(role.title)}`,
    hash: "#apply",
  };

  if (variant === "services") {
    return (
      <Card className="glass-card absolute -top-12 -left-8 p-6 rounded-xl w-64 z-20 hover:scale-105 transition-transform">
        <Link to={applyTo} className="block no-underline text-inherit">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-surface-container-high border border-outline-variant/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl text-secondary">{role.icon}</span>
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold truncate">{role.title}</div>
              <div className="text-[10px] text-on-primary-container uppercase font-bold tracking-tighter truncate">
                {role.location}
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className={`${role.badgeClass} px-2 py-1 rounded-sm text-[10px] font-bold`}>{role.badgeText}</span>
            <span className="px-2 py-1 rounded-sm bg-secondary/10 text-secondary text-[10px] font-bold">FEATURED</span>
          </div>
        </Link>
      </Card>
    );
  }

  return (
    <div className="absolute -top-12 -left-16 z-30 floating-element" style={{ animationDelay: "0s" }}>
      <Card className="glass-card px-8 py-6 rounded-3xl w-72 border-white/40 shadow-2xl hover:scale-110 transition-transform">
        <Link to={applyTo} className="block no-underline text-inherit">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-secondary via-secondary to-tertiary-fixed-dim p-[2px] shadow-lg shrink-0">
              <div className="w-full h-full rounded-[14px] bg-white/90 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-secondary">{role.icon}</span>
              </div>
            </div>
            <div className="min-w-0">
              <div className="text-sm font-black text-primary line-clamp-2">{role.title}</div>
              <div className="text-[10px] text-secondary font-black uppercase tracking-widest mt-1 truncate">
                {role.location}
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4 flex-wrap">
            <span className={`${role.badgeClass} px-2 py-1 rounded-sm text-[10px] font-bold`}>{role.badgeText}</span>
            <span className="px-2 py-1 rounded-sm bg-secondary/10 text-secondary text-[10px] font-bold">FEATURED</span>
          </div>
        </Link>
      </Card>
    </div>
  );
}
