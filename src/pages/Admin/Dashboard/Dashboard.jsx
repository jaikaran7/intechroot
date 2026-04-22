import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "../../../services/admin.service";
import PageSkeleton from "../../../components/PageSkeleton";
import ErrorState from "../../../components/ErrorState";
import EntityAvatar from "@/components/shared/EntityAvatar";
import { useAuthStore } from "@/store/authStore";
import { formatAppliedDateDisplay } from "@/utils/applicantDisplayHelpers";

const LIFECYCLE_LABEL = {
  applied: "Applied",
  screening: "Screening",
  technical: "Technical",
  client: "Client interview",
  offer: "Offer",
  onboarding: "Onboarding",
  employee: "Hired",
};

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  const { data: stats, isLoading, isError, refetch } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: adminService.getDashboardStats,
    staleTime: 60_000,
  });

  const pipeline = stats?.pipeline ?? {};
  const deptMap = stats?.employees?.byDepartment ?? {};

  const pipelineData = useMemo(() => {
    const sourcedTotal = pipeline.total ?? 0;
    const screeningTotal = (pipeline.screening ?? 0) + (pipeline.technical ?? 0) + (pipeline.client ?? 0) + (pipeline.offer ?? 0) + (pipeline.hired ?? 0);
    const evaluationTotal = (pipeline.technical ?? 0) + (pipeline.client ?? 0) + (pipeline.offer ?? 0) + (pipeline.hired ?? 0);
    const offerTotal = (pipeline.offer ?? 0) + (pipeline.hired ?? 0);
    const hiredTotal = pipeline.hired ?? 0;

    const itEngineeringDepts = ["Engineering", "Infrastructure", "Development", "Security", "Quality", "Analytics"];
    const itCount = Object.entries(deptMap).filter(([d]) => itEngineeringDepts.includes(d)).reduce((s, [, c]) => s + c, 0);
    const stratCount = deptMap["Strategy"] ?? 0;
    const totalEmp = Object.values(deptMap).reduce((s, c) => s + c, 0);
    const corpCount = Math.max(0, totalEmp - itCount - stratCount);

    const weights = totalEmp === 0 ? [1 / 3, 1 / 3, 1 / 3] : [itCount / totalEmp, stratCount / totalEmp, corpCount / totalEmp];
    const alloc = (total, w) => Math.round(total * w);

    return [
      { department: "IT & Engineering", sourced: alloc(sourcedTotal, weights[0]), screening: alloc(screeningTotal, weights[0]), evaluation: alloc(evaluationTotal, weights[0]), offer: alloc(offerTotal, weights[0]), hired: alloc(hiredTotal, weights[0]) },
      { department: "Strategic Consulting", sourced: alloc(sourcedTotal, weights[1]), screening: alloc(screeningTotal, weights[1]), evaluation: alloc(evaluationTotal, weights[1]), offer: alloc(offerTotal, weights[1]), hired: alloc(hiredTotal, weights[1]) },
      { department: "Corporate Operations", sourced: alloc(sourcedTotal, weights[2]), screening: alloc(screeningTotal, weights[2]), evaluation: alloc(evaluationTotal, weights[2]), offer: alloc(offerTotal, weights[2]), hired: alloc(hiredTotal, weights[2]) },
    ];
  }, [pipeline, deptMap]);

  const recentApplications = stats?.recentApplications ?? [];

  const pipelineDepartments = useMemo(
    () => ["All", ...pipelineData.map((item) => item.department)],
    [pipelineData],
  );

  const pipelineMetrics = useMemo(() => {
    const filteredData =
      selectedDepartment === "All"
        ? pipelineData
        : pipelineData.filter((item) => item.department === selectedDepartment);

    const totals = filteredData.reduce(
      (acc, item) => {
        acc.sourced += item.sourced;
        acc.screening += item.screening;
        acc.evaluation += item.evaluation;
        acc.offer += item.offer;
        acc.hired += item.hired;
        return acc;
      },
      { sourced: 0, screening: 0, evaluation: 0, offer: 0, hired: 0 },
    );

    const sourcedBase = totals.sourced || 1;
    return {
      totals,
      percentages: {
        sourced: totals.sourced > 0 ? 100 : 0,
        screening: Math.round((totals.screening / sourcedBase) * 100),
        evaluation: Math.round((totals.evaluation / sourcedBase) * 100),
        offer: Math.round((totals.offer / sourcedBase) * 100),
        hired: Math.round((totals.hired / sourcedBase) * 100),
      },
    };
  }, [pipelineData, selectedDepartment]);

  if (isLoading) return <PageSkeleton />;
  if (isError) return <ErrorState message="Failed to load dashboard." onRetry={refetch} />;

  return (
    <>
      <header className="sticky top-0 z-40 w-full flex items-center justify-between h-16 px-8 ml-64 bg-white/60 backdrop-blur-xl border-b border-slate-200/50 shadow-sm shadow-slate-200/20">
      <div className="flex items-center gap-4 flex-1">
      <div className="relative w-full max-w-md group">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
      <input className="w-full bg-surface-container-low border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#4cd7f6]/20 transition-all placeholder:text-slate-400" placeholder="Search operations, employees, or reports..." type="text"/>
      </div>
      </div>
      <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
      <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-all">
      <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
      </button>
      <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-all">
      <span className="material-symbols-outlined" data-icon="help_outline">help_outline</span>
      </button>
      </div>
      <div className="h-8 w-[1px] bg-slate-200"></div>
      <div className="flex items-center gap-3">
      <div className="text-right">
      <p className="text-xs font-bold text-primary leading-tight">{user?.name || "Admin"}</p>
      <p className="text-[10px] text-on-primary-container leading-tight">
        {(user?.role && String(user.role).replace(/_/g, " ")) || "Administrator"}
      </p>
      </div>
      <EntityAvatar name={user?.name || user?.email || "Admin"} size="md" className="border-2 border-white shadow-sm" />
      </div>
      </div>
      </header>

      <main className="ml-64 p-8 min-h-screen">

      <section className="mb-10 flex items-end justify-between">
      <div className="max-w-2xl">
      <span className="text-secondary font-bold text-xs tracking-widest uppercase mb-2 block">System Overview</span>
      <h2 className="text-4xl font-extrabold font-headline text-primary tracking-tight">Executive Dashboard</h2>
      <p className="text-on-surface-variant mt-2 text-lg">Real-time enterprise metrics for Q4 operations and human capital management.</p>
      </div>
      <div className="flex gap-3">
      <button className="px-6 py-2.5 bg-white border border-outline-variant text-primary font-bold rounded-lg shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
      <span className="material-symbols-outlined text-sm">download</span> Export Report
                      </button>
      <button className="px-6 py-2.5 bg-primary-container text-white font-bold rounded-lg shadow-md hover:translate-y-[-2px] transition-all flex items-center gap-2">
      <span className="material-symbols-outlined text-sm">add</span> New Placement
                      </button>
      </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">

      <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/15 shadow-[0_40px_40px_-20px_rgba(0,6,21,0.04)] relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
      <span className="material-symbols-outlined text-8xl" style={{fontVariationSettings: "'FILL' 1"}}>person_search</span>
      </div>
      <div className="relative z-10">
      <div className="w-12 h-12 bg-secondary-fixed flex items-center justify-center rounded-lg mb-6">
      <span className="material-symbols-outlined text-on-secondary-container" style={{fontVariationSettings: "'FILL' 1"}}>person_search</span>
      </div>
      <p className="text-on-surface-variant font-medium text-sm">Active Applicants</p>
      <h3 className="text-5xl font-extrabold font-headline text-primary my-2">1,284</h3>
      <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold mt-4">
      <span className="material-symbols-outlined text-xs">trending_up</span>
      <span>+12.4% this month</span>
      </div>
      </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/15 shadow-[0_40px_40px_-20px_rgba(0,6,21,0.04)] relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
      <span className="material-symbols-outlined text-8xl" style={{fontVariationSettings: "'FILL' 1"}}>group</span>
      </div>
      <div className="relative z-10">
      <div className="w-12 h-12 bg-tertiary-fixed flex items-center justify-center rounded-lg mb-6">
      <span className="material-symbols-outlined text-on-tertiary-fixed-variant" style={{fontVariationSettings: "'FILL' 1"}}>group</span>
      </div>
      <p className="text-on-surface-variant font-medium text-sm">Managed Workforce</p>
      <h3 className="text-5xl font-extrabold font-headline text-primary my-2">4,902</h3>
      <div className="flex items-center gap-2 text-slate-500 text-sm font-bold mt-4">
      <span className="material-symbols-outlined text-xs">remove</span>
      <span>Stable utilization</span>
      </div>
      </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/15 shadow-[0_40px_40px_-20px_rgba(0,6,21,0.04)] relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
      <span className="material-symbols-outlined text-8xl" style={{fontVariationSettings: "'FILL' 1"}}>account_balance_wallet</span>
      </div>
      <div className="relative z-10">
      <div className="w-12 h-12 bg-primary-fixed flex items-center justify-center rounded-lg mb-6">
      <span className="material-symbols-outlined text-on-primary-fixed-variant" style={{fontVariationSettings: "'FILL' 1"}}>account_balance_wallet</span>
      </div>
      <p className="text-on-surface-variant font-medium text-sm">Pending Payroll</p>
      <h3 className="text-5xl font-extrabold font-headline text-primary my-2">$428K</h3>
      <div className="flex items-center gap-2 text-error text-sm font-bold mt-4">
      <span className="material-symbols-outlined text-xs">warning</span>
      <span>Due in 48 hours</span>
      </div>
      </div>
      </div>
      </div>

      <div className="grid grid-cols-12 gap-8">

      <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/15 shadow-[0_40px_40px_-20px_rgba(0,6,21,0.04)]">
      <div className="flex items-center justify-between mb-8">
      <h4 className="text-xl font-bold font-headline text-primary">Recruitment Pipeline</h4>
      <select className="bg-surface-container border-none text-sm rounded-lg py-1 px-3 focus:ring-0" value={selectedDepartment} onChange={(event) => setSelectedDepartment(event.target.value)}>
      {pipelineDepartments.map((department) => (
        <option key={department} value={department}>
          {department === "All" ? "All Departments" : department}
        </option>
      ))}
      </select>
      </div>
      <div className="flex items-end gap-2 h-64">

      <div className="flex-1 flex flex-col justify-end gap-3 group h-full">
      <div className="bg-primary-container/10 w-full h-full rounded-t-lg relative flex flex-col justify-end items-center pb-4 transition-all group-hover:bg-primary-container/20">
      <div className="bg-primary-container w-full h-[100%] rounded-t-lg flex items-center justify-center">
      <span className="text-white text-xs font-bold">{pipelineMetrics.percentages.sourced}%</span>
      </div>
      </div>
      <p className="text-center text-[10px] uppercase font-bold text-slate-400 tracking-wider">Sourced</p>
      </div>

      <div className="flex-1 flex flex-col justify-end gap-3 group h-full">
      <div className="bg-primary-container/10 w-full h-full rounded-t-lg relative flex flex-col justify-end items-center pb-4 transition-all group-hover:bg-primary-container/20">
      <div className="bg-secondary-container w-full rounded-t-lg flex items-center justify-center" style={{ height: `${pipelineMetrics.percentages.screening}%` }}>
      <span className="text-white text-xs font-bold">{pipelineMetrics.percentages.screening}%</span>
      </div>
      </div>
      <p className="text-center text-[10px] uppercase font-bold text-slate-400 tracking-wider">Screening</p>
      </div>

      <div className="flex-1 flex flex-col justify-end gap-3 group h-full">
      <div className="bg-primary-container/10 w-full h-full rounded-t-lg relative flex flex-col justify-end items-center pb-4 transition-all group-hover:bg-primary-container/20">
      <div className="bg-secondary w-full rounded-t-lg flex items-center justify-center" style={{ height: `${pipelineMetrics.percentages.evaluation}%` }}>
      <span className="text-white text-xs font-bold">{pipelineMetrics.percentages.evaluation}%</span>
      </div>
      </div>
      <p className="text-center text-[10px] uppercase font-bold text-slate-400 tracking-wider">Evaluation</p>
      </div>

      <div className="flex-1 flex flex-col justify-end gap-3 group h-full">
      <div className="bg-primary-container/10 w-full h-full rounded-t-lg relative flex flex-col justify-end items-center pb-4 transition-all group-hover:bg-primary-container/20">
      <div className="bg-tertiary-fixed-dim w-full rounded-t-lg flex items-center justify-center" style={{ height: `${pipelineMetrics.percentages.offer}%` }}>
      <span className="text-primary-container text-xs font-bold">{pipelineMetrics.percentages.offer}%</span>
      </div>
      </div>
      <p className="text-center text-[10px] uppercase font-bold text-slate-400 tracking-wider">Offer</p>
      </div>

      <div className="flex-1 flex flex-col justify-end gap-3 group h-full">
      <div className="bg-primary-container/10 w-full h-full rounded-t-lg relative flex flex-col justify-end items-center pb-4 transition-all group-hover:bg-primary-container/20">
      <div className="bg-emerald-400 w-full rounded-t-lg flex items-center justify-center" style={{ height: `${pipelineMetrics.percentages.hired}%` }}>
      <span className="text-emerald-900 text-[10px] font-black">{pipelineMetrics.percentages.hired}%</span>
      </div>
      </div>
      <p className="text-center text-[10px] uppercase font-bold text-slate-400 tracking-wider">Hired</p>
      </div>
      </div>
      </div>

      <div className="col-span-12 lg:col-span-4 bg-primary-container rounded-xl p-8 text-white relative overflow-hidden shadow-2xl">

      <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 blur-[100px] -mr-32 -mt-32 rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-tertiary-fixed-dim/10 blur-[80px] -ml-24 -mb-24 rounded-full"></div>
      <div className="relative z-10 h-full flex flex-col">
      <h4 className="text-lg font-bold font-headline mb-1">Payroll Efficiency</h4>
      <p className="text-on-primary-container text-xs mb-8">Operational overhead analysis</p>
      <div className="flex-1 flex items-center justify-center">
      <div className="relative w-40 h-40">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
      <circle className="text-white/10" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="12"></circle>
      <circle className="text-tertiary-fixed-dim" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="60" strokeLinecap="round" strokeWidth="12"></circle>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
      <span className="text-3xl font-extrabold font-headline">76%</span>
      <span className="text-[10px] uppercase tracking-tighter opacity-60">Optimized</span>
      </div>
      </div>
      </div>
      <div className="mt-auto pt-6 space-y-3">
      <div className="flex items-center justify-between text-sm">
      <span className="opacity-70">Salaries &amp; Wages</span>
      <span className="font-bold">$384,200</span>
      </div>
      <div className="flex items-center justify-between text-sm">
      <span className="opacity-70">Contractor Fees</span>
      <span className="font-bold">$112,900</span>
      </div>
      <div className="w-full h-[1px] bg-white/10 my-2"></div>
      <button className="w-full py-2 bg-white/10 hover:bg-white/20 transition-all rounded-lg text-xs font-bold uppercase tracking-widest" onClick={() => navigate("/admin/reports")}>Open Analytics</button>
      </div>
      </div>
      </div>

      <div className="col-span-12 bg-surface-container-lowest rounded-xl border border-outline-variant/15 shadow-[0_40px_40px_-20px_rgba(0,6,21,0.04)] overflow-hidden">
      <div className="p-8 border-b border-slate-50 flex items-center justify-between">
      <div>
      <h4 className="text-xl font-bold font-headline text-primary">Recent Talent Pipeline</h4>
      <p className="text-on-surface-variant text-sm mt-1">Reviewing candidates from high-priority enterprise roles.</p>
      </div>
      <button className="text-secondary font-bold text-sm hover:underline cursor-pointer" onClick={() => navigate("/admin/applications")}>View All Candidates</button>
      </div>
      <div className="overflow-x-auto">
      <table className="w-full text-left">
      <thead>
      <tr className="bg-surface-container-low/50">
      <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Candidate</th>
      <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Applied Role</th>
      <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Status</th>
      <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Applied</th>
      <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Actions</th>
      </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
      {recentApplications.length === 0 ? (
      <tr>
      <td className="px-8 py-8 text-sm text-on-surface-variant" colSpan={5}>
      No applications in the database yet.
      </td>
      </tr>
      ) : (
      recentApplications.map((row) => {
      const stageLabel = LIFECYCLE_LABEL[row.lifecycleStage] || row.lifecycleStage || "—";
      return (
      <tr className="hover:bg-slate-50 transition-all group" key={row.id}>
      <td className="px-8 py-5">
      <div className="flex items-center gap-3">
      <EntityAvatar name={row.name} size="md" />
      <div className="min-w-0">
      <Link className="text-sm font-bold text-primary hover:text-secondary hover:underline" to={`/admin/applications/${row.id}`}>
      {row.name}
      </Link>
      <p className="text-[11px] text-slate-400 truncate">{row.location?.trim() || "—"}</p>
      </div>
      </div>
      </td>
      <td className="px-8 py-5">
      <p className="text-sm text-on-surface">{row.role || "—"}</p>
      </td>
      <td className="px-8 py-5">
      <span className="inline-flex max-w-full flex-wrap items-center rounded-full bg-surface-container-high px-2.5 py-0.5 text-xs font-medium text-on-surface-variant">
      {stageLabel}
      </span>
      </td>
      <td className="px-8 py-5">
      <span className="text-xs text-on-surface-variant">{formatAppliedDateDisplay(row.appliedDate)}</span>
      </td>
      <td className="px-8 py-5">
      <Link className="text-xs font-bold text-secondary hover:underline" to={`/admin/applications/${row.id}`}>
      View
      </Link>
      </td>
      </tr>
      );
      })
      )}
      </tbody>
      </table>
      </div>
      </div>
      </div>

      <footer className="mt-12 flex items-center justify-between px-4 pb-8">
      <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
      <span className="text-xs text-slate-500 font-medium">Core Engine Stable</span>
      </div>
      <div className="flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-slate-300"></span>
      <span className="text-xs text-slate-500 font-medium">Last Sync: 2m ago</span>
      </div>
      </div>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">© 2024 InTechRoot Enterprise v4.2.0-Alpha</p>
      </footer>
      </main>
    </>
  );
}
