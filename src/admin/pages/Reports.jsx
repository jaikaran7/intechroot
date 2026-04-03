export default function Reports() {
  return (
    <>
      <header className="fixed top-0 right-0 left-64 h-16 bg-white/60 backdrop-blur-xl z-40 flex items-center justify-between px-8 border-b border-slate-200/50 shadow-sm shadow-slate-200/20">
      <div className="flex items-center bg-surface-container-low rounded-lg px-3 py-1.5 w-96 group focus-within:ring-2 focus-within:ring-[#4cd7f6]/20 transition-all">
      <span className="material-symbols-outlined text-slate-400 text-sm" data-icon="search">search</span>
      <input className="bg-transparent border-none focus:ring-0 text-sm w-full font-inter" placeholder="Search reports and analytics..." type="text"/>
      </div>
      <div className="flex items-center gap-4">
      <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 transition-all">
      <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
      </button>
      <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 transition-all">
      <span className="material-symbols-outlined" data-icon="help_outline">help_outline</span>
      </button>
      <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
      <button className="flex items-center gap-2 px-3 py-2 bg-primary-container text-on-primary-container rounded-lg text-xs font-bold transition-all hover:scale-[1.02] active:scale-95">
      <span className="material-symbols-outlined text-sm" data-icon="download">download</span>
                      Export Report
                  </button>
      </div>
      </header>

      <main className="ml-64 pt-16 min-h-screen">
      <div className="p-10 max-w-[1600px] mx-auto">

      <div className="mb-12">
      <span className="text-secondary font-bold text-xs uppercase tracking-[0.2em] mb-3 block">Executive Insights</span>
      <h2 className="text-[3.5rem] font-extrabold leading-tight tracking-tighter text-primary -ml-1">Strategic Operations <br/><span className="text-on-primary-container">&amp; Analytics.</span></h2>
      <div className="mt-6 flex items-center gap-4">
      <div className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2 rounded-full border border-outline-variant/15 shadow-sm">
      <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-pulse"></span>
      <span className="text-xs font-semibold text-on-surface-variant">Live Data: Q3 Fiscal Performance</span>
      </div>
      </div>
      </div>

      <div className="grid grid-cols-12 gap-6 mb-12">

      <div className="col-span-8 bg-surface-container-lowest/70 backdrop-blur-md rounded-xl p-8 border border-outline-variant/15 shadow-[0px_40px_40px_-20px_rgba(0,6,21,0.04)] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-secondary/10 to-tertiary-fixed-dim/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
      <div className="flex justify-between items-start mb-10 relative z-10">
      <div>
      <h3 className="text-xl font-bold text-primary mb-1">Recruitment Velocity</h3>
      <p className="text-sm text-on-surface-variant">Hiring trend vs projected growth targets</p>
      </div>
      <div className="flex gap-2">
      <span className="px-3 py-1 bg-surface-container rounded text-[10px] font-bold uppercase tracking-wider">Weekly</span>
      <span className="px-3 py-1 bg-primary text-white rounded text-[10px] font-bold uppercase tracking-wider">Monthly</span>
      </div>
      </div>

      <div className="flex items-end justify-between h-48 gap-4 px-2 relative z-10">
      <div className="flex-1 group">
      <div className="w-full bg-surface-container rounded-t-sm h-[40%] transition-all group-hover:bg-secondary/40"></div>
      <span className="text-[10px] text-slate-400 mt-2 block text-center uppercase font-bold">Jan</span>
      </div>
      <div className="flex-1 group">
      <div className="w-full bg-surface-container rounded-t-sm h-[55%] transition-all group-hover:bg-secondary/40"></div>
      <span className="text-[10px] text-slate-400 mt-2 block text-center uppercase font-bold">Feb</span>
      </div>
      <div className="flex-1 group">
      <div className="w-full bg-surface-container rounded-t-sm h-[45%] transition-all group-hover:bg-secondary/40"></div>
      <span className="text-[10px] text-slate-400 mt-2 block text-center uppercase font-bold">Mar</span>
      </div>
      <div className="flex-1 group">
      <div className="w-full bg-primary-container rounded-t-sm h-[75%] transition-all hover:scale-x-105"></div>
      <span className="text-[10px] text-primary mt-2 block text-center uppercase font-bold">Apr</span>
      </div>
      <div className="flex-1 group">
      <div className="w-full bg-secondary-container rounded-t-sm h-[90%] transition-all hover:scale-x-105 relative">
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Peak: 412</div>
      </div>
      <span className="text-[10px] text-slate-400 mt-2 block text-center uppercase font-bold">May</span>
      </div>
      <div className="flex-1 group">
      <div className="w-full bg-surface-container rounded-t-sm h-[60%] transition-all group-hover:bg-secondary/40"></div>
      <span className="text-[10px] text-slate-400 mt-2 block text-center uppercase font-bold">Jun</span>
      </div>
      <div className="flex-1 group">
      <div className="w-full bg-surface-container rounded-t-sm h-[65%] transition-all group-hover:bg-secondary/40"></div>
      <span className="text-[10px] text-slate-400 mt-2 block text-center uppercase font-bold">Jul</span>
      </div>
      </div>
      </div>

      <div className="col-span-4 flex flex-col gap-6">
      <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/15 flex-1 shadow-sm group hover:border-tertiary-fixed-dim/50 transition-all">
      <div className="flex justify-between items-center mb-4">
      <span className="material-symbols-outlined text-secondary bg-secondary/10 p-2 rounded-lg" data-icon="trending_up">trending_up</span>
      <span className="text-xs font-bold text-on-tertiary-container">+14.2%</span>
      </div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Retention Rate</p>
      <h4 className="text-3xl font-extrabold text-primary">94.8%</h4>
      <div className="mt-4 w-full h-1 bg-surface-container rounded-full overflow-hidden">
      <div className="bg-secondary h-full w-[94.8%]"></div>
      </div>
      </div>
      <div className="bg-primary-container rounded-xl p-6 border border-primary text-white flex-1 shadow-lg shadow-primary-container/10">
      <div className="flex justify-between items-center mb-4">
      <span className="material-symbols-outlined text-tertiary-fixed bg-tertiary-fixed/10 p-2 rounded-lg" data-icon="account_balance_wallet" style={{fontVariationSettings: "'FILL' 1"}}>account_balance_wallet</span>
      <span className="text-xs font-bold text-tertiary-fixed">-2.1% Costs</span>
      </div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Avg. Cost Per Hire</p>
      <h4 className="text-3xl font-extrabold text-white">$4,280</h4>
      <p className="mt-3 text-[10px] text-slate-400 leading-relaxed">Efficient resource allocation in Q3 resulted in a total saving of $240k across technical departments.</p>
      </div>
      </div>

      <div className="col-span-4 bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/15 shadow-sm">
      <h3 className="text-xl font-bold text-primary mb-6">Staffing Mix</h3>
      <div className="flex flex-col items-center">
      <div className="relative w-48 h-48 mb-8">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">

      <circle className="text-surface-container" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="12"></circle>

      <circle className="text-primary-container" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="87.9" strokeWidth="12"></circle>

      <circle className="text-secondary" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="188.4" strokeWidth="12"></circle>

      <circle className="text-tertiary-fixed-dim" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="226" strokeWidth="12"></circle>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
      <span className="text-2xl font-bold text-primary">1,240</span>
      <span className="text-[10px] text-slate-400 uppercase font-bold">Total Staff</span>
      </div>
      </div>
      <div className="w-full grid grid-cols-2 gap-4">
      <div className="flex items-center gap-2">
      <span className="w-3 h-3 rounded-sm bg-primary-container"></span>
      <span className="text-[10px] font-bold uppercase text-slate-500">65% Perm</span>
      </div>
      <div className="flex items-center gap-2">
      <span className="w-3 h-3 rounded-sm bg-secondary"></span>
      <span className="text-[10px] font-bold uppercase text-slate-500">25% Contract</span>
      </div>
      <div className="flex items-center gap-2">
      <span className="w-3 h-3 rounded-sm bg-tertiary-fixed-dim"></span>
      <span className="text-[10px] font-bold uppercase text-slate-500">10% Remote</span>
      </div>
      </div>
      </div>
      </div>

      <div className="col-span-8 bg-surface-container-lowest rounded-xl border border-outline-variant/15 shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
      <h3 className="text-lg font-bold text-primary">Regional Performance Metrics</h3>
      <div className="flex gap-4">
      <button className="text-xs font-bold text-slate-400 hover:text-primary transition-colors flex items-center gap-1">
      <span className="material-symbols-outlined text-sm" data-icon="filter_list">filter_list</span> Filter
                                  </button>
      <button className="text-xs font-bold text-slate-400 hover:text-primary transition-colors flex items-center gap-1">
      <span className="material-symbols-outlined text-sm" data-icon="csv">description</span> CSV
                                  </button>
      </div>
      </div>
      <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
      <thead>
      <tr className="bg-surface-container-low">
      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Region / Territory</th>
      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Leads</th>
      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Placements</th>
      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Revenue Impact</th>
      <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Efficiency</th>
      </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
      <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4">
      <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-xs font-bold text-primary">NA</div>
      <div>
      <p className="text-xs font-bold text-primary">North America</p>
      <p className="text-[10px] text-slate-400">Primary Hub</p>
      </div>
      </div>
      </td>
      <td className="px-6 py-4 text-xs text-slate-600 font-medium">842</td>
      <td className="px-6 py-4 text-xs text-slate-600 font-medium">124</td>
      <td className="px-6 py-4 text-xs font-bold text-primary">$2.4M</td>
      <td className="px-6 py-4">
      <div className="flex items-center gap-2">
      <span className="text-[10px] font-bold text-on-tertiary-container bg-tertiary-fixed/30 px-2 py-0.5 rounded">High</span>
      </div>
      </td>
      </tr>
      <tr className="bg-surface-container-low hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4">
      <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-xs font-bold text-primary">EU</div>
      <div>
      <p className="text-xs font-bold text-primary">European Union</p>
      <p className="text-[10px] text-slate-400">Expansion Core</p>
      </div>
      </div>
      </td>
      <td className="px-6 py-4 text-xs text-slate-600 font-medium">615</td>
      <td className="px-6 py-4 text-xs text-slate-600 font-medium">98</td>
      <td className="px-6 py-4 text-xs font-bold text-primary">$1.8M</td>
      <td className="px-6 py-4">
      <div className="flex items-center gap-2">
      <span className="text-[10px] font-bold text-on-secondary-container bg-secondary-container/30 px-2 py-0.5 rounded">Med</span>
      </div>
      </td>
      </tr>
      <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4">
      <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-xs font-bold text-primary">AP</div>
      <div>
      <p className="text-xs font-bold text-primary">Asia Pacific</p>
      <p className="text-[10px] text-slate-400">Growth Sector</p>
      </div>
      </div>
      </td>
      <td className="px-6 py-4 text-xs text-slate-600 font-medium">422</td>
      <td className="px-6 py-4 text-xs text-slate-600 font-medium">56</td>
      <td className="px-6 py-4 text-xs font-bold text-primary">$0.9M</td>
      <td className="px-6 py-4">
      <div className="flex items-center gap-2">
      <span className="text-[10px] font-bold text-on-error-container bg-error-container/30 px-2 py-0.5 rounded">Low</span>
      </div>
      </td>
      </tr>
      </tbody>
      </table>
      </div>
      </div>
      </div>

      <div className="grid grid-cols-3 gap-12 mt-16 pt-16 border-t border-slate-200">
      <div className="col-span-1">
      <h5 className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-4">Strategic Advisory</h5>
      <p className="text-sm text-on-surface-variant leading-relaxed">
                              InTechRoot's automated reporting engine synthesizes complex operational data into actionable intelligence. The current trajectory suggests a 12% increase in resource utilization if current retention trends continue.
                          </p>
      </div>
      <div className="col-span-2 relative">
      <div className="grid grid-cols-2 gap-8">
      <div className="flex items-start gap-4">
      <span className="material-symbols-outlined text-secondary" data-icon="auto_awesome">auto_awesome</span>
      <div>
      <p className="text-sm font-bold text-primary">Predictive Scaling</p>
      <p className="text-xs text-on-surface-variant mt-1">AI-driven forecasts suggest optimal hiring windows for Q4 technical roles.</p>
      </div>
      </div>
      <div className="flex items-start gap-4">
      <span className="material-symbols-outlined text-secondary" data-icon="security">security</span>
      <div>
      <p className="text-sm font-bold text-primary">Data Integrity</p>
      <p className="text-xs text-on-surface-variant mt-1">All reports are encrypted and audited per ISO 27001 enterprise standards.</p>
      </div>
      </div>
      </div>

      <div className="absolute -bottom-20 -right-20 opacity-[0.03] pointer-events-none select-none">
      <svg height="400" viewBox="0 0 100 100" width="400">
      <path className="text-primary" d="M0 50 Q 25 0 50 50 T 100 50" fill="none" stroke="currentColor" strokeWidth="0.5"></path>
      <path className="text-primary" d="M0 60 Q 25 10 50 60 T 100 60" fill="none" stroke="currentColor" strokeWidth="0.5"></path>
      <path className="text-primary" d="M0 40 Q 25 -10 50 40 T 100 40" fill="none" stroke="currentColor" strokeWidth="0.5"></path>
      </svg>
      </div>
      </div>
      </div>
      </div>
      </main>
    </>
  );
}
