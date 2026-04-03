import { useEffect, useMemo, useState } from "react";
import { getJobs } from "../../data";
import HeroSection from "./components/HeroSection";
import FiltersSection from "./components/FiltersSection";
import JobListSection, { FeaturedRolesSection } from "./components/JobListSection";
import CTASection from "./components/CTASection";
import FooterSection from "./components/FooterSection";
import "./careers.css";

export default function CareersPage() {
  const jobs = getJobs();

  const uniqueInOrder = (values) => {
    const out = [];
    for (const v of values) if (!out.includes(v)) out.push(v);
    return out;
  };

  const sectorOptions = uniqueInOrder(jobs.map((job) => job.sector));
  const seniorityOptions = uniqueInOrder(jobs.map((job) => job.seniority));
  const contractOptions = uniqueInOrder(jobs.map((job) => job.contract));

  const defaultFilters = {
    sector: [sectorOptions[0]],
    seniority: [seniorityOptions[0]],
    contract: [contractOptions[0]],
  };

  const [filters, setFilters] = useState(defaultFilters);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredJobs = useMemo(() => jobs, [filters, searchTerm]);

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

  return (
    <div className="careers-page">
      <main className="min-h-screen">
        <HeroSection />
        <FeaturedRolesSection />
        <section className="max-w-7xl mx-auto px-8 py-32 flex flex-col lg:flex-row gap-16">
          <FiltersSection filters={filters} setFilters={setFilters} setSearchTerm={setSearchTerm} />
          <JobListSection jobs={filteredJobs} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </section>
        <CTASection />
      </main>
      <FooterSection />
    </div>
  );
}
