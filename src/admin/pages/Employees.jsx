import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEmployees } from "../../data";

export default function Employees() {
  const navigate = useNavigate();
  const employees = useMemo(() => {
    try {
      const list = getEmployees();
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  }, []);
  const getStatusPresentation = (status) => {
    if (status === "On Leave") {
      return { dotClass: "bg-outline", textClass: "text-on-surface-variant" };
    }
    return { dotClass: "bg-[#0094ac]", textClass: "text-on-tertiary-container" };
  };
  const [selectedEmployee, setSelectedEmployee] = useState(employees[0] ?? null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("Active");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const roleOptions = useMemo(() => ["All", ...new Set(employees.map((employee) => employee.role))], [employees]);
  const statusOptions = useMemo(() => ["All", ...new Set(employees.map((employee) => employee.status))], [employees]);
  const departmentOptions = useMemo(() => ["All", ...new Set(employees.map((employee) => employee.department))], [employees]);
  const filteredEmployees = useMemo(
    () =>
      employees.filter((employee) => {
        const query = searchQuery.trim().toLowerCase();
        const matchesSearch =
          query.length === 0 ||
          employee.name.toLowerCase().includes(query) ||
          employee.email.toLowerCase().includes(query) ||
          employee.role.toLowerCase().includes(query) ||
          employee.department.toLowerCase().includes(query);
        const matchesRole = roleFilter === "All" || employee.role === roleFilter;
        const matchesStatus = statusFilter === "All" || employee.status === statusFilter;
        const matchesDepartment = departmentFilter === "All" || employee.department === departmentFilter;
        return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
      }),
    [departmentFilter, employees, roleFilter, searchQuery, statusFilter],
  );

  useEffect(() => {
    if (filteredEmployees.length === 0) {
      return;
    }
    const selectedStillVisible = filteredEmployees.some((employee) => employee.id === selectedEmployee?.id);
    if (!selectedStillVisible) {
      setSelectedEmployee(filteredEmployees[0]);
    }
  }, [filteredEmployees, selectedEmployee]);

  if (!employees.length) {
    return (
      <main className="ml-64 min-h-screen p-8 font-body text-on-surface-variant">
        No employee data available.
      </main>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/60 backdrop-blur-xl border-b border-slate-200/50 flex items-center justify-between h-16 px-8 ml-64 max-w-[calc(100%-16rem)]">
      <div className="flex items-center flex-1 max-w-xl">
      <div className="relative w-full group">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-secondary transition-colors" data-icon="search">search</span>
      <input className="w-full bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#4cd7f6]/20 placeholder:text-slate-400 font-inter" onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search employees, records, or departments..." type="text" value={searchQuery}/>
      </div>
      </div>
      <div className="flex items-center gap-4">
      <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-all relative">
      <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
      <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
      </button>
      <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-all">
      <span className="material-symbols-outlined" data-icon="help_outline">help_outline</span>
      </button>
      <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
      <button className="flex items-center gap-2 px-4 py-2 bg-primary-container text-white rounded-lg text-sm font-semibold hover:bg-primary transition-all" onClick={() => navigate("/admin/employees/onboarding")}>
      <span className="material-symbols-outlined text-sm" data-icon="add">add</span>
                      Add Employee
                  </button>
      </div>
      </header>

      <main className="ml-64 p-10 min-h-screen">
      <div className="max-w-7xl mx-auto">

      <div className="flex justify-between items-end mb-10">
      <div className="max-w-2xl">
      <h2 className="text-4xl font-extrabold font-headline tracking-tight text-primary mb-2">Employees</h2>
      <p className="text-on-surface-variant font-body leading-relaxed">Manage your global workforce, track professional development, and monitor departmental status in real-time from a single editorial interface.</p>
      </div>
      <div className="flex items-center gap-3">
      <div className="px-4 py-2 bg-surface-container rounded-lg flex items-center gap-2">
      <span className="text-xs font-bold uppercase tracking-wider text-secondary">Total Headcount</span>
      <span className="text-lg font-bold text-primary">{employees.length.toLocaleString()}</span>
      </div>
      </div>
      </div>
      <div className="grid grid-cols-12 gap-8">

      <div className="col-span-12 lg:col-span-8 space-y-6">

      <div className="flex flex-wrap items-center gap-4 p-2 bg-surface-container-low rounded-xl">
      <div className="relative bg-white px-4 py-2 rounded-lg shadow-sm flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
      <span className="text-xs font-bold text-on-surface-variant">Role:</span>
      <span className="text-sm font-semibold text-primary">{roleFilter === "All" ? "All Positions" : roleFilter}</span>
      <span className="material-symbols-outlined text-sm" data-icon="expand_more">expand_more</span>
      <select className="absolute inset-0 opacity-0 cursor-pointer" onChange={(event) => setRoleFilter(event.target.value)} value={roleFilter}>
      {roleOptions.map((option) => (
      <option key={option} value={option}>
        {option === "All" ? "All Positions" : option}
      </option>
      ))}
      </select>
      </div>
      <div className="relative bg-white px-4 py-2 rounded-lg shadow-sm flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
      <span className="text-xs font-bold text-on-surface-variant">Status:</span>
      <span className="text-sm font-semibold text-primary">{statusFilter}</span>
      <span className="material-symbols-outlined text-sm" data-icon="expand_more">expand_more</span>
      <select className="absolute inset-0 opacity-0 cursor-pointer" onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}>
      {statusOptions.map((option) => (
      <option key={option} value={option}>{option}</option>
      ))}
      </select>
      </div>
      <div className="relative bg-white px-4 py-2 rounded-lg shadow-sm flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
      <span className="text-xs font-bold text-on-surface-variant">Department:</span>
      <span className="text-sm font-semibold text-primary">{departmentFilter}</span>
      <span className="material-symbols-outlined text-sm" data-icon="expand_more">expand_more</span>
      <select className="absolute inset-0 opacity-0 cursor-pointer" onChange={(event) => setDepartmentFilter(event.target.value)} value={departmentFilter}>
      {departmentOptions.map((option) => (
      <option key={option} value={option}>{option}</option>
      ))}
      </select>
      </div>
      <button className="ml-auto flex items-center gap-2 text-secondary font-bold text-sm px-4" onClick={() => { setSearchQuery(""); setRoleFilter("All"); setStatusFilter("Active"); setDepartmentFilter("All"); }}>
      <span className="material-symbols-outlined text-lg" data-icon="filter_list">filter_list</span>
                                  Clear Filters
                              </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-outline-variant/10 bg-surface-container-lowest shadow-sm shadow-slate-200/20">
      <table className="w-full text-left border-collapse">
      <thead>
      <tr className="bg-surface-container-low">
      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Name</th>
      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Role</th>
      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Department</th>
      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Status</th>
      <th className="px-6 py-4"></th>
      </tr>
      </thead>
      <tbody className="divide-y divide-surface-container">
      {filteredEmployees.map((employee, index) => (
      <tr className={`${index % 2 === 1 ? "bg-surface-container-low/20 " : ""}hover:bg-surface-container-low/30 transition-colors cursor-pointer group hover:bg-slate-100/50`} key={employee.id} onClick={() => setSelectedEmployee(employee)}>
      <td className="px-6 py-5">
      <div className="flex items-center gap-3">
      {employee.avatar.type === "image" ? (
      <img className={employee.avatar.className} src={employee.avatar.image} />
      ) : (
      <div className={employee.avatar.className}>{employee.avatar.initials}</div>
      )}
      <div>
      <div className="text-sm font-bold text-primary">{employee.name}</div>
      <div className="text-xs text-on-surface-variant">{employee.email}</div>
      </div>
      </div>
      </td>
      <td className="px-6 py-5">
      <div className="text-sm font-semibold text-on-surface">{employee.role}</div>
      </td>
      <td className="px-6 py-5">
      <span className="text-xs font-bold px-2.5 py-1 bg-surface-container text-on-secondary-container rounded uppercase tracking-wide">{employee.department}</span>
      </td>
      <td className="px-6 py-5">
      <div className={`flex items-center gap-1.5 ${employee.status === "On Leave" ? "text-on-surface-variant opacity-60" : ""}`}>
      <span className={`w-2 h-2 rounded-full ${getStatusPresentation(employee.status).dotClass}`}></span>
      <span className={`text-xs font-bold ${getStatusPresentation(employee.status).textClass}`}>{employee.status}</span>
      </div>
      </td>
      <td className="px-6 py-5 text-right">
      <button className="inline-flex" onClick={(event) => { event.stopPropagation(); navigate(`/admin/employees/${employee.id}`); }}>
      <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors" data-icon="visibility">visibility</span>
      </button>
      </td>
      </tr>
      ))}
      {filteredEmployees.length === 0 && (
      <tr>
      <td className="px-6 py-8 text-sm text-on-surface-variant" colSpan={5}>
                                  No employees found
                              </td>
      </tr>
      )}
      </tbody>
      </table>
      <div className="px-6 py-4 bg-white flex items-center justify-between">
      <p className="text-xs text-on-surface-variant font-medium">Showing {filteredEmployees.length} of {employees.length.toLocaleString()} global employees</p>
      <div className="flex gap-2">
      <button className="p-1.5 rounded border border-outline-variant/30 hover:bg-surface-container transition-colors">
      <span className="material-symbols-outlined text-sm" data-icon="chevron_left">chevron_left</span>
      </button>
      <button className="p-1.5 rounded border border-outline-variant/30 hover:bg-surface-container transition-colors">
      <span className="material-symbols-outlined text-sm" data-icon="chevron_right">chevron_right</span>
      </button>
      </div>
      </div>
      </div>
      </div>

      <div className="col-span-12 lg:col-span-4">
      <div className="glass-card rounded-xl p-8 sticky top-24">
      <div className="flex flex-col items-center text-center mb-8">
      <div className="relative mb-6">
      <div className="absolute -inset-4 bg-gradient-to-tr from-secondary/20 to-tertiary-fixed-dim/20 rounded-full blur-xl"></div>
      <img className="relative w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl" data-alt="close up of a professional male executive in a studio setting with soft lighting" src={selectedEmployee.performance.panelImage}/>
      <div className="absolute bottom-1 right-1 bg-[#0094ac] w-6 h-6 rounded-full border-4 border-white"></div>
      </div>
      <h3 className="text-2xl font-bold font-headline text-primary">{selectedEmployee.name}</h3>
      <p className="text-on-surface-variant font-medium mb-4">{selectedEmployee.role}</p>
      <div className="flex gap-2">
      <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-primary-container text-white rounded-full">Admin Access</span>
      <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed rounded-full">Core Team</span>
      </div>
      </div>
      <div className="space-y-6">
      <div className="p-4 bg-surface-container-low rounded-lg">
      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter mb-1">Performance Index</p>
      <div className="flex items-end gap-2">
      <span className="text-2xl font-bold text-primary">{selectedEmployee.performance.index}</span>
      <span className="text-xs font-bold text-[#0094ac] mb-1 flex items-center"><span className="material-symbols-outlined text-xs" data-icon="trending_up">trending_up</span> {selectedEmployee.performance.delta}</span>
      </div>
      <div className="mt-2 w-full h-1 bg-surface-variant rounded-full overflow-hidden">
      <div className="w-[98.4%] h-full bg-secondary" style={{ width: selectedEmployee.performance.width }}></div>
      </div>
      </div>
      <div className="space-y-4">
      <div className="flex justify-between items-center text-sm">
      <span className="text-on-surface-variant font-medium">Department</span>
      <span className="text-primary font-bold">{selectedEmployee.department}</span>
      </div>
      <div className="flex justify-between items-center text-sm">
      <span className="text-on-surface-variant font-medium">Direct Reports</span>
      <span className="text-primary font-bold">{selectedEmployee.performance.directReports}</span>
      </div>
      <div className="flex justify-between items-center text-sm">
      <span className="text-on-surface-variant font-medium">Tenure</span>
      <span className="text-primary font-bold">{selectedEmployee.performance.tenure}</span>
      </div>
      </div>
      <div className="pt-4 grid grid-cols-2 gap-3">
      <button className="flex items-center justify-center gap-2 py-3 bg-surface-container text-primary font-bold text-sm rounded-lg hover:bg-surface-container-high transition-colors">
      <span className="material-symbols-outlined text-lg" data-icon="mail">mail</span>
                                          Message
                                      </button>
      <button className="flex items-center justify-center gap-2 py-3 border border-outline-variant text-primary font-bold text-sm rounded-lg hover:bg-white transition-all" onClick={() => selectedEmployee && navigate(`/admin/employees/${selectedEmployee.id}`)}>
      <span className="material-symbols-outlined text-lg" data-icon="edit">edit</span>
                                          Edit Profile
                                      </button>
      </div>
      </div>
      </div>

      <div className="mt-8 p-6 bg-primary-container rounded-xl text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-32 h-32 bg-secondary opacity-20 rounded-full blur-3xl"></div>
      <h4 className="text-lg font-bold font-headline mb-2 relative z-10">Departmental Pulse</h4>
      <p className="text-xs text-on-primary-container leading-relaxed mb-4 relative z-10">Real-time engagement metrics across all active enterprise clusters.</p>
      <div className="flex gap-1 items-end h-16 relative z-10">
      <div className="flex-1 bg-tertiary-fixed-dim/20 rounded-t h-[40%]"></div>
      <div className="flex-1 bg-tertiary-fixed-dim/40 rounded-t h-[70%]"></div>
      <div className="flex-1 bg-tertiary-fixed-dim/20 rounded-t h-[55%]"></div>
      <div className="flex-1 bg-tertiary-fixed-dim/60 rounded-t h-[90%]"></div>
      <div className="flex-1 bg-tertiary-fixed-dim/30 rounded-t h-[65%]"></div>
      <div className="flex-1 bg-tertiary-fixed-dim/80 rounded-t h-[100%]"></div>
      <div className="flex-1 bg-tertiary-fixed-dim/40 rounded-t h-[45%]"></div>
      </div>
      </div>
      </div>
      </div>
      </div>
      </main>

      <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary-container text-white rounded-full shadow-2xl flex items-center justify-center group hover:scale-110 transition-transform duration-200 lg:hidden">
      <span className="material-symbols-outlined text-2xl" data-icon="add">add</span>
      </button>
    </>
  );
}
