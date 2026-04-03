import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useApplicationsSync } from "../../data/applicationsStore";
import AdminSidebar from "../components/AdminSidebar";

export default function Applications() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobIdFilter = searchParams.get("jobId");
  const [selectedApplicationId, setSelectedApplicationId] = useState(1);
  const [searchFilter, setSearchFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [experienceFilter, setExperienceFilter] = useState("Any");
  const [selectionPopup, setSelectionPopup] = useState({ open: false, name: "" });
  const selectionTimeoutRef = useRef(null);

  const { applications: storeApplications, version } = useApplicationsSync();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    setApplications((previous) => {
      const selectedMap = new Map(previous.map((application) => [application.id, application.isSelected]));
      return storeApplications.map((application) => ({
        ...application,
        isSelected: selectedMap.get(application.id) ?? false,
      }));
    });
  }, [storeApplications, version]);

  const handleView = (id) => {
    navigate(`/admin/applications/${id}`);
  };

  const handleSelect = (id, name) => {
    setApplications((prevApplications) =>
      prevApplications.map((application) =>
        application.id === id ? { ...application, isSelected: true } : application,
      ),
    );
    setSelectionPopup({ open: true, name });
    if (selectionTimeoutRef.current) {
      clearTimeout(selectionTimeoutRef.current);
    }
    selectionTimeoutRef.current = setTimeout(() => {
      setSelectionPopup({ open: false, name: "" });
      selectionTimeoutRef.current = null;
    }, 2000);
  };

  const roleOptions = ["All", ...Array.from(new Set(applications.map((application) => application.role)))];

  const getExperienceValue = (experience) => parseInt(experience, 10);

  const filteredApplications = applications.filter((application) => {
    const query = searchFilter.trim().toLowerCase();
    const isSearchMatch =
      query.length === 0 ||
      application.name.toLowerCase().includes(query) ||
      application.role.toLowerCase().includes(query) ||
      application.location.toLowerCase().includes(query) ||
      application.email.toLowerCase().includes(query) ||
      application.stage.toLowerCase().includes(query) ||
      application.status.toLowerCase().includes(query);

    const isRoleMatch = roleFilter === "All" || application.role === roleFilter;
    const years = getExperienceValue(application.experience);
    const isExperienceMatch =
      experienceFilter === "Any" ||
      (experienceFilter === "5+ Years" && years >= 5) ||
      (experienceFilter === "10+ Years" && years >= 10);

    const isJobMatch =
      !jobIdFilter || String(application.jobId ?? "") === String(jobIdFilter);

    return isSearchMatch && isRoleMatch && isExperienceMatch && isJobMatch;
  });

  const selectedApplication =
    filteredApplications.find((application) => application.id === selectedApplicationId) || filteredApplications[0];

  useEffect(() => {
    return () => {
      if (selectionTimeoutRef.current) {
        clearTimeout(selectionTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!selectedApplication) {
      return;
    }
    if (!filteredApplications.some((application) => application.id === selectedApplicationId)) {
      setSelectedApplicationId(filteredApplications[0].id);
    }
  }, [filteredApplications, selectedApplication, selectedApplicationId]);
  return (
    <>
      <AdminSidebar />

      <main className="ml-64 min-h-screen">

      <header className="fixed top-0 right-0 left-64 h-16 bg-slate-50/60 backdrop-blur-xl shadow-[0_40px_40px_0px_rgba(0,6,21,0.04)] flex items-center justify-between px-8 w-full z-40">
      <div className="flex items-center gap-6">
      <h2 className="text-xl font-bold text-[#000615] font-['Manrope'] tracking-tight">Applications</h2>
      <div className="h-6 w-[1px] bg-outline-variant opacity-30"></div>
      <div className="flex items-center bg-surface-container-low px-4 py-2 rounded-lg">
      <span className="material-symbols-outlined text-outline text-sm" data-icon="search">search</span>
      <input className="bg-transparent border-none focus:ring-0 text-sm w-64 placeholder:text-outline/60" placeholder="Search applications..." type="text"/>
      </div>
      </div>
      <div className="flex items-center gap-4">
      <button className="p-2 rounded-full hover:bg-slate-200/50 transition-all scale-95 active:scale-90 duration-200 text-on-surface-variant">
      <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
      </button>
      <button className="p-2 rounded-full hover:bg-slate-200/50 transition-all scale-95 active:scale-90 duration-200 text-on-surface-variant">
      <span className="material-symbols-outlined" data-icon="help">help</span>
      </button>
      <div className="h-8 w-8 rounded-full overflow-hidden border border-outline-variant">
      <img alt="Admin Profile" data-alt="close-up of a professional male executive in a navy blue suit with soft office lighting background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBn2xy70deI9op4NDf2W0IObHYSUwF3fdgoPS_KA-kN28WGtPiLVIdmO5fU1VfiLbCe-WqCAM91EQFjJcFUQALxhTZnU4VdTuxblhNVP0vz3_lLDFMHhB5DRdnghePuPPAHSW5yyMl4tsAErxmwjEab9VGzaIbcT9UkpOuAlfJrxKPvgoZn0KQwSJapI5_xkEPzlBWlw8AXpWdAuOOL1DqlCxXsVDX77JcAbO_QyBC4T9BxqwNYW57YeAkC7KrF2NHdbdkR2NPfJhe"/>
      </div>
      </div>
      </header>

      <div className="pt-24 px-8 pb-12">

      <div className="grid grid-cols-5 gap-6 mb-8">
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
      <p className="text-xs font-semibold text-outline uppercase tracking-wider mb-2">Total Applications</p>
      <div className="flex items-end justify-between">
      <h3 className="text-3xl font-bold text-primary font-headline">1,248</h3>
      <span className="text-secondary font-bold text-sm">+12%</span>
      </div>
      </div>
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
      <p className="text-xs font-semibold text-outline uppercase tracking-wider mb-2">Under Review</p>
      <div className="flex items-end justify-between">
      <h3 className="text-3xl font-bold text-primary font-headline">412</h3>
      <div className="w-10 h-1 bg-secondary/20 rounded-full overflow-hidden">
      <div className="bg-secondary h-full w-2/3"></div>
      </div>
      </div>
      </div>
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
      <p className="text-xs font-semibold text-outline uppercase tracking-wider mb-2">Interview Scheduled</p>
      <div className="flex items-end justify-between">
      <h3 className="text-3xl font-bold text-primary font-headline">156</h3>
      <span className="material-symbols-outlined text-tertiary-fixed-variant" data-icon="event">event</span>
      </div>
      </div>
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 border-l-4 border-l-on-tertiary-container">
      <p className="text-xs font-semibold text-outline uppercase tracking-wider mb-2">Selected</p>
      <div className="flex items-end justify-between">
      <h3 className="text-3xl font-bold text-primary font-headline">84</h3>
      <span className="text-on-tertiary-container font-bold text-sm">Target Met</span>
      </div>
      </div>
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
      <p className="text-xs font-semibold text-outline uppercase tracking-wider mb-2">Rejected</p>
      <div className="flex items-end justify-between">
      <h3 className="text-3xl font-bold text-primary font-headline">182</h3>
      <span className="text-error text-sm font-medium">14.5% rate</span>
      </div>
      </div>
      </div>

      <section className="bg-primary-container text-white p-8 rounded-xl mb-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-secondary opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <h4 className="text-sm font-semibold mb-8 flex items-center gap-2">
      <span className="material-symbols-outlined text-tertiary-fixed-dim" data-icon="analytics">analytics</span>
                          Active Recruitment Pipeline
                      </h4>
      <div className="flex items-center justify-between relative">

      <div className="absolute h-0.5 w-full bg-white/10 top-5 left-0"></div>

      <div className="flex flex-col items-center gap-3 relative z-10">
      <div className="w-10 h-10 rounded-full bg-tertiary-fixed-dim text-primary flex items-center justify-center font-bold">1</div>
      <p className="text-xs font-bold uppercase tracking-widest">Applied</p>
      <p className="text-xl font-headline font-bold">542</p>
      </div>
      <div className="flex flex-col items-center gap-3 relative z-10">
      <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold">2</div>
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Screening</p>
      <p className="text-xl font-headline font-bold">310</p>
      </div>
      <div className="flex flex-col items-center gap-3 relative z-10">
      <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center font-bold border border-white/20">3</div>
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Technical</p>
      <p className="text-xl font-headline font-bold">128</p>
      </div>
      <div className="flex flex-col items-center gap-3 relative z-10">
      <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center font-bold border border-white/20">4</div>
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">HR Interview</p>
      <p className="text-xl font-headline font-bold">45</p>
      </div>
      <div className="flex flex-col items-center gap-3 relative z-10">
      <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center font-bold border border-white/20">5</div>
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Selected</p>
      <p className="text-xl font-headline font-bold">23</p>
      </div>
      </div>
      </section>

      <div className="grid grid-cols-12 gap-8 items-start">

      <div className="col-span-8 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
      <div className="p-6 flex items-center justify-between border-b border-surface-container">
      <h4 className="font-bold text-primary font-headline">Recent Applications</h4>
      <div className="flex items-center gap-3">
      <input className="text-xs font-medium border-none bg-surface-container-low rounded-lg focus:ring-0 py-1.5 w-44" placeholder="Search" type="text" value={searchFilter} onChange={(event) => setSearchFilter(event.target.value)} />
      <select className="text-xs font-medium border-none bg-surface-container-low rounded-lg focus:ring-0 py-1.5 w-44" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
      {roleOptions.map((role) => (
        <option key={role} value={role}>
          {role === "All" ? "Role: All" : role}
        </option>
      ))}
      </select>
      <select className="text-xs font-medium border-none bg-surface-container-low rounded-lg focus:ring-0 py-1.5 w-44" value={experienceFilter} onChange={(event) => setExperienceFilter(event.target.value)}>
      <option value="Any">Experience: Any</option>
      <option value="5+ Years">5+ Years</option>
      <option value="10+ Years">10+ Years</option>
      </select>
      <button className="p-1.5 bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-colors" onClick={() => {
        setSearchFilter("");
        setRoleFilter("All");
        setExperienceFilter("Any");
      }}>
      <span className="material-symbols-outlined text-lg" data-icon="filter_list">filter_list</span>
      </button>
      </div>
      </div>
      <div className="overflow-x-auto">
      <table className="w-full text-left">
      <thead className="bg-surface-container-low">
      <tr>
      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-outline">Candidate</th>
      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-outline">Role</th>
      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-outline">Experience</th>
      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-outline">Stage</th>
      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-outline">Status</th>
      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-outline text-right">Action</th>
      </tr>
      </thead>
      <tbody className="divide-y divide-surface-container">
      {filteredApplications.map((application, index) => (
        <tr
          className={selectedApplicationId === application.id ? "bg-secondary/5 border-l-4 border-l-secondary cursor-pointer transition-colors" : index % 2 === 0 ? "hover:bg-surface-container-low transition-colors cursor-pointer" : "bg-surface-container-low/30 hover:bg-surface-container-low transition-colors cursor-pointer"}
          key={application.id}
          onClick={() => setSelectedApplicationId(application.id)}
        >
          <td className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-outline-variant bg-surface-container-low flex items-center justify-center">
                <span className="text-xs font-bold text-primary">
                  {application.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-primary text-sm">{application.name}</p>
                <p className="text-[11px] text-outline">{application.location}</p>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 text-sm font-medium text-on-surface-variant">{application.role}</td>
          <td className="px-6 py-4 text-sm text-outline">{application.experience}</td>
              <td className="px-6 py-4">
            <span
              className={
                application.stage === "Technical Evaluation"
                  ? "px-2 py-1 bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold rounded uppercase tracking-tighter"
                  : application.stage === "Offer & Onboarding"
                    ? "px-2 py-1 bg-on-tertiary-container/10 text-on-tertiary-container text-[10px] font-bold rounded uppercase tracking-tighter"
                    : "px-2 py-1 bg-surface-container-high text-on-surface-variant text-[10px] font-bold rounded uppercase tracking-tighter"
              }
            >
              {application.stage}
            </span>
          </td>
          <td className="px-6 py-4">
            <div className="flex items-center gap-2">
              <div
                className={
                  application.status === "In Progress"
                    ? "w-2 h-2 rounded-full bg-secondary"
                    : application.status === "Offer Sent"
                      ? "w-2 h-2 rounded-full bg-on-tertiary-container"
                      : "w-2 h-2 rounded-full bg-outline-variant"
                }
              ></div>
              <span className="text-xs font-medium">{application.status}</span>
            </div>
          </td>
          <td className="px-6 py-4 text-right">
            <button
              className="text-outline hover:text-primary"
              onClick={(event) => {
                event.stopPropagation();
                handleView(application.id);
              }}
            >
              <span className="material-symbols-outlined" data-icon="visibility">visibility</span>
            </button>
          </td>
        </tr>
      ))}
      {filteredApplications.length === 0 && (
        <tr>
          <td className="px-6 py-8 text-sm text-outline text-center" colSpan={6}>
            No applications found.
          </td>
        </tr>
      )}
      </tbody>
      </table>
      </div>
      </div>

      {selectedApplication && (
      <div className="col-span-4 flex flex-col gap-6">

      <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-[0_40px_40px_0px_rgba(0,6,21,0.04)] border border-white/40 p-8">
      <div className="text-center mb-6">
      <div className="w-24 h-24 rounded-2xl mx-auto mb-4 overflow-hidden border-2 border-white shadow-lg">
      <img alt="Elena Novikova Large" data-alt="high-quality studio portrait of Elena Novikova looking confident, soft warm directional lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkZ3NUNWOOiw8viMwO2HXFDdKwQHuRcHdh4KbJ6rYIKFxnp9tQJySeabAlnmvT_lyytHdoVMyixExB7qa6ViVZvgbySdc1KwGilQISCkf4NpVSXzHygp15KTXyAsau0dzMMPlukiuxy7TkXSpmoRL_IFpXG4iJ3ASQxbTqjsK6Ri1qnBFFu_odf7svaKg1-yIg_u_VcACF7k2YJWC8OfMBFB8Pe3CmaRInvHLhX0EL8QTkKIXW0of328zZ1vS5L5L5-v3xMe1lVQMP"/>
      </div>
      <h5 className="text-xl font-bold text-primary font-headline">{selectedApplication.name}</h5>
      <p className="text-secondary font-semibold text-sm">{selectedApplication.role}</p>
      </div>
      <div className="space-y-4 mb-8">
      <div className="flex items-center gap-3 text-sm">
      <span className="material-symbols-outlined text-outline" data-icon="location_on">location_on</span>
      <span className="text-on-surface-variant">{selectedApplication.location}</span>
      </div>
      <div className="flex items-center gap-3 text-sm">
      <span className="material-symbols-outlined text-outline" data-icon="mail">mail</span>
      <Link className="text-on-surface-variant" to={`mailto:${selectedApplication.email}`}>{selectedApplication.email}</Link>
      </div>
      <div className="flex items-center gap-3 text-sm">
      <span className="material-symbols-outlined text-outline" data-icon="attach_file">attach_file</span>
      <Link className="text-secondary underline font-medium" to="#">{`Resume_${selectedApplication.name.replace(/\s+/g, "_")}.pdf`}</Link>
      </div>
      </div>
      <div className="mb-8">
      <h6 className="text-[10px] font-bold text-outline uppercase tracking-widest mb-3">Core Skills</h6>
      <div className="flex flex-wrap gap-2">
      <span className="px-3 py-1 bg-surface-container-low text-on-surface-variant text-[11px] font-semibold rounded-full border border-outline-variant/10">SAP S/4HANA</span>
      <span className="px-3 py-1 bg-surface-container-low text-on-surface-variant text-[11px] font-semibold rounded-full border border-outline-variant/10">Azure Cloud</span>
      <span className="px-3 py-1 bg-surface-container-low text-on-surface-variant text-[11px] font-semibold rounded-full border border-outline-variant/10">Python</span>
      <span className="px-3 py-1 bg-surface-container-low text-on-surface-variant text-[11px] font-semibold rounded-full border border-outline-variant/10">IT Strategy</span>
      </div>
      </div>
      <div className="flex flex-col gap-3">
      <button className="w-full py-3 bg-primary-container text-white rounded-lg font-bold text-sm hover:translate-y-[-2px] transition-transform shadow-md" onClick={() => (selectedApplication.isSelected ? handleView(selectedApplication.id) : handleSelect(selectedApplication.id, selectedApplication.name))}>
                                      {selectedApplication.isSelected ? "View Status" : "Select"}
                                  </button>
      <div className="grid grid-cols-2 gap-3">
      <button className="col-span-2 py-2.5 border border-error/20 text-error font-semibold text-sm rounded-lg hover:bg-error/5 transition-all">
                                          Reject
                                      </button>
      </div>
      </div>
      </div>

      <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
      <div className="flex items-center justify-between mb-4">
      <h6 className="text-xs font-bold text-primary uppercase">Quick Preview</h6>
      <span className="material-symbols-outlined text-outline text-lg" data-icon="fullscreen">fullscreen</span>
      </div>
      <div className="bg-white p-4 rounded border border-outline-variant/20 h-40 relative overflow-hidden">
      <div className="space-y-3 opacity-40">
      <div className="h-4 w-3/4 bg-surface-container-high rounded"></div>
      <div className="h-2 w-full bg-surface-container-high rounded"></div>
      <div className="h-2 w-full bg-surface-container-high rounded"></div>
      <div className="h-2 w-5/6 bg-surface-container-high rounded"></div>
      <div className="h-2 w-1/2 bg-surface-container-high rounded mt-4"></div>
      <div className="h-2 w-full bg-surface-container-high rounded"></div>
      <div className="h-2 w-full bg-surface-container-high rounded"></div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent flex items-end justify-center pb-4">
      <p className="text-[10px] font-semibold text-secondary">Click to expand document</p>
      </div>
      </div>
      </div>
      </div>
      )}
      </div>
      </div>
      {selectionPopup.open && (
        <div className="fixed inset-0 bg-slate-900/25 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-surface-container-lowest/90 backdrop-blur-xl rounded-xl border border-outline-variant/20 shadow-[0_40px_40px_rgba(0,6,21,0.04)] px-8 py-6 flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-on-tertiary-container animate-pulse" style={{fontVariationSettings: "'FILL' 1, 'wght' 700, 'GRAD' 0, 'opsz' 24"}}>check_circle</span>
            <p className="text-sm font-semibold text-primary">{selectionPopup.name} has been selected</p>
          </div>
        </div>
      )}
      </main>
    </>
  );
}
