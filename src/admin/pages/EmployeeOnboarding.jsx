import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

export default function EmployeeOnboarding() {
  const navigate = useNavigate();

  return (
    <>
      <AdminSidebar />
      <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 bg-white/60 dark:bg-[#000615]/60 backdrop-blur-xl flex items-center justify-between px-8 z-40 shadow-sm dark:shadow-none font-['Inter'] font-medium">
      <div className="flex items-center bg-surface-container rounded-lg px-4 py-1.5 w-96">
      <span className="material-symbols-outlined text-outline text-lg">search</span>
      <input className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-outline/60" placeholder="Search employees or files..." type="text"/>
      </div>
      <div className="flex items-center gap-6">
      <button className="relative hover:text-[#4cd7f6] transition-opacity opacity-80 hover:opacity-100">
      <span className="material-symbols-outlined">notifications</span>
      <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span>
      </button>
      <div className="h-8 w-[1px] bg-outline-variant/30"></div>
      <div className="flex items-center gap-3">
      <div className="text-right">
      <p className="text-xs font-bold text-primary">Administrator</p>
      <p className="text-[10px] text-outline">Global Ops</p>
      </div>
      <img alt="Administrator Profile" className="w-9 h-9 rounded-full object-cover border border-outline-variant/20" data-alt="Close-up portrait of a professional male administrator in a modern office setting with soft natural lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA16rmLj8L2rjgNHfzdNilYqK1ifn_PnPkmBsmzxvX-cH9uulhwS2oZU5-QmNle3LC5__ALlSfOZ3AQAJKv0MFyyq1DxniLaXaIfzdeadoU-4C2oq6Op1HlVRo96X4GsaHFssljN5oGu3z5MF1BCpPSNzHLs2chMvLZKXiOYavqHqsmaVoUWU8IJat6egH7ikSnp6KsYxCaNgm4eU8zoZw7o34AU6WiZQpVnglqVhfd2CzQZNvjyTH_0lrzuih3IiRxhBka9DGafMil"/>
      </div>
      </div>
      </header>
      <main className="ml-64 pt-24 pb-12 px-12 min-h-screen">
      <section className="mb-12 relative">
      <div className="absolute -top-10 -left-10 w-64 h-64 bg-tertiary-fixed-dim/5 rounded-full blur-[100px]"></div>
      <h2 className="text-5xl font-headline font-bold text-primary tracking-tight mb-2">Employee Onboarding</h2>
      <p className="text-lg text-on-primary-container font-light max-w-2xl">Initialize the onboarding sequence for a new global team member. Complete each step to ensure compliance and access.</p>
      </section>
      <div className="max-w-5xl mx-auto mb-10">
      <div className="flex items-center justify-between relative px-2">
      <div className="absolute top-5 left-0 w-full h-[2px] bg-surface-container-high -z-10">
      <div className="w-1/4 h-full bg-primary-container"></div>
      </div>
      <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary font-bold shadow-lg shadow-primary-container/20">
      <span className="material-symbols-outlined text-sm">person</span>
      </div>
      <span className="text-xs font-bold text-primary tracking-wide">Personal Details</span>
      </div>
      <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-outline font-bold">
      <span className="material-symbols-outlined text-sm">business_center</span>
      </div>
      <span className="text-xs font-medium text-outline tracking-wide">Job Information</span>
      </div>
      <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-outline font-bold">
      <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
      </div>
      <span className="text-xs font-medium text-outline tracking-wide">Compensation &amp; Benefits</span>
      </div>
      <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-outline font-bold">
      <span className="material-symbols-outlined text-sm">verified</span>
      </div>
      <span className="text-xs font-medium text-outline tracking-wide">Review &amp; Confirm</span>
      </div>
      </div>
      </div>
      <div className="max-w-5xl mx-auto">
      <div className="glass-card rounded-xl ambient-shadow p-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 blur-[80px] -mr-32 -mt-32"></div>
      <div className="grid grid-cols-12 gap-12 relative z-10">
      <div className="col-span-12 lg:col-span-4">
      <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-6">Profile Identity</h3>
      <div className="group relative">
      <div className="w-full aspect-square bg-surface-container-low border-2 border-dashed border-outline-variant/50 rounded-xl flex flex-col items-center justify-center gap-4 group-hover:border-primary-container/30 transition-all cursor-pointer">
      <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center shadow-sm">
      <span className="material-symbols-outlined text-3xl text-outline group-hover:text-primary-container transition-colors">add_a_photo</span>
      </div>
      <div className="text-center">
      <p className="text-xs font-bold text-primary">Drag &amp; drop photo</p>
      <p className="text-[10px] text-outline mt-1">PNG, JPG up to 5MB</p>
      </div>
      </div>
      </div>
      <div className="mt-6 p-4 bg-primary-container/5 rounded-lg border border-primary-container/10">
      <div className="flex gap-3">
      <span className="material-symbols-outlined text-primary-container text-sm">info</span>
      <p className="text-[11px] leading-relaxed text-on-primary-container font-medium">
                                    Identity verification requires a clear, professional headshot against a neutral background.
                                </p>
      </div>
      </div>
      </div>
      <div className="col-span-12 lg:col-span-8">
      <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-6">Details</h3>
      <form className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
      <div className="relative group">
      <label className="block text-[10px] font-bold text-outline-variant uppercase tracking-widest mb-1 transition-colors group-focus-within:text-tertiary-fixed-dim">First Name</label>
      <input className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-tertiary-fixed-dim focus:ring-0 p-0 pb-2 text-primary font-medium placeholder:text-outline-variant/50 transition-all" placeholder="e.g. Jonathan" type="text"/>
      </div>
      <div className="relative group">
      <label className="block text-[10px] font-bold text-outline-variant uppercase tracking-widest mb-1 transition-colors group-focus-within:text-tertiary-fixed-dim">Last Name</label>
      <input className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-tertiary-fixed-dim focus:ring-0 p-0 pb-2 text-primary font-medium placeholder:text-outline-variant/50 transition-all" placeholder="e.g. Sterling" type="text"/>
      </div>
      <div className="relative group">
      <label className="block text-[10px] font-bold text-outline-variant uppercase tracking-widest mb-1 transition-colors group-focus-within:text-tertiary-fixed-dim">Professional Email</label>
      <input className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-tertiary-fixed-dim focus:ring-0 p-0 pb-2 text-primary font-medium placeholder:text-outline-variant/50 transition-all" placeholder="j.sterling@intechroot.com" type="email"/>
      </div>
      <div className="relative group">
      <label className="block text-[10px] font-bold text-outline-variant uppercase tracking-widest mb-1 transition-colors group-focus-within:text-tertiary-fixed-dim">Phone Number</label>
      <input className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-tertiary-fixed-dim focus:ring-0 p-0 pb-2 text-primary font-medium placeholder:text-outline-variant/50 transition-all" placeholder="+1 (555) 000-0000" type="tel"/>
      </div>
      <div className="relative group">
      <label className="block text-[10px] font-bold text-outline-variant uppercase tracking-widest mb-1 transition-colors group-focus-within:text-tertiary-fixed-dim">Date of Birth</label>
      <div className="relative">
      <input className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-tertiary-fixed-dim focus:ring-0 p-0 pb-2 text-primary font-medium transition-all" type="date"/>
      </div>
      </div>
      <div className="relative group">
      <label className="block text-[10px] font-bold text-outline-variant uppercase tracking-widest mb-1 transition-colors group-focus-within:text-tertiary-fixed-dim">Nationality</label>
      <select className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-tertiary-fixed-dim focus:ring-0 p-0 pb-2 text-primary font-medium transition-all appearance-none">
      <option value="">Select Region</option>
      <option value="US">United States</option>
      <option value="UK">United Kingdom</option>
      <option value="DE">Germany</option>
      <option value="SG">Singapore</option>
      <option value="AU">Australia</option>
      </select>
      <span className="material-symbols-outlined absolute right-0 bottom-2 text-outline pointer-events-none text-lg">expand_more</span>
      </div>
      </div>
      </form>
      </div>
      </div>
      <div className="mt-16 pt-10 border-t border-outline-variant/10 flex justify-end items-center gap-6">
      <button className="px-6 py-2.5 text-sm font-bold text-outline hover:text-primary transition-colors" onClick={() => navigate("/admin/employees")}>
                        Cancel
                    </button>
      <button className="px-10 py-3 bg-primary-container text-on-primary text-sm font-bold rounded-lg flex items-center gap-3 shadow-xl shadow-primary-container/10 hover:-translate-y-0.5 active:scale-95 transition-all" onClick={() => navigate("/admin/employees/onboarding/review")}>
                        Save &amp; Continue
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
      </button>
      </div>
      </div>
      </div>
      <div className="fixed bottom-0 right-0 p-8 -z-10 opacity-5">
      <span className="material-symbols-outlined text-[20rem]" style={{ fontVariationSettings: "'wght' 100" }}>architecture</span>
      </div>
      </main>
    </>
  );
}
