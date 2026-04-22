import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { jobsService } from "../../services/jobs.service";
import HeroSection from "./components/HeroSection";
import FiltersSection from "./components/FiltersSection";
import JobListSection, { FeaturedRolesSection } from "./components/JobListSection";
import JobDetailModal from "./components/JobDetailModal";
import SiteFooter from "../../components/SiteFooter";
import ApplyTalentPipeline from "../Apply/components/ApplyTalentPipeline";
import "../Apply/apply.css";
import "./careers.css";

export default function CareersPage() {
  const location = useLocation();
  const { data: apiData, isLoading, isError, refetch } = useQuery({
    queryKey: ['jobs', { status: 'Active' }],
    queryFn: () => jobsService.getAll({ status: 'Active', limit: 100 }),
    staleTime: 300_000,
  });
  const jobs = useMemo(() => {
    const list = apiData?.data;
    return Array.isArray(list) ? list : [];
  }, [apiData]);

  /** Empty filter group = show all (no restriction on that axis). */
  const [filters, setFilters] = useState({ category: [], seniority: [], jobType: [] });
  const [searchTerm, setSearchTerm] = useState("");
  const filtersSeededRef = useRef(false);

  const uniqueInOrder = (values) => {
    const out = [];
    for (const v of values) if (v != null && v !== "" && !out.includes(v)) out.push(v);
    return out;
  };

  useEffect(() => {
    if (!jobs.length || filtersSeededRef.current) return;
    filtersSeededRef.current = true;
    setFilters({
      category: uniqueInOrder(jobs.map((j) => j.category || j.sector)),
      seniority: uniqueInOrder(jobs.map((j) => j.seniority)),
      jobType: uniqueInOrder(jobs.map((j) => j.jobType || j.type)),
    });
  }, [jobs]);

  const [detailJob, setDetailJob] = useState(null);

  const featuredJobs = useMemo(() => jobs.filter((j) => Boolean(j.featured)).slice(0, 6), [jobs]);

  const filteredJobs = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return jobs.filter((job) => {
      const cat = job.category || job.sector;
      const jt = job.jobType || job.type;
      if (filters.category.length > 0 && !filters.category.includes(cat)) return false;
      if (filters.seniority.length > 0 && !filters.seniority.includes(job.seniority)) return false;
      if (filters.jobType.length > 0 && !filters.jobType.includes(jt)) return false;
      if (!term) return true;
      const hay = [
        job.title,
        job.category,
        job.sector,
        job.location,
        job.description,
        ...(Array.isArray(job.skills) ? job.skills : []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(term);
    });
  }, [jobs, filters, searchTerm]);

  useEffect(() => {
    document.body.className = "bg-background font-body text-on-surface selection:bg-tertiary-fixed/30 overflow-x-hidden";
    const onScroll = () => {
      const scrolled = window.pageYOffset;
      const nav = document.querySelector("nav");
      if (!nav) return;
      const navOverlay = nav.querySelector(".absolute");
      if (scrolled > 100) {
        nav.classList.add("py-3");
        navOverlay?.classList.add("bg-white/80");
      } else {
        nav.classList.remove("py-3");
        navOverlay?.classList.remove("bg-white/80");
      }
    };

    document.addEventListener("scroll", onScroll);
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (location.hash !== "#apply") return;
    const el = document.getElementById("apply");
    if (!el) return;
    const id = requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(id);
  }, [location.pathname, location.hash, location.key]);

  return (
    <div className="careers-page">
      <main className="min-h-screen">
        <HeroSection />
        {featuredJobs.length > 0 ? <FeaturedRolesSection jobs={featuredJobs} onViewDetails={setDetailJob} /> : null}
        <section className="w-full bg-[#eceef1] py-24 md:py-28" aria-label="Open roles">
          <div className="mx-auto flex max-w-7xl flex-col gap-16 px-8 lg:flex-row">
            <FiltersSection jobs={jobs} filters={filters} setFilters={setFilters} setSearchTerm={setSearchTerm} />
            <JobListSection
              jobs={filteredJobs}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              isLoading={isLoading}
              isError={isError}
              onRetry={() => refetch()}
              onViewDetails={setDetailJob}
            />
          </div>
        </section>
        <section id="apply" className="w-full bg-white py-10 md:py-14" aria-label="Application process">
          <ApplyTalentPipeline key={location.key} />
        </section>
      </main>
      <JobDetailModal job={detailJob} open={Boolean(detailJob)} onClose={() => setDetailJob(null)} />
      <SiteFooter />
    </div>
  );
}
