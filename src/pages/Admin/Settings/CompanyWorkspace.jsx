export default function CompanyWorkspace() {
  return (
    <>
<header className="fixed top-0 right-0 left-64 h-16 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl flex items-center justify-between px-8 w-full z-40">
<div className="flex items-center gap-4 flex-1">
<div className="relative w-full max-w-md group">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
<input className="w-full bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-secondary/20 transition-all" placeholder="Search workspace configuration..." type="text"/>
</div>
</div>
<div className="flex items-center gap-6">
<button className="text-slate-500 hover:opacity-80 transition-opacity">
<span className="material-symbols-outlined">notifications</span>
</button>
<button className="text-slate-500 hover:opacity-80 transition-opacity">
<span className="material-symbols-outlined">help_outline</span>
</button>
<div className="h-8 w-px bg-outline-variant/30"></div>
<button className="bg-primary-container text-on-primary px-4 py-2 rounded-lg text-xs font-bold tracking-tight hover:brightness-110 transition-all">
                Publish Changes
            </button>
</div>
</header>

<main className="ml-64 pt-24 pb-20 px-12 max-w-7xl">

<header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
<div className="max-w-2xl">
<nav className="flex items-center gap-2 text-xs font-medium text-on-surface-variant mb-4 uppercase tracking-widest">
<span>Admin</span>
<span className="material-symbols-outlined text-xs">chevron_right</span>
<span>Configuration</span>
</nav>
<h2 className="text-5xl font-extrabold tracking-tight text-primary leading-tight">
                    Company Workspace
                </h2>
<p className="mt-4 text-on-surface-variant leading-relaxed text-lg font-body max-w-xl">
                    Configure your enterprise core identity, operational standards, and visual brand assets for the InTechRoot global platform.
                </p>
</div>
<div className="hidden md:block">
<div className="bg-surface-container-low p-4 rounded-xl flex items-center gap-4 border border-outline-variant/10">
<div className="flex -space-x-3">
<div className="w-10 h-10 rounded-full border-2 border-white bg-secondary flex items-center justify-center text-white text-xs font-bold">JD</div>
<div className="w-10 h-10 rounded-full border-2 border-white bg-tertiary-fixed-dim flex items-center justify-center text-primary text-xs font-bold">AL</div>
</div>
<div className="text-[11px] font-medium text-on-surface-variant uppercase tracking-tighter">
                        Active Workspace Editors
                    </div>
</div>
</div>
</header>

<div className="grid grid-cols-12 gap-8 items-start">

<section className="col-span-12 lg:col-span-8 space-y-8">
<div className="glass-card p-10 rounded-xl">
<div className="flex items-center gap-3 mb-8">
<div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
<span className="material-symbols-outlined">domain</span>
</div>
<h3 className="text-xl font-bold tracking-tight">Core Identity</h3>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
<div className="space-y-2">
<label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Company Name</label>
<input className="w-full border-0 border-b-2 border-outline-variant bg-transparent py-2 focus:ring-0 focus:border-tertiary-fixed-dim transition-all text-on-surface font-medium" type="text" value="InTechRoot"/>
</div>
<div className="space-y-2">
<label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Legal Entity</label>
<input className="w-full border-0 border-b-2 border-outline-variant bg-transparent py-2 focus:ring-0 focus:border-tertiary-fixed-dim transition-all text-on-surface font-medium" placeholder="e.g. InTechRoot Solutions LLC" type="text"/>
</div>
<div className="space-y-2">
<label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Primary Industry</label>
<input className="w-full border-0 border-b-2 border-outline-variant bg-transparent py-2 focus:ring-0 focus:border-tertiary-fixed-dim transition-all text-on-surface font-medium" type="text" value="IT Consulting &amp; Staffing"/>
</div>
<div className="space-y-2">
<label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Website URL</label>
<input className="w-full border-0 border-b-2 border-outline-variant bg-transparent py-2 focus:ring-0 focus:border-tertiary-fixed-dim transition-all text-on-surface font-medium" type="url" value="https://intechroot.com"/>
</div>
</div>
</div>

<div className="glass-card p-10 rounded-xl">
<div className="flex items-center gap-3 mb-8">
<div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center text-white">
<span className="material-symbols-outlined">settings_suggest</span>
</div>
<h3 className="text-xl font-bold tracking-tight">Operational Details</h3>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
<div className="space-y-2">
<label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Global Timezone</label>
<div className="relative group">
<select className="w-full appearance-none bg-surface-container-low rounded-lg px-4 py-3 border-none text-sm font-medium focus:ring-2 focus:ring-tertiary-fixed-dim/30">
<option>GMT-5 (Eastern Standard Time)</option>
<option>GMT+0 (London)</option>
<option>GMT+1 (Paris)</option>
<option>GMT+8 (Singapore)</option>
</select>
<span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
</div>
</div>
<div className="space-y-2">
<label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Default Language</label>
<div className="relative group">
<select className="w-full appearance-none bg-surface-container-low rounded-lg px-4 py-3 border-none text-sm font-medium focus:ring-2 focus:ring-tertiary-fixed-dim/30">
<option>English (US)</option>
<option>English (UK)</option>
<option>Spanish</option>
<option>German</option>
</select>
<span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
</div>
</div>
<div className="space-y-2">
<label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Currency</label>
<div className="relative group">
<select className="w-full appearance-none bg-surface-container-low rounded-lg px-4 py-3 border-none text-sm font-medium focus:ring-2 focus:ring-tertiary-fixed-dim/30">
<option>USD - US Dollar</option>
<option>EUR - Euro</option>
<option>GBP - Pound Sterling</option>
</select>
<span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
</div>
</div>
</div>
</div>
</section>

<aside className="col-span-12 lg:col-span-4 space-y-8">
<div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/10 shadow-sm">
<div className="flex items-center justify-between mb-8">
<h3 className="text-sm font-extrabold uppercase tracking-widest text-primary">Visual Branding</h3>
<span className="text-[10px] bg-tertiary-fixed-dim px-2 py-0.5 rounded text-primary font-bold">LIVE</span>
</div>
<div className="space-y-6">
<div className="p-6 bg-surface-container-low rounded-xl border-2 border-dashed border-outline-variant/30 flex flex-col items-center text-center group hover:border-secondary transition-all cursor-pointer">
<div className="w-32 h-32 bg-white rounded-lg shadow-inner mb-4 flex items-center justify-center p-4 relative overflow-hidden">
<img alt="Company Logo" className="w-full h-full object-contain" data-alt="minimalist tech logo with clean geometric lines in deep navy blue on a white background professional enterprise style" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5n64qI-CLGzWv26WcHQcB-kvwTZayacb2ejgc7m2eHPBZt9e9zgYVnpwHjEPAHj2FjWLB0OfTnBst_f4uH0RtQpiQKei23B5JLoFgRiIPOxwAy2kcIJIrY2XJFxVkpf_hYBVxIz7uqsaO50VznJu32gjKg935nXbAqu9fL309Qeul-MsXZUP4O1XmeZ0BKWrmxK6NVjXkmt4gcjTXjjJX7rySfpBn6VHoH1_3znIJSTo0Xg1myhwcf3udhjtCxar0lskFGL7EuSMC"/>
<div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
<span className="material-symbols-outlined text-white text-3xl">upload</span>
</div>
</div>
<span className="text-xs font-bold text-on-surface mb-1">Company Logo</span>
<span className="text-[10px] text-on-surface-variant uppercase tracking-tight">SVG, PNG or JPG (Max 5MB)</span>
</div>
<div className="p-4 bg-primary-container rounded-lg">
<div className="flex items-center gap-3 mb-2">
<span className="material-symbols-outlined text-tertiary-fixed-dim">info</span>
<span className="text-xs font-bold text-white uppercase tracking-tighter">Branding Tip</span>
</div>
<p className="text-[11px] text-on-primary-container leading-relaxed">
                                Your logo will appear on all client invoices, dashboard headers, and payroll stubs. For best results, use a transparent SVG.
                            </p>
</div>
</div>
</div>

<div className="p-8 rounded-xl bg-gradient-to-br from-secondary to-blue-900 text-white relative overflow-hidden">
<div className="relative z-10">
<h4 className="text-lg font-bold mb-2">System Audit</h4>
<p className="text-xs text-blue-100/80 mb-6 leading-relaxed">
                            Last modification was recorded on Oct 24, 2023 at 14:32 by <strong>admin_root</strong>.
                        </p>
<button className="w-full bg-white/10 backdrop-blur-md border border-white/20 py-2.5 rounded text-xs font-bold hover:bg-white/20 transition-all uppercase tracking-widest">
                            View Change Logs
                        </button>
</div>

<div className="absolute -right-4 -bottom-4 opacity-20 pointer-events-none">
<svg height="120" viewBox="0 0 100 100" width="120">
<circle cx="20" cy="20" fill="currentColor" r="2"></circle>
<circle cx="80" cy="20" fill="currentColor" r="2"></circle>
<circle cx="50" cy="80" fill="currentColor" r="2"></circle>
<path d="M20 20 L80 20 L50 80 Z" fill="none" stroke="currentColor" strokeWidth="0.5"></path>
</svg>
</div>
</div>
</aside>
</div>

<div className="fixed bottom-0 right-0 left-64 bg-white/80 backdrop-blur-md border-t border-outline-variant/20 px-12 py-4 flex items-center justify-end gap-4 z-30">
<button className="px-6 py-2.5 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors uppercase tracking-widest">
                Discard Changes
            </button>
<button className="px-8 py-2.5 bg-primary text-white rounded text-xs font-bold hover:bg-primary/90 transition-all shadow-lg uppercase tracking-widest">
                Save Configuration
            </button>
</div>
</main>
    </>
  );
}
