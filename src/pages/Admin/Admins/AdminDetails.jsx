import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminPanelService } from "../../../services/adminPanel.service";

function getInitials(name) {
  return String(name || "?")
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function AdminDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", status: "Active", password: "" });
  const [permissions, setPermissions] = useState({
    approveTimesheets: false,
    rejectTimesheets: false,
    editTimesheets: false,
  });

  const adminQuery = useQuery({
    queryKey: ["admin-panel-admin", id],
    queryFn: () => adminPanelService.getAdmin(id),
    enabled: !!id,
  });

  const employeesQuery = useQuery({
    queryKey: ["admin-panel-employees", "all"],
    queryFn: () => adminPanelService.getEmployees({ limit: 500 }),
    staleTime: 60_000,
  });

  const assignmentsQuery = useQuery({
    queryKey: ["admin-panel-admin-assignments", id],
    queryFn: () => adminPanelService.getAssignments(id),
    enabled: !!id,
  });

  const updateAdminMutation = useMutation({
    mutationFn: () =>
      adminPanelService.updateAdmin(id, {
        ...(form.password ? form : { ...form, password: undefined }),
        permissions,
      }),
    onSuccess: (admin) => {
      queryClient.setQueryData(["admin-panel-admin", id], admin);
      queryClient.invalidateQueries({ queryKey: ["admin-panel-admins"] });
      setForm((prev) => ({ ...prev, password: "" }));
      setIsEditing(false);
    },
  });

  const updatePermissionsMutation = useMutation({
    mutationFn: (nextPermissions) => adminPanelService.updateAdmin(id, { permissions: nextPermissions }),
    onSuccess: (admin) => {
      queryClient.setQueryData(["admin-panel-admin", id], admin);
      queryClient.invalidateQueries({ queryKey: ["admin-panel-admins"] });
    },
  });

  const deleteAdminMutation = useMutation({
    mutationFn: () => adminPanelService.deleteAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-panel-admins"] });
      navigate("/admin/admins");
    },
  });

  const assignEmployeesMutation = useMutation({
    mutationFn: () => adminPanelService.setAssignments(id, selectedEmployees),
    onSuccess: (data) => {
      queryClient.setQueryData(["admin-panel-admin-assignments", id], data);
      queryClient.invalidateQueries({ queryKey: ["admin-panel-admin", id] });
      queryClient.invalidateQueries({ queryKey: ["admin-panel-admins"] });
      setShowAssignModal(false);
    },
  });

  const admin = adminQuery.data || {
    name: "Admin",
    email: "—",
    company: "",
    status: "Inactive",
    role: "Enterprise Admin",
    employeesManaged: 0,
  };
  const activity = admin.activity || { approvalsDone: 0, rejections: 0, pending: 0, pulse: [] };
  const pulse = Array.isArray(activity.pulse) ? activity.pulse : [];
  const maxPulseCount = Math.max(1, ...pulse.map((entry) => Number(entry.count) || 0));

  const employees = useMemo(() => {
    const list = employeesQuery.data?.data;
    return Array.isArray(list) ? list : [];
  }, [employeesQuery.data]);

  const assignedEmployees = useMemo(() => assignmentsQuery.data?.employees || [], [assignmentsQuery.data]);

  useEffect(() => {
    if (!adminQuery.data) return;
    setForm({
      name: adminQuery.data.name || "",
      email: adminQuery.data.email || "",
      company: adminQuery.data.company || "",
      status: adminQuery.data.status || "Active",
      password: "",
    });
    setPermissions({
      approveTimesheets: Boolean(adminQuery.data.permissions?.approveTimesheets),
      rejectTimesheets: Boolean(adminQuery.data.permissions?.rejectTimesheets),
      editTimesheets: false,
    });
  }, [adminQuery.data]);

  useEffect(() => {
    if (!assignmentsQuery.data?.employeeIds) return;
    setSelectedEmployees(assignmentsQuery.data.employeeIds.map(String));
  }, [assignmentsQuery.data]);

  const visibleEmployees = useMemo(() => {
    const query = employeeSearch.trim().toLowerCase();
    if (!query) return employees;
    return employees.filter((employee) => {
      return (
        employee.name.toLowerCase().includes(query) ||
        employee.role.toLowerCase().includes(query) ||
        employee.id.toLowerCase().includes(query) ||
        employee.email.toLowerCase().includes(query)
      );
    });
  }, [employeeSearch, employees]);

  function updateForm(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function togglePermission(key) {
    if (key === "editTimesheets") return;
    setPermissions((prev) => {
      const next = { ...prev, [key]: !prev[key], editTimesheets: false };
      updatePermissionsMutation.mutate(next);
      return next;
    });
  }

  function cancelEdit() {
    if (adminQuery.data) {
      setForm({
        name: adminQuery.data.name || "",
        email: adminQuery.data.email || "",
        company: adminQuery.data.company || "",
        status: adminQuery.data.status || "Active",
        password: "",
      });
    }
    setIsEditing(false);
    setShowPassword(false);
  }

  function toggleEmployeeSelection(employeeId) {
    setSelectedEmployees((prev) => {
      if (prev.includes(employeeId)) {
        return prev.filter((idValue) => idValue !== employeeId);
      }
      return [...prev, employeeId];
    });
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/60 backdrop-blur-xl border-b border-slate-200/50 flex items-center justify-between h-16 px-8 ml-64 max-w-[calc(100%-16rem)]">
        <div className="flex items-center flex-1 max-w-xl">
          <div className="relative w-full group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-secondary transition-colors">
              search
            </span>
            <input
              className="w-full bg-surface-container-low border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#4cd7f6]/20 placeholder:text-slate-400"
              placeholder="Search resources..."
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-[#eceef1] transition-all relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full"></span>
          </button>
          <button className="p-2 rounded-full hover:bg-[#eceef1] transition-all">
            <span className="material-symbols-outlined">help</span>
          </button>
        </div>
      </header>

      <main className="ml-64 p-8 flex gap-8 min-h-screen bg-surface">
        <div className="flex-1 space-y-8">
          <nav className="flex items-center gap-2 text-sm font-medium">
            <Link to="/admin/admins" className="text-on-primary-container/60 hover:text-primary transition-colors">
              Admins
            </Link>
            <span className="material-symbols-outlined text-xs text-on-primary-container/40">chevron_right</span>
            <span className="text-primary font-bold">Admin Details</span>
          </nav>

          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-primary">Admin Details</h2>
            <div className="flex gap-3">
              <button
                className="px-5 py-2.5 border border-error text-error font-bold text-sm rounded-lg hover:bg-error/5 transition-all"
                disabled={deleteAdminMutation.isPending}
                onClick={() => deleteAdminMutation.mutate()}
              >
                Delete Admin
              </button>
              {isEditing ? (
                <>
                  <button
                    className="px-5 py-2.5 border border-outline-variant text-primary font-bold text-sm rounded-lg hover:bg-surface-container transition-all"
                    type="button"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-5 py-2.5 bg-primary-container text-on-primary font-bold text-sm rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50"
                    disabled={updateAdminMutation.isPending}
                    onClick={() => updateAdminMutation.mutate()}
                  >
                    {updateAdminMutation.isPending ? "Saving..." : "Save Changes"}
                  </button>
                </>
              ) : (
                <button
                  className="px-5 py-2.5 bg-primary-container text-on-primary font-bold text-sm rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
                  type="button"
                  onClick={() => setIsEditing(true)}
                >
                  <span className="material-symbols-outlined text-base">edit</span>
                  Edit
                </button>
              )}
            </div>
          </div>

          <section className="glass-card p-8 rounded-full flex gap-8 items-start">
            <div className="relative">
              <div className="w-24 h-24 rounded-xl bg-surface-container text-primary text-2xl font-bold flex items-center justify-center shadow-md">
                {getInitials(admin.name)}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-full shadow-lg">
                <span className="material-symbols-outlined text-sm text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-y-6 gap-x-12">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-on-primary-container font-bold mb-1">Name</label>
                {isEditing ? (
                  <input
                    className="bg-surface-container-low rounded px-3 py-2 text-lg font-bold text-primary w-full"
                    value={form.name}
                    onChange={(event) => updateForm("name", event.target.value)}
                  />
                ) : (
                  <p className="text-lg font-bold text-primary">{admin.name}</p>
                )}
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-on-primary-container font-bold mb-1">Status</label>
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${form.status === "Active" ? "bg-green-500" : "bg-slate-400"}`}></span>
                  {isEditing ? (
                    <select
                      className="bg-surface-container-low rounded px-3 py-2 text-sm font-semibold text-primary"
                      value={form.status}
                      onChange={(event) => updateForm("status", event.target.value)}
                    >
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  ) : (
                    <span className="text-sm font-semibold text-primary">{admin.status}</span>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-on-primary-container font-bold mb-1">Email Address</label>
                {isEditing ? (
                  <input
                    className="bg-surface-container-low rounded px-3 py-2 text-sm font-medium text-secondary w-full"
                    value={form.email}
                    onChange={(event) => updateForm("email", event.target.value)}
                  />
                ) : (
                  <p className="text-sm font-medium text-secondary">{admin.email}</p>
                )}
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-on-primary-container font-bold mb-1">Password</label>
                {isEditing ? (
                  <div className="relative">
                    <input
                      className="bg-surface-container-low rounded px-3 py-2 pr-10 text-sm text-on-primary-container w-full"
                      placeholder="Leave blank to keep current password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(event) => updateForm("password", event.target.value)}
                    />
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-on-primary-container hover:text-primary"
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      <span className="material-symbols-outlined text-base">{showPassword ? "visibility_off" : "visibility"}</span>
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <p className={`bg-surface-container-low rounded px-3 py-2 pr-10 text-sm text-on-primary-container w-full ${showPassword ? "tracking-normal" : "tracking-widest"}`}>
                      {showPassword ? "Password is encrypted. Use Edit to set a new password." : "************"}
                    </p>
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-on-primary-container hover:text-primary"
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      <span className="material-symbols-outlined text-base">{showPassword ? "visibility_off" : "visibility"}</span>
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-on-primary-container font-bold mb-1">Company</label>
                {isEditing ? (
                  <input
                    className="bg-surface-container-low rounded px-3 py-2 text-sm font-bold text-primary w-full"
                    value={form.company}
                    onChange={(event) => updateForm("company", event.target.value)}
                  />
                ) : (
                  <p className="text-sm font-bold text-primary">{admin.company || "—"}</p>
                )}
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-on-primary-container font-bold mb-1">Role</label>
                <span className="inline-block px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant text-xs font-black rounded-lg uppercase">
                  {admin.role}
                </span>
              </div>
            </div>
          </section>

          <section className="bg-primary-container text-on-primary p-8 rounded-full flex items-center gap-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-container/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="text-6xl font-black tracking-tighter text-tertiary-fixed">{assignedEmployees.length}</div>
            <div className="max-w-md">
              <h3 className="text-xl font-bold mb-1">Employees Managed</h3>
              <p className="text-on-primary-container text-sm leading-relaxed opacity-90">
                {admin.name.split(" ")[0]} is responsible for overseeing timesheet lifecycle management, compliance approvals,
                and payroll data validation for this specific cohort.
              </p>
            </div>
          </section>

          <section className="glass-card rounded-full overflow-hidden">
            <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-white/40">
              <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">group_add</span>
                Assigned Employees
              </h3>
              <button
                className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-secondary/90 transition-all shadow-md"
                onClick={() => setShowAssignModal(true)}
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Assign Employees
              </button>
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-left">
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-black text-on-primary-container">Employee</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-black text-on-primary-container">Department</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-black text-on-primary-container">Status</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-black text-on-primary-container text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {assignedEmployees.map((employee, index) => (
                  <tr key={employee.id} className={`${index === 1 ? "bg-surface-container-low/30" : ""} hover:bg-surface-container-lowest transition-colors group`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-surface-container text-primary text-xs font-bold flex items-center justify-center">
                          {getInitials(employee.name)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-primary">{employee.name}</p>
                          <p className="text-[11px] text-on-primary-container">{employee.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-primary">{employee.department}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-black rounded uppercase tracking-tighter">
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-on-primary-container hover:text-error transition-colors rounded-full hover:bg-error-container/20">
                        <span className="material-symbols-outlined text-sm">person_remove</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {assignedEmployees.length === 0 && (
                  <tr>
                    <td className="px-6 py-6 text-sm text-on-primary-container" colSpan={4}>
                      No employees assigned yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="p-4 bg-surface-container-low flex justify-center">
              <button className="text-xs font-bold text-secondary hover:text-primary-container transition-colors tracking-widest uppercase">
                View All {assignedEmployees.length} Employees
              </button>
            </div>
          </section>
        </div>

        <aside className="w-80 space-y-6">
          <section className="glass-card p-6 rounded-full">
            <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-6">Capabilities</h3>
            <div className="space-y-6">
              {[
                ["approveTimesheets", "Approve Timesheets", "Authorize employee hours for payroll processing", false],
                ["rejectTimesheets", "Reject Timesheets", "Send back entries for clarification", false],
                ["editTimesheets", "Edit Timesheets", "Coming soon", true],
              ].map(([key, title, subtitle, disabled]) => {
                const enabled = Boolean(permissions[key]);
                return (
                <div key={key} className={`flex items-center justify-between ${disabled ? "opacity-45" : ""}`}>
                  <div>
                    <p className="text-sm font-bold text-primary">{title}</p>
                    <p className="text-[10px] text-on-primary-container leading-tight">{subtitle}</p>
                  </div>
                  <button
                    type="button"
                    disabled={disabled || updatePermissionsMutation.isPending}
                    onClick={() => togglePermission(key)}
                    className={`relative inline-flex h-5 w-10 flex-shrink-0 rounded-full border-2 border-transparent transition ${enabled ? "bg-secondary" : "bg-surface-container-high"} ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition ${enabled ? "translate-x-5" : "translate-x-0"}`}></span>
                  </button>
                </div>
              );})}
            </div>
          </section>

          <section className="glass-card p-6 rounded-full border-l-4 border-secondary">
            <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-4">Activity Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-outline-variant/10 pb-2">
                <p className="text-xs text-on-primary-container font-medium">Employees Managed</p>
                <p className="text-lg font-bold text-primary">{assignedEmployees.length}</p>
              </div>
              <div className="flex justify-between items-end border-b border-outline-variant/10 pb-2">
                <p className="text-xs text-on-primary-container font-medium">Approvals Done</p>
                <p className="text-lg font-bold text-primary">{activity.approvalsDone || 0}</p>
              </div>
              <div className="flex justify-between items-end border-b border-outline-variant/10 pb-2">
                <p className="text-xs text-on-primary-container font-medium">Rejections</p>
                <p className="text-lg font-bold text-primary">{activity.rejections || 0}</p>
              </div>
            </div>
          </section>

          <section className="glass-card p-6 rounded-full overflow-hidden">
            <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-4 flex items-center justify-between">
              Activity Pulse
              <span className="text-[10px] text-secondary font-bold">L7D</span>
            </h3>
            <div className="flex items-end justify-between h-24 gap-1 px-2">
              {(pulse.length ? pulse : Array.from({ length: 7 }, (_, index) => ({ label: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"][index], count: 0 }))).map((entry, index) => (
                <div
                  key={`${entry.label}-${index}`}
                  className={index % 3 === 1 ? "w-full bg-secondary rounded-t-sm" : index % 3 === 2 ? "w-full bg-tertiary-fixed-dim rounded-t-sm" : "w-full bg-primary-container rounded-t-sm"}
                  style={{ height: `${Math.max(8, ((Number(entry.count) || 0) / maxPulseCount) * 95)}%` }}
                  title={`${entry.label}: ${entry.count}`}
                ></div>
              ))}
            </div>
            <div className="flex justify-between mt-2 px-1">
              <span className="text-[8px] text-on-primary-container font-bold">{pulse[0]?.label || "MON"}</span>
              <span className="text-[8px] text-on-primary-container font-bold">{pulse[pulse.length - 1]?.label || "SUN"}</span>
            </div>
          </section>
        </aside>
      </main>

      {showAssignModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#000615]/40 backdrop-blur-sm p-4">
          <div className="glass-card w-full max-w-2xl rounded-xl shadow-ambient overflow-hidden flex flex-col max-h-[870px]">
            <div className="px-8 pt-8 pb-6 bg-white/40">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-3xl font-display font-extrabold text-primary tracking-tight">Assign Employees</h3>
                  <p className="text-on-surface-variant text-sm mt-1">
                    Allocate talent to the Global System Integration project.
                  </p>
                </div>
                <button
                  className="text-on-surface-variant hover:text-primary transition-colors"
                  onClick={() => setShowAssignModal(false)}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-tertiary-fixed-dim transition-colors">
                  search
                </span>
                <input
                  className="w-full bg-surface-container-lowest/50 border-b-2 border-outline-variant/30 py-4 pl-12 pr-4 focus:ring-0 focus:outline-none focus:border-tertiary-fixed-dim text-on-surface font-medium transition-all placeholder:text-slate-400"
                  placeholder="Search by name, role, or employee ID..."
                  type="text"
                  value={employeeSearch}
                  onChange={(event) => setEmployeeSearch(event.target.value)}
                />
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-tertiary-fixed-dim transition-all group-focus-within:w-full"></div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-2">
              <div className="space-y-2">
                {visibleEmployees.map((employee) => {
                  const checked = selectedEmployees.includes(employee.id);
                  return (
                    <div
                      key={employee.id}
                      className={`group flex items-center p-4 rounded-lg transition-all duration-300 cursor-pointer ${
                        checked
                          ? "bg-surface-container-low border-l-4 border-tertiary-fixed-dim"
                          : "hover:bg-surface-container-low"
                      }`}
                      onClick={() => toggleEmployeeSelection(employee.id)}
                    >
                      <div className="mr-4">
                        <input
                          className="w-5 h-5 rounded border-outline-variant text-primary-container focus:ring-tertiary-fixed-dim cursor-pointer"
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleEmployeeSelection(employee.id)}
                          onClick={(event) => event.stopPropagation()}
                        />
                      </div>
                      <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center font-bold text-on-secondary-container text-sm">
                        {getInitials(employee.name)}
                      </div>
                      <div className="ml-4 flex-1">
                        <h5 className="font-headline font-bold text-primary">{employee.name}</h5>
                        <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">{employee.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-secondary">{employee.id.slice(0, 8)}</p>
                        <p className="text-[10px] text-on-surface-variant mt-1">{employee.department}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-8 bg-white/60 border-t border-outline-variant/10 flex items-center justify-between">
              <button
                className="px-8 py-3 font-headline font-bold text-on-surface-variant hover:text-primary transition-colors"
                onClick={() => setShowAssignModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-primary-container text-white px-10 py-4 rounded-lg shadow-ambient flex items-center gap-3 hover:translate-y-[-2px] active:scale-95 transition-all group"
                disabled={assignEmployeesMutation.isPending}
                onClick={() => assignEmployeesMutation.mutate()}
              >
                <span className="font-headline font-bold">
                  {assignEmployeesMutation.isPending ? "Assigning..." : `Assign ${selectedEmployees.length} Employees`}
                </span>
                <span className="material-symbols-outlined text-[#acedff] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
