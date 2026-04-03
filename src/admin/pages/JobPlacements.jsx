import AdminSidebar from "../components/AdminSidebar";

export default function JobPlacements() {
  return (
    <>
      <AdminSidebar />

      <main className="ml-64 min-h-screen">

      <header className="sticky top-0 z-40 w-full bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm shadow-slate-200/20 flex items-center justify-between h-16 px-8">
      <div className="flex items-center gap-4 flex-1">
      <div className="relative w-full max-w-md">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
      <input className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-lg text-sm focus:ring-2 focus:ring-[#4cd7f6]/20 transition-all font-inter" placeholder="Search placements, candidates..." type="text"/>
      </div>
      </div>
      <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
      <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-all">
      <span className="material-symbols-outlined">notifications</span>
      </button>
      <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-all">
      <span className="material-symbols-outlined">help_outline</span>
      </button>
      </div>
      <div className="h-8 w-[1px] bg-slate-200"></div>
      <div className="flex items-center gap-3">
      <div className="text-right">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">System Status</p>
      <p className="text-xs font-semibold text-on-tertiary-container">Live Operations</p>
      </div>
      <div className="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse"></div>
      </div>
      </div>
      </header>

      <div className="p-10 space-y-12">

      <section className="flex justify-between items-end">
      <div>
      <h2 className="text-4xl font-extrabold font-headline tracking-tighter text-primary">Job Postings</h2>
      <p className="text-on-surface-variant font-body mt-2 max-w-xl">Orchestrating global IT talent alignment. Manage high-level placements and monitor the recruitment ecosystem in real-time.</p>
      </div>
      <button className="bg-primary-container text-on-primary px-6 py-3 rounded-lg flex items-center gap-2 font-semibold hover:-translate-y-0.5 transition-all shadow-lg shadow-primary-container/10">
      <span className="material-symbols-outlined text-sm">add</span>
                          New Placement Entry
                      </button>
      </section>

      <section className="space-y-6">
      <div className="flex items-center justify-between">
      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Strategic Pipeline</h3>
      <div className="flex gap-4 text-xs font-bold">
      <span className="flex items-center gap-1.5 text-secondary"><span className="w-2 h-2 rounded-full bg-secondary"></span>Active</span>
      <span className="flex items-center gap-1.5 text-on-tertiary-container"><span className="w-2 h-2 rounded-full bg-on-tertiary-container"></span>High Priority</span>
      </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

      <div className="glass-card p-6 rounded-xl relative overflow-hidden">
      <div className="signature-glow absolute inset-0 pointer-events-none"></div>
      <div className="relative z-10">
      <p className="text-xs font-bold text-secondary mb-1">STAGE 01</p>
      <h4 className="text-lg font-bold font-headline mb-4">Sourcing</h4>
      <div className="flex items-baseline gap-2">
      <span className="text-3xl font-extrabold">24</span>
      <span className="text-xs text-slate-500">+4 this week</span>
      </div>
      </div>
      </div>

      <div className="glass-card p-6 rounded-xl relative overflow-hidden border-b-2 border-[#4cd7f6]">
      <div className="signature-glow absolute inset-0 pointer-events-none opacity-50"></div>
      <div className="relative z-10">
      <p className="text-xs font-bold text-secondary mb-1">STAGE 02</p>
      <h4 className="text-lg font-bold font-headline mb-4">Technical Interview</h4>
      <div className="flex items-baseline gap-2">
      <span className="text-3xl font-extrabold text-[#0b1f3a]">12</span>
      <span className="text-xs text-on-tertiary-container font-bold">6 Critical</span>
      </div>
      </div>
      </div>

      <div className="glass-card p-6 rounded-xl relative">
      <div className="relative z-10">
      <p className="text-xs font-bold text-secondary mb-1">STAGE 03</p>
      <h4 className="text-lg font-bold font-headline mb-4">Client Review</h4>
      <div className="flex items-baseline gap-2">
      <span className="text-3xl font-extrabold">8</span>
      <span className="text-xs text-slate-500">Wait time: 2d</span>
      </div>
      </div>
      </div>

      <div className="glass-card p-6 rounded-xl bg-primary-container text-white">
      <div className="relative z-10">
      <p className="text-xs font-bold text-tertiary-fixed mb-1">STAGE 04</p>
      <h4 className="text-lg font-bold font-headline mb-4">Finalizing Contract</h4>
      <div className="flex items-baseline gap-2">
      <span className="text-3xl font-extrabold">5</span>
      <span className="text-xs text-tertiary-fixed/60">Closing rate 92%</span>
      </div>
      </div>
      </div>
      </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

      <div className="lg:col-span-2 space-y-6">
      <div className="flex items-center justify-between">
      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Recent Placements</h3>
      <div className="flex gap-2">
      <button className="text-xs font-bold px-3 py-1 bg-surface-container rounded-full">All Roles</button>
      <button className="text-xs font-bold px-3 py-1 hover:bg-surface-container rounded-full transition-colors">Contract</button>
      <button className="text-xs font-bold px-3 py-1 hover:bg-surface-container rounded-full transition-colors">Permanent</button>
      </div>
      </div>
      <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse">
      <thead>
      <tr className="bg-slate-50 dark:bg-slate-900/50">
      <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Candidate</th>
      <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Company</th>
      <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Role</th>
      <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Start Date</th>
      <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 text-right">Status</th>
      </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
      <tr className="hover:bg-slate-50/50 transition-colors group">
      <td className="px-6 py-5">
      <div className="flex items-center gap-3">
      <img className="w-8 h-8 rounded-lg object-cover" data-alt="portrait of a professional male software engineer with glasses smiling slightly in a modern office environment" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAM0p6uimO_UUe08XdHBnXOPZFMMfwXAqUopeqDTMa0JMx33VSHBTh8CcED0V7hT6F3_bTVzVzvxFoOZ2-OWKhfZtprzSYLeMVOY9tkv7D7pf5tGsDsYC4wasg7pxSw8r8-hVvnHjIVGRd5JhBo5izoktxMHSqfb9kjLBPdL_0pcNsQcKBSHphKfRW2w6996B8ekTR7FH7RpnSxXTOQeIa21jsZ_D1oQbcFu4bj0lO2l2zrMFQFDxwujcscX0JSjEWAKfZ_BCdW8yfu"/>
      <div>
      <p className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">Jordan Dracos</p>
      <p className="text-[10px] text-slate-400">Fullstack Engineer</p>
      </div>
      </div>
      </td>
      <td className="px-6 py-5">
      <p className="text-sm font-semibold">Nebula Cloud Systems</p>
      </td>
      <td className="px-6 py-5">
      <span className="text-xs font-medium px-2 py-1 bg-secondary-fixed text-on-secondary-fixed rounded">Lead Developer</span>
      </td>
      <td className="px-6 py-5">
      <p className="text-sm font-medium text-slate-600 font-mono">Oct 12, 2023</p>
      </td>
      <td className="px-6 py-5 text-right">
      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold py-1 px-2 rounded bg-tertiary-fixed text-on-tertiary-fixed">
                                                  COMPLETED
                                              </span>
      </td>
      </tr>
      <tr className="bg-surface-container-low hover:bg-slate-100/50 transition-colors group">
      <td className="px-6 py-5">
      <div className="flex items-center gap-3">
      <img className="w-8 h-8 rounded-lg object-cover" data-alt="close-up portrait of a female executive with confident expression, warm lighting, professional attire" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnIA6xeO7dmEOTnc1wS06TTDZ_P2gYw7XhuwsWU2dhSwV4fsWJtwNihCSegwI-apdaSFsdx0nWy3j4O3SU14oZXXR-kKkYV-U_XqLmc0TEYRgV9GFD3Z8yXU36SICe6md2_VGKF64hC02y6cG0nwCyqSdWvt8L60tcNO96mslKoLxan0Zcup75i6L-yVxCUQ6bhI6zy8uNo2bBgxqaXK9hqYlSmyTMCthhMBtrCTyU0zDR60Qx9YQFOmT35YgUgD4qCdCEW7099Q2U"/>
      <div>
      <p className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">Maya Sterling</p>
      <p className="text-[10px] text-slate-400">Data Architect</p>
      </div>
      </div>
      </td>
      <td className="px-6 py-5">
      <p className="text-sm font-semibold">Quantum Core Inc.</p>
      </td>
      <td className="px-6 py-5">
      <span className="text-xs font-medium px-2 py-1 bg-secondary-fixed text-on-secondary-fixed rounded">Architect</span>
      </td>
      <td className="px-6 py-5">
      <p className="text-sm font-medium text-slate-600 font-mono">Nov 05, 2023</p>
      </td>
      <td className="px-6 py-5 text-right">
      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold py-1 px-2 rounded bg-secondary-container text-on-secondary-container">
                                                  ONBOARDING
                                              </span>
      </td>
      </tr>
      <tr className="hover:bg-slate-50/50 transition-colors group">
      <td className="px-6 py-5">
      <div className="flex items-center gap-3">
      <img className="w-8 h-8 rounded-lg object-cover" data-alt="portrait of a young tech professional with a neutral expression, blurred modern workspace background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSAuPN4sFRLhzHv6-tMhPvC6w82LaeeIueguDnaHrDJ-MQI4ZTYPqnnvg1tgidyR7dhMe7AYoZpaLWhDQf2AhFcOBaxWl3C_ZoRdsIMbSh0OVIFEjBh-ZPoXPN_dtmIJKtWX4c_RM0X17N1uOOU6PMcz9b78ZoLdw1CAsMXHYHZUpwafZcod4gfj04TQiap5_mXk34lvb-I285P8yOKkYVU_N01NH2QIilumAkVzCwGfWaxfXXy3qTJQuOUGq2uGxT_MezANzQPn7K"/>
      <div>
      <p className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">Amit Kumar</p>
      <p className="text-[10px] text-slate-400">DevOps Specialist</p>
      </div>
      </div>
      </td>
      <td className="px-6 py-5">
      <p className="text-sm font-semibold">Global Link FinTech</p>
      </td>
      <td className="px-6 py-5">
      <span className="text-xs font-medium px-2 py-1 bg-secondary-fixed text-on-secondary-fixed rounded">SRE</span>
      </td>
      <td className="px-6 py-5">
      <p className="text-sm font-medium text-slate-600 font-mono">Nov 18, 2023</p>
      </td>
      <td className="px-6 py-5 text-right">
      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold py-1 px-2 rounded bg-primary-fixed-dim text-on-primary-fixed-variant">
                                                  NEGOTIATION
                                              </span>
      </td>
      </tr>
      </tbody>
      </table>
      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 flex justify-between items-center">
      <span className="text-xs font-bold text-slate-500">Showing 3 of 42 active placements</span>
      <div className="flex gap-1">
      <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-200 transition-colors">
      <span className="material-symbols-outlined text-sm">chevron_left</span>
      </button>
      <button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-white text-xs font-bold">1</button>
      <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-200 transition-colors text-xs font-bold">2</button>
      <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-200 transition-colors">
      <span className="material-symbols-outlined text-sm">chevron_right</span>
      </button>
      </div>
      </div>
      </div>
      </div>

      <aside className="sticky top-28 space-y-6">
      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">New Entry Details</h3>
      <div className="glass-card p-8 rounded-xl shadow-lg border border-outline-variant/10">
      <form className="space-y-6">
      <div className="space-y-1">
      <label className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">Candidate Full Name</label>
      <input className="w-full bg-transparent border-b-2 border-outline-variant/30 focus:border-tertiary-fixed-dim focus:ring-0 px-0 py-2 font-semibold text-primary transition-all" placeholder="e.g. Elena Rossi" type="text"/>
      </div>
      <div className="space-y-1">
      <label className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">Client Company</label>
      <select className="w-full bg-transparent border-b-2 border-outline-variant/30 focus:border-tertiary-fixed-dim focus:ring-0 px-0 py-2 font-semibold text-primary transition-all">
      <option>Select Partner...</option>
      <option>Nebula Cloud Systems</option>
      <option>Quantum Core Inc.</option>
      <option>Global Link FinTech</option>
      </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
      <label className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">Role Title</label>
      <input className="w-full bg-transparent border-b-2 border-outline-variant/30 focus:border-tertiary-fixed-dim focus:ring-0 px-0 py-2 font-semibold text-primary transition-all" placeholder="e.g. Senior PM" type="text"/>
      </div>
      <div className="space-y-1">
      <label className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">Contract Type</label>
      <select className="w-full bg-transparent border-b-2 border-outline-variant/30 focus:border-tertiary-fixed-dim focus:ring-0 px-0 py-2 font-semibold text-primary transition-all">
      <option>Full-time</option>
      <option>Contract</option>
      <option>B2B</option>
      </select>
      </div>
      </div>
      <div className="space-y-1">
      <label className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">Planned Start Date</label>
      <div className="relative">
      <input className="w-full bg-transparent border-b-2 border-outline-variant/30 focus:border-tertiary-fixed-dim focus:ring-0 px-0 py-2 font-semibold text-primary transition-all" type="date"/>
      <span className="material-symbols-outlined absolute right-0 top-2 text-slate-400 pointer-events-none">calendar_today</span>
      </div>
      </div>
      <div className="pt-4">
      <button className="w-full bg-primary-container text-on-primary font-bold py-4 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all" type="submit">
                                          Initialize Placement Flow
                                          <span className="material-symbols-outlined text-sm">bolt</span>
      </button>
      <p className="text-[10px] text-center mt-4 text-slate-400 font-medium">Auto-populates dashboard and triggers employee onboarding upon confirmation.</p>
      </div>
      </form>
      </div>

      <div className="relative rounded-xl overflow-hidden p-6 text-white group">
      <div className="absolute inset-0 bg-secondary group-hover:scale-110 transition-transform duration-700"></div>
      <div className="absolute inset-0 signature-glow opacity-30"></div>
      <div className="relative z-10 space-y-4">
      <h5 className="font-headline font-bold text-lg">AI Talent Matching</h5>
      <p className="text-xs text-secondary-fixed/80 leading-relaxed">Our proprietary matching algorithm has improved placement retention by 22% this quarter.</p>
      <Link className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-tertiary-fixed" to="#">
                                      View Analytics Report
                                      <span className="material-symbols-outlined text-xs">arrow_forward_ios</span>
      </Link>
      </div>
      </div>
      </aside>
      </div>
      </div>

      <div className="fixed bottom-0 right-0 -z-10 pointer-events-none opacity-5">
      <svg fill="none" height="600" viewBox="0 0 600 600" width="600" xmlns="http://www.w3.org/2000/svg">
      <circle className="text-primary" cx="300" cy="300" r="299.5" stroke="currentColor"></circle>
      <circle className="text-primary" cx="300" cy="300" r="239.5" stroke="currentColor"></circle>
      <circle className="text-primary" cx="300" cy="300" r="179.5" stroke="currentColor"></circle>
      <line className="text-primary" stroke="currentColor" x1="0" x2="600" y1="300" y2="300"></line>
      <line className="text-primary" stroke="currentColor" x1="300" x2="300" y1="0" y2="600"></line>
      </svg>
      </div>
      </main>
    </>
  );
}
