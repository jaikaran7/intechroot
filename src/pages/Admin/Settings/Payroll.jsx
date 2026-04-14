export default function Payroll() {
  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/60 backdrop-blur-xl border-b border-slate-200/50 shadow-sm shadow-slate-200/20 flex items-center justify-between h-16 px-8 ml-64">
      <div className="flex items-center gap-4 flex-1">
      <div className="relative w-full max-w-md focus-within:ring-2 focus-within:ring-[#4cd7f6]/20 transition-all rounded-lg">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
      <input className="w-full bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-2 text-sm font-inter focus:ring-0 focus:bg-white transition-all" placeholder="Search payroll records..." type="text"/>
      </div>
      </div>
      <div className="flex items-center gap-6">
      <div className="flex items-center gap-3">
      <button className="p-2 hover:bg-slate-50 rounded-lg transition-all relative">
      <span className="material-symbols-outlined text-slate-500">notifications</span>
      <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
      </button>
      <button className="p-2 hover:bg-slate-50 rounded-lg transition-all">
      <span className="material-symbols-outlined text-slate-500">help_outline</span>
      </button>
      </div>
      <div className="h-8 w-[1px] bg-slate-200"></div>
      <div className="flex items-center gap-3">
      <div className="text-right">
      <p className="text-xs font-bold text-primary">Alex Sterling</p>
      <p className="text-[10px] text-slate-500 uppercase tracking-tight">FinOps Lead</p>
      </div>
      <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
      <img className="w-full h-full object-cover" data-alt="professional portrait of a financial administrator with a clean business casual look in a modern bright office environment" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeHdI16_YktIHIHK3hY90jh9h1lBtRcONN_oy1eZWPHUB4_ayhDiHryuSHy9sjM4ycPjWrAwDHXzekuGXrkHPWuqW52rlDNXIZCk4CSSg0R0pP9F0kmUxgy9aQincz9jJHuX-N6x-5gPryZaOa2WLsLUsop-EN5kj3HqqB642Ci-asy4lF3jWWp12DHq9usbUOye3wsTEubCaSguy3H0AGIWo8EktLEtlhnxUEoC2xD3256SfVgZC0D78AdKuaTpR-GoSVZPxlny2m"/>
      </div>
      </div>
      </div>
      </header>

      <main className="ml-64 p-12 min-h-[calc(100vh-64px)]">

      <div className="max-w-7xl mx-auto mb-12">
      <div className="flex items-end justify-between mb-10">
      <div className="space-y-1">
      <h2 className="text-3xl font-extrabold font-headline tracking-tighter text-primary">Payroll Executive Overview</h2>
      <p className="text-on-surface-variant font-body">Managing financial cycles for Q3 Enterprise operations.</p>
      </div>
      <button className="bg-primary-container text-on-primary px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2 hover:-translate-y-0.5 transition-transform monolith-shadow">
      <span className="material-symbols-outlined text-sm">add</span>
                          Run New Payroll
                      </button>
      </div>
      <div className="grid grid-cols-12 gap-6">

      <div className="col-span-12 md:col-span-7 glass-card p-8 rounded-xl monolith-shadow flex flex-col justify-between overflow-hidden relative">
      <div className="relative z-10">
      <p className="text-secondary font-bold text-xs uppercase tracking-widest mb-2">Quarterly Disbursement</p>
      <h3 className="text-5xl font-extrabold font-headline tracking-tighter text-primary">$1,284,500.00</h3>
      <div className="flex items-center gap-2 mt-4 text-sm font-medium text-on-tertiary-container bg-tertiary-fixed-dim/20 px-3 py-1 rounded-full w-fit">
      <span className="material-symbols-outlined text-sm">trending_up</span>
                                  +4.2% from last month
                              </div>
      </div>

      <div className="absolute right-0 bottom-0 w-64 h-64 bg-gradient-to-tr from-secondary/10 to-tertiary-fixed-dim/20 blur-3xl -z-0"></div>
      </div>

      <div className="col-span-12 md:col-span-5 bg-primary-container text-white p-8 rounded-xl flex flex-col justify-between">
      <div>
      <p className="text-on-primary-container font-bold text-xs uppercase tracking-widest mb-2">Next Pay Cycle</p>
      <h3 className="text-4xl font-headline font-bold">October 15, 2023</h3>
      </div>
      <div className="flex items-center justify-between mt-8 border-t border-white/10 pt-4">
      <div className="text-sm">
      <span className="block opacity-60">Status</span>
      <span className="font-bold">Pending Review</span>
      </div>
      <span className="material-symbols-outlined text-4xl opacity-20">event_upcoming</span>
      </div>
      </div>

      <div className="col-span-12 md:col-span-4 surface-container-lowest p-6 rounded-xl border border-outline-variant/15 flex items-center gap-4">
      <div className="w-12 h-12 bg-surface-container rounded-lg flex items-center justify-center">
      <span className="material-symbols-outlined text-secondary">group</span>
      </div>
      <div>
      <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Total Employees</p>
      <p className="text-xl font-headline font-bold">482 Active</p>
      </div>
      </div>

      <div className="col-span-12 md:col-span-4 surface-container-lowest p-6 rounded-xl border border-outline-variant/15 flex items-center gap-4">
      <div className="w-12 h-12 bg-surface-container rounded-lg flex items-center justify-center">
      <span className="material-symbols-outlined text-secondary">account_balance_wallet</span>
      </div>
      <div>
      <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Taxes Withheld</p>
      <p className="text-xl font-headline font-bold">$342,120.00</p>
      </div>
      </div>

      <div className="col-span-12 md:col-span-4 surface-container-lowest p-6 rounded-xl border border-outline-variant/15 flex items-center gap-4">
      <div className="w-12 h-12 bg-surface-container rounded-lg flex items-center justify-center">
      <span className="material-symbols-outlined text-secondary">verified</span>
      </div>
      <div>
      <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Compliance Score</p>
      <p className="text-xl font-headline font-bold">99.8% Perfect</p>
      </div>
      </div>
      </div>
      </div>

      <section className="max-w-7xl mx-auto">
      <div className="bg-surface-container-lowest rounded-xl overflow-hidden monolith-shadow">
      <div className="px-8 py-6 flex items-center justify-between border-b border-outline-variant/10">
      <h3 className="text-lg font-extrabold font-headline text-primary">Recent Payroll Transactions</h3>
      <div className="flex items-center gap-4">
      <button className="text-xs font-bold text-slate-500 hover:text-primary transition-colors flex items-center gap-1">
      <span className="material-symbols-outlined text-sm">filter_list</span> Filter
                              </button>
      <button className="text-xs font-bold text-slate-500 hover:text-primary transition-colors flex items-center gap-1">
      <span className="material-symbols-outlined text-sm">download</span> Export CSV
                              </button>
      </div>
      </div>
      <table className="w-full text-left">
      <thead>
      <tr className="bg-slate-50/50 text-slate-500 uppercase text-[10px] font-bold tracking-widest">
      <th className="px-8 py-4">Employee</th>
      <th className="px-8 py-4">Payroll ID</th>
      <th className="px-8 py-4 text-right">Net Amount</th>
      <th className="px-8 py-4">Status</th>
      <th className="px-8 py-4">Period</th>
      <th className="px-8 py-4"></th>
      </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">

      <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-8 py-5">
      <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-primary-fixed-dim text-on-primary-fixed-variant flex items-center justify-center text-xs font-bold">JD</div>
      <div>
      <p className="text-sm font-bold text-primary">Julianne DeMarco</p>
      <p className="text-xs text-slate-400">Senior Solutions Architect</p>
      </div>
      </div>
      </td>
      <td className="px-8 py-5 font-mono text-xs text-slate-500">PAY-9021-X</td>
      <td className="px-8 py-5 text-right font-bold text-sm">$8,450.00</td>
      <td className="px-8 py-5">
      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-1 bg-green-50 text-green-700 rounded-full">
      <span className="w-1 h-1 bg-green-600 rounded-full"></span> Processed
                                      </span>
      </td>
      <td className="px-8 py-5 text-xs text-slate-500">Sep 01 - Sep 15</td>
      <td className="px-8 py-5 text-right">
      <button className="text-slate-400 hover:text-primary"><span className="material-symbols-outlined text-lg">more_horiz</span></button>
      </td>
      </tr>

      <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-8 py-5">
      <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center text-xs font-bold">MK</div>
      <div>
      <p className="text-sm font-bold text-primary">Marcus Karlsson</p>
      <p className="text-xs text-slate-400">Cloud Infrastructure Engineer</p>
      </div>
      </div>
      </td>
      <td className="px-8 py-5 font-mono text-xs text-slate-500">PAY-8842-B</td>
      <td className="px-8 py-5 text-right font-bold text-sm">$7,120.00</td>
      <td className="px-8 py-5">
      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-1 bg-amber-50 text-amber-700 rounded-full">
      <span className="w-1 h-1 bg-amber-600 rounded-full"></span> Processing
                                      </span>
      </td>
      <td className="px-8 py-5 text-xs text-slate-500">Sep 01 - Sep 15</td>
      <td className="px-8 py-5 text-right">
      <button className="text-slate-400 hover:text-primary"><span className="material-symbols-outlined text-lg">more_horiz</span></button>
      </td>
      </tr>

      <tr className="bg-surface-container-low hover:bg-slate-100/50 transition-colors">
      <td className="px-8 py-5">
      <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-tertiary-fixed-dim text-on-tertiary-fixed flex items-center justify-center text-xs font-bold">ET</div>
      <div>
      <p className="text-sm font-bold text-primary">Elena Tsvetkova</p>
      <p className="text-xs text-slate-400">Project Manager</p>
      </div>
      </div>
      </td>
      <td className="px-8 py-5 font-mono text-xs text-slate-500">PAY-7721-Z</td>
      <td className="px-8 py-5 text-right font-bold text-sm">$6,880.00</td>
      <td className="px-8 py-5">
      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-1 bg-green-50 text-green-700 rounded-full">
      <span className="w-1 h-1 bg-green-600 rounded-full"></span> Processed
                                      </span>
      </td>
      <td className="px-8 py-5 text-xs text-slate-500">Sep 01 - Sep 15</td>
      <td className="px-8 py-5 text-right">
      <button className="text-slate-400 hover:text-primary"><span className="material-symbols-outlined text-lg">more_horiz</span></button>
      </td>
      </tr>

      <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-8 py-5">
      <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">RB</div>
      <div>
      <p className="text-sm font-bold text-primary">Richard Branson</p>
      <p className="text-xs text-slate-400">Head of Talent Acquisition</p>
      </div>
      </div>
      </td>
      <td className="px-8 py-5 font-mono text-xs text-slate-500">PAY-5521-A</td>
      <td className="px-8 py-5 text-right font-bold text-sm">$12,400.00</td>
      <td className="px-8 py-5">
      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-1 bg-red-50 text-red-700 rounded-full">
      <span className="w-1 h-1 bg-red-600 rounded-full"></span> Failed
                                      </span>
      </td>
      <td className="px-8 py-5 text-xs text-slate-500">Sep 01 - Sep 15</td>
      <td className="px-8 py-5 text-right">
      <button className="text-slate-400 hover:text-primary"><span className="material-symbols-outlined text-lg">more_horiz</span></button>
      </td>
      </tr>

      <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-8 py-5">
      <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center text-xs font-bold">AS</div>
      <div>
      <p className="text-sm font-bold text-primary">Aisha Sharma</p>
      <p className="text-xs text-slate-400">QA Lead</p>
      </div>
      </div>
      </td>
      <td className="px-8 py-5 font-mono text-xs text-slate-500">PAY-3310-M</td>
      <td className="px-8 py-5 text-right font-bold text-sm">$5,950.00</td>
      <td className="px-8 py-5">
      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-1 bg-green-50 text-green-700 rounded-full">
      <span className="w-1 h-1 bg-green-600 rounded-full"></span> Processed
                                      </span>
      </td>
      <td className="px-8 py-5 text-xs text-slate-500">Sep 01 - Sep 15</td>
      <td className="px-8 py-5 text-right">
      <button className="text-slate-400 hover:text-primary"><span className="material-symbols-outlined text-lg">more_horiz</span></button>
      </td>
      </tr>
      </tbody>
      </table>
      <div className="px-8 py-4 bg-slate-50/30 flex items-center justify-between">
      <p className="text-xs text-slate-500">Showing 1-10 of 482 employees</p>
      <div className="flex items-center gap-2">
      <button className="p-1 text-slate-400 hover:text-primary disabled:opacity-30" disabled>
      <span className="material-symbols-outlined">chevron_left</span>
      </button>
      <button className="p-1 text-slate-400 hover:text-primary">
      <span className="material-symbols-outlined">chevron_right</span>
      </button>
      </div>
      </div>
      </div>
      </section>

      <section className="max-w-7xl mx-auto mt-12 grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-8 p-10 bg-slate-900 rounded-2xl relative overflow-hidden text-white monolith-shadow">
      <div className="relative z-10">
      <h4 className="text-2xl font-extrabold font-headline mb-4">Security &amp; Compliance First</h4>
      <p className="text-slate-400 max-w-lg mb-6 leading-relaxed">Your payroll data is protected with 256-bit encryption and multi-sig authorization flows. All disbursements are automatically reconciled against local tax regulations across 40+ jurisdictions.</p>
      <div className="flex gap-8">
      <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-tertiary-fixed-dim">verified_user</span>
      <span className="text-xs font-bold uppercase tracking-widest">SOC2 Certified</span>
      </div>
      <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-tertiary-fixed-dim">lock</span>
      <span className="text-xs font-bold uppercase tracking-widest">End-to-End Encryption</span>
      </div>
      </div>
      </div>

      <div className="absolute inset-0 opacity-10 pointer-events-none">
      <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
      <path d="M0,50 Q25,30 50,50 T100,50" fill="none" stroke="white" strokeWidth="0.5"></path>
      <path d="M0,70 Q25,50 50,70 T100,70" fill="none" stroke="white" strokeWidth="0.5"></path>
      <circle cx="20" cy="40" fill="white" r="1"></circle>
      <circle cx="80" cy="60" fill="white" r="1"></circle>
      </svg>
      </div>
      </div>

      <div className="col-span-12 lg:col-span-4 glass-card p-10 rounded-2xl flex flex-col justify-center">
      <h4 className="text-sm font-extrabold text-primary uppercase tracking-widest mb-6">Quick Links</h4>
      <ul className="space-y-4">
      <li><Link className="flex items-center justify-between p-3 rounded-lg hover:bg-white transition-all group" to="#">
      <span className="text-sm font-bold text-slate-600 group-hover:text-primary">Tax Documents (W2/1099)</span>
      <span className="material-symbols-outlined text-slate-300">chevron_right</span>
      </Link></li>
      <li><Link className="flex items-center justify-between p-3 rounded-lg hover:bg-white transition-all group" to="#">
      <span className="text-sm font-bold text-slate-600 group-hover:text-primary">Benefits Enrollment</span>
      <span className="material-symbols-outlined text-slate-300">chevron_right</span>
      </Link></li>
      <li><Link className="flex items-center justify-between p-3 rounded-lg hover:bg-white transition-all group" to="#">
      <span className="text-sm font-bold text-slate-600 group-hover:text-primary">Direct Deposit Settings</span>
      <span className="material-symbols-outlined text-slate-300">chevron_right</span>
      </Link></li>
      </ul>
      </div>
      </section>
      </main>
    </>
  );
}
