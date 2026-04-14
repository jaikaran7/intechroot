import Button from "../../../components/Form/Button";
import { getFeaturedRoles } from "@/fixtures/catalog";
import { useNavigate } from "react-router-dom";

export function FeaturedRolesSection() {
  const navigate = useNavigate();
  const featuredRoles = getFeaturedRoles();

  return (
    <section className="py-32 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-8 relative">
        <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20">
          <div className="max-w-2xl">
            <div className="text-secondary font-black text-[11px] uppercase tracking-[0.4em] mb-4">Urgent Opportunities</div>
            <h2 className="text-6xl font-headline font-extrabold text-primary tracking-tighter leading-[0.95]">
              Architectural <br />
              Strategic Roles
            </h2>
          </div>
          <div className="hidden md:block text-on-surface-variant text-sm font-medium opacity-50">Updated 2 hours ago</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredRoles.map((role, idx) => (
            <div
              key={role.title}
              className={`glass-card p-10 rounded-[2.5rem] hover:-translate-y-3 transition-all duration-700 group flex flex-col h-full ${
                idx === 1 ? "border-secondary/20 shadow-2xl scale-105 z-10" : ""
              }`}
            >
              <div className="flex justify-between items-start mb-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${idx === 0 ? "bg-secondary/5 group-hover:bg-secondary/10 transition-colors" : ""} ${idx === 1 ? "bg-tertiary-fixed/10" : ""} ${idx === 2 ? "bg-primary/5 group-hover:bg-primary/10 transition-colors" : ""}`}>
                  <span className={`material-symbols-outlined text-3xl ${idx === 0 ? "text-secondary" : ""} ${idx === 1 ? "text-tertiary-fixed" : ""} ${idx === 2 ? "text-primary" : ""}`}>{role.icon}</span>
                </div>
                <span className={`${role.badgeClass} text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter`}>{role.badgeText}</span>
              </div>
              <h3 className={`text-2xl font-headline font-bold mb-4 ${role.titleHover} transition-colors duration-500`}>{role.title}</h3>
              <p className="text-on-surface-variant text-sm mb-10 flex items-center gap-2 opacity-70">
                <span className="material-symbols-outlined text-sm">location_on</span> {role.location}
              </p>
              <div className="flex flex-wrap gap-2 mb-10 mt-auto">
                {role.tags.map((tag) => (
                  <span key={tag} className="bg-surface-container-high/50 px-3 py-1 rounded-lg text-[10px] font-bold text-primary uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
              <Button
                className={role.buttonClass}
                onClick={() =>
                  navigate("/apply", {
                    state: {
                      jobId: `featured-${role.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "role"}`,
                      jobTitle: role.title,
                      company: "InTechRoot",
                      discipline: role.title,
                      experience: role.experience,
                    },
                  })
                }
              >
                Apply Position
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function JobListSection({ jobs, searchTerm, setSearchTerm }) {
  const navigate = useNavigate();

  return (
    <div className="flex-1 space-y-10">
      <div className="relative group">
        <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-secondary transition-colors">search</span>
        <input
          className="w-full pl-16 pr-8 py-6 glass-card rounded-3xl border-white/40 focus:ring-4 focus:ring-secondary/5 focus:outline-none transition-all placeholder:text-on-surface-variant/40 placeholder:font-medium"
          placeholder="Search architectural roles by title, skill or vector..."
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {jobs.map((job) => (
        <div
          key={job.id}
          className="glass-card p-10 rounded-[2.5rem] border-white/40 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-700 group flex flex-col md:flex-row gap-10 items-start md:items-center"
        >
          <div className="w-20 h-20 bg-surface-container-low rounded-[1.5rem] flex items-center justify-center flex-shrink-0 text-primary border border-white/20">
            <span className="material-symbols-outlined text-4xl">{job.icon}</span>
          </div>
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h3 className="text-2xl font-headline font-extrabold text-primary group-hover:text-secondary transition-colors duration-500">{job.title}</h3>
              <span className={`${job.badgeClass} text-[9px] font-black px-3 py-1 rounded-full tracking-widest uppercase`}>{job.badge}</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-medium text-on-surface-variant opacity-60">
              {job.meta.map((metaItem, idx) => (
                <span key={metaItem} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">{job.metaIcons[idx]}</span>
                  {metaItem}
                </span>
              ))}
            </div>
          </div>
          <div className="flex md:flex-col items-center gap-4 w-full md:w-auto">
            <Button
              className="flex-1 md:w-36 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-secondary transition-all duration-500 shadow-lg"
                onClick={() =>
                  navigate("/apply", {
                    state: {
                      jobId: job.id,
                      jobTitle: job.title,
                      company: "InTechRoot",
                      discipline: job.title,
                      experience: job.experience,
                    },
                  })
                }
            >
              Apply Now
            </Button>
            <Button className="p-4 glass-card rounded-full border-white/20 hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-xl text-primary">bookmark</span>
            </Button>
          </div>
        </div>
      ))}
      <div className="pt-16 text-center">
        <Button className="font-black text-[10px] text-secondary uppercase tracking-[0.4em] hover:opacity-50 transition-opacity flex items-center gap-4 mx-auto group">
          Load More Opportunities
          <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">east</span>
        </Button>
      </div>
    </div>
  );
}
