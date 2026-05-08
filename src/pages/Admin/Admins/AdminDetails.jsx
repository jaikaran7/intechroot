import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminPanelService } from "../../../services/adminPanel.service";
import ErrorState from "../../../components/ErrorState";
import AdminDetailsSkeleton from "./AdminDetailsSkeleton";
import { HR_ADMIN_PERMISSION_GROUPS, HR_ADMIN_PERMISSION_KEYS, emptyHrAdminPermissionState } from "@/constants/hrAdminPermissions";

function getInitials(name) {
  return String(name || "?")
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function displayEmployeeCode(employee) {
  const code = String(employee?.employeeCode || employee?.employee_id || "").trim();
  return code || "Employee ID Pending";
}

function displayDesignation(employee) {
  const designation = String(employee?.designation || employee?.role || "").trim();
  if (designation) return designation;
  const department = String(employee?.department || "").trim();
  if (department) return department;
  return "Role Not Assigned";
}

export default function AdminDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showAssignApplicantsModal, setShowAssignApplicantsModal] = useState(false);
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [applicantSearch, setApplicantSearch] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "", status: "Active", password: "" });
  const [permissions, setPermissions] = useState({
    approveTimesheets: false,
    rejectTimesheets: false,
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

  const applicantAssignmentsQuery = useQuery({
    queryKey: ["admin-panel-admin-applicant-assignments", id],
    queryFn: () => adminPanelService.getApplicantAssignments(id),
    enabled: !!id && (adminQuery.data?.adminKind === "hr" || adminQuery.data?.role === "HR Admin"),
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

  const assignApplicantsMutation = useMutation({
    mutationFn: () => adminPanelService.setApplicantAssignments(id, selectedApplicants),
    onSuccess: (data) => {
      queryClient.setQueryData(["admin-panel-admin-applicant-assignments", id], data);
      queryClient.invalidateQueries({ queryKey: ["admin-panel-admin", id] });
      queryClient.invalidateQueries({ queryKey: ["admin-panel-admins"] });
      setShowAssignApplicantsModal(false);
    },
  });

  const removeApplicantAssignmentMutation = useMutation({
    mutationFn: (applicationId) => adminPanelService.removeApplicantAssignment(id, applicationId),
    onSuccess: (data) => {
      queryClient.setQueryData(["admin-panel-admin-applicant-assignments", id], data);
      queryClient.invalidateQueries({ queryKey: ["admin-panel-admin", id] });
      queryClient.invalidateQueries({ queryKey: ["admin-panel-admins"] });
    },
  });

  const admin = adminQuery.data ?? null;
  const activity = admin?.activity || { approvalsDone: 0, rejections: 0, pending: 0, applicantsManaged: 0, pulse: [] };
  const pulse = Array.isArray(activity.pulse) ? activity.pulse : [];
  const maxPulseCount = Math.max(1, ...pulse.map((entry) => Number(entry.count) || 0));
  const hasPulseActivity = pulse.some((entry) => Number(entry.count) > 0);

  const employees = useMemo(() => {
    const list = employeesQuery.data?.data;
    return Array.isArray(list) ? list : [];
  }, [employeesQuery.data]);

  const assignedEmployees = useMemo(() => assignmentsQuery.data?.employees || [], [assignmentsQuery.data]);
  const assignedApplicants = useMemo(
    () => applicantAssignmentsQuery.data?.applicants || [],
    [applicantAssignmentsQuery.data],
  );
  const availableApplicants = useMemo(
    () => applicantAssignmentsQuery.data?.availableApplicants || [],
    [applicantAssignmentsQuery.data],
  );

  useEffect(() => {
    if (!adminQuery.data) return;
    setForm({
      name: adminQuery.data.name || "",
      email: adminQuery.data.email || "",
      company: adminQuery.data.company || "",
      phone: adminQuery.data.phone || "",
      status: adminQuery.data.status || "Active",
      password: "",
    });
    const raw = adminQuery.data.permissions || {};
    const isHrAdminRow = adminQuery.data.adminKind === "hr" || adminQuery.data.role === "HR Admin";
    if (isHrAdminRow) {
      const next = emptyHrAdminPermissionState();
      for (const k of HR_ADMIN_PERMISSION_KEYS) {
        next[k] = Boolean(raw[k]);
      }
      setPermissions(next);
    } else {
      setPermissions({
        approveTimesheets: Boolean(raw.approveTimesheets),
        rejectTimesheets: Boolean(raw.rejectTimesheets),
      });
    }
  }, [adminQuery.data]);

  useEffect(() => {
    if (!assignmentsQuery.data?.employeeIds) return;
    setSelectedEmployees(assignmentsQuery.data.employeeIds.map(String));
  }, [assignmentsQuery.data]);

  useEffect(() => {
    if (!applicantAssignmentsQuery.data?.applicationIds) return;
    setSelectedApplicants(applicantAssignmentsQuery.data.applicationIds.map(String));
  }, [applicantAssignmentsQuery.data]);

  const visibleEmployees = useMemo(() => {
    const query = employeeSearch.trim().toLowerCase();
    if (!query) return employees;
    return employees.filter((employee) => {
      const employeeCode = String(employee.employeeCode || employee.employee_id || "").toLowerCase();
      return (
        employee.name.toLowerCase().includes(query) ||
        employee.role.toLowerCase().includes(query) ||
        employee.id.toLowerCase().includes(query) ||
        employeeCode.includes(query) ||
        employee.email.toLowerCase().includes(query)
      );
    });
  }, [employeeSearch, employees]);

  const visibleApplicants = useMemo(() => {
    const query = applicantSearch.trim().toLowerCase();
    if (!query) return availableApplicants;
    return availableApplicants.filter((applicant) => {
      const stage = String(applicant.stage || applicant.status || "").toLowerCase();
      return (
        String(applicant.name || "").toLowerCase().includes(query) ||
        String(applicant.email || "").toLowerCase().includes(query) ||
        stage.includes(query) ||
        String(applicant.id || "").toLowerCase().includes(query)
      );
    });
  }, [applicantSearch, availableApplicants]);

  function updateForm(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function togglePermission(key) {
    setPermissions((prev) => {
      const next = { ...prev, [key]: !prev[key] };
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
        phone: adminQuery.data.phone || "",
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

  function toggleApplicantSelection(applicationId) {
    setSelectedApplicants((prev) => {
      if (prev.includes(applicationId)) {
        return prev.filter((idValue) => idValue !== applicationId);
      }
      return [...prev, applicationId];
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
        {id && adminQuery.isPending ? (
          <AdminDetailsSkeleton />
        ) : adminQuery.isError ? (
          <div className="flex-1 flex items-start justify-center pt-16">
            <ErrorState message="Failed to load admin details." onRetry={() => adminQuery.refetch()} />
          </div>
        ) : !admin ? (
          <div className="flex-1 pt-8 text-on-primary-container text-sm">Admin not found.</div>
        ) : (
          <>
        <div className="flex-1 space-y-8">
          <nav className="flex items-center gap-2 text-sm font-medium">
            <Link to="/admin/admins" className="text-on-primary-container/60 hover:text-primary transition-colors">
              Admins
            </Link>
            <span className="material-symbols-outlined text-xs text-on-primary-container/40">chevron_right</span>
            <Link
              to={admin.adminKind === "hr" || admin.role === "HR Admin" ? "/admin/admins/hr" : "/admin/admins/client"}
              className="text-on-primary-container/60 hover:text-primary transition-colors"
            >
              {admin.adminKind === "hr" || admin.role === "HR Admin" ? "HR Admins" : "Client Admins"}
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
                    className="bg-surface-container-low rounded px-3 py-2 text-sm font-bold text-primary w-full disabled:opacity-60"
                    value={form.company}
                    onChange={(event) => updateForm("company", event.target.value)}
                    disabled={admin.adminKind === "hr" || admin.role === "HR Admin"}
                    title={admin.adminKind === "hr" || admin.role === "HR Admin" ? "HR admins use phone instead of company" : undefined}
                  />
                ) : (
                  <p className="text-sm font-bold text-primary">{admin.company || "—"}</p>
                )}
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-on-primary-container font-bold mb-1">Phone</label>
                {isEditing ? (
                  <input
                    className="bg-surface-container-low rounded px-3 py-2 text-sm font-bold text-primary w-full"
                    value={form.phone}
                    onChange={(event) => updateForm("phone", event.target.value)}
                  />
                ) : (
                  <p className="text-sm font-bold text-primary">{admin.phone || "—"}</p>
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
              <div className="text-6xl font-black tracking-tighter text-tertiary-fixed">
                {assignmentsQuery.isPending ? "—" : assignedEmployees.length}
              </div>
            <div className="max-w-md">
              <h3 className="text-xl font-bold mb-1">Employees Managed</h3>
              <p className="text-on-primary-container text-sm leading-relaxed opacity-90">
                {admin.name.trim().split(/\s+/)[0] || admin.name} is responsible for overseeing timesheet lifecycle management, compliance approvals,
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
                {assignmentsQuery.isPending &&
                  [0, 1, 2].map((i) => (
                    <tr key={`sk-${i}`} className="animate-pulse">
                      <td className="px-6 py-4" colSpan={4}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-slate-200/90" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-slate-200/90 rounded max-w-xs" />
                            <div className="h-3 bg-slate-200/80 rounded max-w-[14rem]" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                {!assignmentsQuery.isPending &&
                  assignedEmployees.map((employee, index) => (
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
                {!assignmentsQuery.isPending && assignedEmployees.length === 0 && (
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

          {(admin.adminKind === "hr" || admin.role === "HR Admin") && (
            <section className="glass-card rounded-full overflow-hidden">
              <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-white/40">
                <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">assignment_ind</span>
                  Assigned Applicants
                </h3>
                <button
                  className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-secondary/90 transition-all shadow-md"
                  onClick={() => setShowAssignApplicantsModal(true)}
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  Assign Applicants
                </button>
              </div>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-left">
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-black text-on-primary-container">Applicant</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-black text-on-primary-container">Email</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-black text-on-primary-container">Stage / Status</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-black text-on-primary-container text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {applicantAssignmentsQuery.isPending &&
                    [0, 1, 2].map((i) => (
                      <tr key={`app-sk-${i}`} className="animate-pulse">
                        <td className="px-6 py-4" colSpan={4}>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-slate-200/90" />
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-slate-200/90 rounded max-w-xs" />
                              <div className="h-3 bg-slate-200/80 rounded max-w-[14rem]" />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  {!applicantAssignmentsQuery.isPending &&
                    assignedApplicants.map((applicant) => (
                      <tr key={applicant.id} className="hover:bg-surface-container-lowest transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-surface-container text-primary text-xs font-bold flex items-center justify-center">
                              {getInitials(applicant.name)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-primary">{applicant.name}</p>
                              <p className="text-[11px] text-on-primary-container">#{applicant.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-on-primary-container">{applicant.email || "—"}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-2 py-1 bg-sky-50 text-sky-700 text-[10px] font-black rounded uppercase tracking-tighter border border-sky-100">
                            {applicant.stage || applicant.status || "In Review"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            className="p-2 text-on-primary-container hover:text-error transition-colors rounded-full hover:bg-error-container/20 disabled:opacity-50"
                            disabled={removeApplicantAssignmentMutation.isPending}
                            onClick={() => removeApplicantAssignmentMutation.mutate(applicant.id)}
                          >
                            <span className="material-symbols-outlined text-sm">person_remove</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  {!applicantAssignmentsQuery.isPending && assignedApplicants.length === 0 && (
                    <tr>
                      <td className="px-6 py-6 text-sm text-on-primary-container" colSpan={4}>
                        No applicants assigned yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="p-4 bg-surface-container-low flex justify-center">
                <button
                  className="text-xs font-bold text-secondary hover:text-primary-container transition-colors tracking-widest uppercase"
                  onClick={() => navigate("/admin/applications")}
                >
                  View All {assignedApplicants.length} Applicants
                </button>
              </div>
            </section>
          )}
        </div>

        <aside className="w-80 space-y-6">
          <section className="glass-card p-6 rounded-full">
            <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-6">Capabilities</h3>
            {admin.adminKind === "hr" || admin.role === "HR Admin" ? (
              <div className="space-y-8">
                {HR_ADMIN_PERMISSION_GROUPS.map((group) => (
                  <div key={group.id}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-primary-container mb-4">
                      {group.label}
                    </p>
                    <div className="space-y-4">
                      {group.keys.map(({ key, label }) => {
                        const enabled = Boolean(permissions[key]);
                        return (
                          <div key={key} className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-bold text-primary">{label}</p>
                            </div>
                            <button
                              type="button"
                              disabled={updatePermissionsMutation.isPending}
                              onClick={() => togglePermission(key)}
                              className={`relative inline-flex h-5 w-10 flex-shrink-0 rounded-full border-2 border-transparent transition ${enabled ? "bg-secondary" : "bg-surface-container-high"} cursor-pointer`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition ${enabled ? "translate-x-5" : "translate-x-0"}`}
                              ></span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {[
                  ["approveTimesheets", "Approve Timesheets", "Authorize employee hours for payroll processing"],
                  ["rejectTimesheets", "Reject Timesheets", "Send back entries for clarification"],
                ].map(([key, title, subtitle]) => {
                  const enabled = Boolean(permissions[key]);
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-primary">{title}</p>
                        <p className="text-[10px] text-on-primary-container leading-tight">{subtitle}</p>
                      </div>
                      <button
                        type="button"
                        disabled={updatePermissionsMutation.isPending}
                        onClick={() => togglePermission(key)}
                        className={`relative inline-flex h-5 w-10 flex-shrink-0 rounded-full border-2 border-transparent transition ${enabled ? "bg-secondary" : "bg-surface-container-high"} cursor-pointer`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition ${enabled ? "translate-x-5" : "translate-x-0"}`}
                        ></span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="glass-card p-6 rounded-full border-l-4 border-secondary">
            <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-4">Activity Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-outline-variant/10 pb-2">
                <p className="text-xs text-on-primary-container font-medium">Employees Managed</p>
                <p className="text-lg font-bold text-primary">
                  {assignmentsQuery.isPending ? "—" : assignedEmployees.length}
                </p>
              </div>
              <div className="flex justify-between items-end border-b border-outline-variant/10 pb-2">
                <p className="text-xs text-on-primary-container font-medium">Applicants Managed</p>
                <p className="text-lg font-bold text-primary">
                  {applicantAssignmentsQuery.isPending
                    ? "—"
                    : (activity.applicantsManaged ?? assignedApplicants.length ?? 0)}
                </p>
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
              {hasPulseActivity && pulse.length > 0 ? (
                pulse.map((entry, index) => (
                  <div
                    key={`${entry.label}-${index}`}
                    className="w-full bg-secondary rounded-t-sm"
                    style={{ height: `${Math.max(8, ((Number(entry.count) || 0) / maxPulseCount) * 95)}%` }}
                    title={`${entry.label}: ${entry.count}`}
                  />
                ))
              ) : (
                <p className="w-full text-center text-[11px] text-on-primary-container py-6">
                  No activity in the last 7 days.
                </p>
              )}
            </div>
            {hasPulseActivity && pulse.length > 0 && (
            <div className="flex justify-between mt-2 px-1">
              <span className="text-[8px] text-on-primary-container font-bold">{pulse[0]?.label}</span>
              <span className="text-[8px] text-on-primary-container font-bold">{pulse[pulse.length - 1]?.label}</span>
            </div>
            )}
          </section>
        </aside>
          </>
        )}
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
                        <p className="font-mono text-[11px] font-bold text-primary">{displayEmployeeCode(employee)}</p>
                        <p className="text-[10px] text-on-surface-variant mt-1">{displayDesignation(employee)}</p>
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

      {showAssignApplicantsModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#000615]/40 backdrop-blur-sm p-4">
          <div className="glass-card w-full max-w-2xl rounded-xl shadow-ambient overflow-hidden flex flex-col max-h-[870px]">
            <div className="px-8 pt-8 pb-6 bg-white/40">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-3xl font-display font-extrabold text-primary tracking-tight">Assign Applicants</h3>
                  <p className="text-on-surface-variant text-sm mt-1">
                    Link applicants to this HR admin for scoped hiring operations.
                  </p>
                </div>
                <button
                  className="text-on-surface-variant hover:text-primary transition-colors"
                  onClick={() => setShowAssignApplicantsModal(false)}
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
                  placeholder="Search by name, email, stage, or application ID..."
                  type="text"
                  value={applicantSearch}
                  onChange={(event) => setApplicantSearch(event.target.value)}
                />
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-tertiary-fixed-dim transition-all group-focus-within:w-full"></div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-2">
              <div className="space-y-2">
                {visibleApplicants.map((applicant) => {
                  const checked = selectedApplicants.includes(applicant.id);
                  return (
                    <div
                      key={applicant.id}
                      className={`group flex items-center p-4 rounded-lg transition-all duration-300 cursor-pointer ${
                        checked
                          ? "bg-surface-container-low border-l-4 border-tertiary-fixed-dim"
                          : "hover:bg-surface-container-low"
                      }`}
                      onClick={() => toggleApplicantSelection(applicant.id)}
                    >
                      <div className="mr-4">
                        <input
                          className="w-5 h-5 rounded border-outline-variant text-primary-container focus:ring-tertiary-fixed-dim cursor-pointer"
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleApplicantSelection(applicant.id)}
                          onClick={(event) => event.stopPropagation()}
                        />
                      </div>
                      <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center font-bold text-on-secondary-container text-sm">
                        {getInitials(applicant.name)}
                      </div>
                      <div className="ml-4 flex-1">
                        <h5 className="font-headline font-bold text-primary">{applicant.name}</h5>
                        <p className="text-xs font-medium text-on-surface-variant">{applicant.email || "—"}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-[11px] font-bold text-primary">#{applicant.id}</p>
                        <p className="text-[10px] text-on-surface-variant mt-1">{applicant.stage || applicant.status || "In Review"}</p>
                      </div>
                    </div>
                  );
                })}
                {!visibleApplicants.length && (
                  <p className="px-2 py-8 text-center text-sm text-on-surface-variant">
                    No unassigned applicants found.
                  </p>
                )}
              </div>
            </div>

            <div className="p-8 bg-white/60 border-t border-outline-variant/10 flex items-center justify-between">
              <button
                className="px-8 py-3 font-headline font-bold text-on-surface-variant hover:text-primary transition-colors"
                onClick={() => setShowAssignApplicantsModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-primary-container text-white px-10 py-4 rounded-lg shadow-ambient flex items-center gap-3 hover:translate-y-[-2px] active:scale-95 transition-all group"
                disabled={assignApplicantsMutation.isPending}
                onClick={() => assignApplicantsMutation.mutate()}
              >
                <span className="font-headline font-bold">
                  {assignApplicantsMutation.isPending ? "Assigning..." : `Assign ${selectedApplicants.length} Applicants`}
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
