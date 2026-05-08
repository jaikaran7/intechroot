import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminPanelService } from "../../../services/adminPanel.service";
import { HR_ADMIN_PERMISSION_GROUPS, emptyHrAdminPermissionState } from "@/constants/hrAdminPermissions";

/** @param {{ kind: 'client' | 'hr' }} */
export default function AdminDirectoryList({ kind }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("Active");
  const [adminSearch, setAdminSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
    phone: "",
  });
  const [formError, setFormError] = useState("");
  const [clientPermissions, setClientPermissions] = useState({
    approveTimesheets: false,
    rejectTimesheets: false,
  });
  const [hrPermissions, setHrPermissions] = useState(() => emptyHrAdminPermissionState());

  const isClient = kind === "client";

  const adminsQuery = useQuery({
    queryKey: ["admin-panel-admins", statusFilter, kind, adminSearch],
    queryFn: () =>
      adminPanelService.getAdmins({
        limit: 100,
        status: statusFilter,
        kind,
        search: adminSearch.trim() || undefined,
      }),
    staleTime: 30_000,
  });

  const permissionsPayload = isClient ? clientPermissions : hrPermissions;

  const createAdminMutation = useMutation({
    mutationFn: () =>
      adminPanelService.createAdmin({
        ...form,
        adminKind: kind,
        status: "Active",
        permissions: permissionsPayload,
      }),
    onSuccess: (admin) => {
      queryClient.invalidateQueries({ queryKey: ["admin-panel-admins"] });
      queryClient.invalidateQueries({ queryKey: ["admin-panel-admins-count"] });
      setShowAddAdminModal(false);
      setForm({ name: "", email: "", password: "", company: "", phone: "" });
      setFormError("");
      navigate(`/admin/admins/${admin.id}`);
    },
    onError: (err) => {
      setFormError(err.response?.data?.error?.message || "Could not add admin. Please try again.");
    },
  });

  const admins = useMemo(() => {
    const list = adminsQuery.data?.data;
    return Array.isArray(list) ? list : [];
  }, [adminsQuery.data]);

  const filteredAdmins = useMemo(() => {
    return admins.filter((row) => row.status === statusFilter);
  }, [admins, statusFilter]);

  function updateForm(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function submitNewAdmin() {
    setFormError("");
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setFormError("Full name, email, and password are required.");
      return;
    }
    if (isClient && !form.company.trim()) {
      setFormError("Company is required for client admins.");
      return;
    }
    if (!isClient && !form.phone.trim()) {
      setFormError("Phone number is required for HR admins.");
      return;
    }
    createAdminMutation.mutate();
  }

  const title = isClient ? "Client Admins" : "HR Admins";
  const subtitle = isClient
    ? "Manage client administrators and their timesheet approval scope."
    : "Manage HR administrators, contact details, and extended permissions.";

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/60 backdrop-blur-xl border-b border-slate-200/50 flex items-center justify-between h-16 px-8 ml-64 max-w-[calc(100%-16rem)]">
        <div className="flex items-center flex-1 max-w-xl">
          <div className="relative w-full group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-secondary transition-colors">
              search
            </span>
            <input
              className="w-full bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#4cd7f6]/20 placeholder:text-slate-400 font-inter"
              placeholder="Search admins…"
              type="text"
              value={adminSearch}
              onChange={(event) => setAdminSearch(event.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="ml-64 p-12 min-h-screen">
        <div className="w-full">
          <nav className="flex items-center gap-2 text-xs font-medium text-outline mb-6 tracking-wide">
            <Link className="hover:text-primary transition-colors" to="/admin/admins">
              Admins
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary-container font-semibold">{title}</span>
          </nav>

          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-4xl font-extrabold tracking-tight text-primary font-headline">{title}</h2>
              <p className="text-on-surface-variant mt-2 max-w-md leading-relaxed">{subtitle}</p>
            </div>
            <button
              className="flex items-center gap-2 px-6 py-3 bg-primary-container text-white rounded-lg font-bold hover:translate-y-[-2px] shadow-lg transition-all duration-300"
              onClick={() => setShowAddAdminModal(true)}
            >
              <span className="material-symbols-outlined">add</span>
              <span>Add Admin</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 py-4 px-6 bg-surface-container-low rounded-xl mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Status:</span>
            <select
              className="bg-white border-outline-variant/30 text-sm font-medium rounded-lg px-4 py-2 focus:ring-2 focus:ring-tertiary-fixed-dim/20 outline-none"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          <div className="w-full bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-outline-variant/10">
                  {kind === "hr" ? (
                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Type
                    </th>
                  ) : null}
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Admin Name
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Email ID
                  </th>
                  {kind === "client" ? (
                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Company Name
                    </th>
                  ) : (
                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Phone
                    </th>
                  )}
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Employees
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Status
                  </th>
                  <th className="px-8 py-5 text-right text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-slate-50/80 transition-colors">
                    {kind === "hr" ? (
                      <td className="px-6 py-5">
                        <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-violet-50 text-violet-700 border border-violet-100">
                          HR Admin
                        </span>
                      </td>
                    ) : null}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-surface-container text-on-surface text-xs font-bold flex items-center justify-center">
                          {admin.name
                            .split(" ")
                            .map((word) => word[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-primary">{admin.name}</p>
                          <p className="text-xs text-on-surface-variant">{admin.joined}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-on-surface-variant">{admin.email}</td>
                    {kind === "client" ? (
                      <td className="px-6 py-5 text-sm font-medium">{admin.company || "—"}</td>
                    ) : (
                      <td className="px-6 py-5 text-sm font-medium">{admin.phone || "—"}</td>
                    )}
                    <td className="px-6 py-5 text-sm">{admin.employees}</td>
                    <td className="px-6 py-5">
                      {admin.status === "Active" ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button
                        className="text-secondary font-bold text-sm hover:text-primary transition-colors"
                        onClick={() => navigate(`/admin/admins/${admin.id}`)}
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredAdmins.length === 0 && (
                  <tr>
                    <td
                      className="px-8 py-8 text-sm text-on-surface-variant"
                      colSpan={kind === "hr" ? 7 : 6}
                    >
                      {adminsQuery.isLoading ? "Loading admins..." : "No admins found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {showAddAdminModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-primary/20 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-xl shadow-[0_40px_80px_-20px_rgba(0,6,21,0.25)] overflow-hidden bg-white/70 backdrop-blur-2xl border border-outline-variant/20 max-h-[90vh] flex flex-col">
            <div className="px-10 pt-10 pb-6 shrink-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-3xl font-extrabold font-headline tracking-tighter text-primary">
                    Add {isClient ? "Client" : "HR"} Administrator
                  </h3>
                  <p className="text-on-primary-container mt-1 font-medium italic">
                    Assign platform access and management permissions
                  </p>
                </div>
                <button
                  className="p-2 hover:bg-surface-container/50 rounded-full transition-all"
                  onClick={() => setShowAddAdminModal(false)}
                >
                  <span className="material-symbols-outlined text-outline">close</span>
                </button>
              </div>
            </div>

            <div className="px-10 pb-8 space-y-6 overflow-y-auto flex-1">
              {formError && (
                <p className="rounded-lg border border-error/20 bg-error-container/20 px-4 py-3 text-sm font-semibold text-error">
                  {formError}
                </p>
              )}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">
                    Full Name
                  </label>
                  <input
                    className="w-full bg-surface-container-low border-0 border-b-2 border-transparent focus:border-tertiary-fixed-dim focus:ring-4 focus:ring-tertiary-fixed-dim/10 transition-all px-4 py-3 text-sm placeholder:text-outline/50 font-medium rounded-t-lg"
                    placeholder="e.g. Jonathan Sterling"
                    type="text"
                    value={form.name}
                    onChange={(event) => updateForm("name", event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">
                    Corporate Email
                  </label>
                  <input
                    className="w-full bg-surface-container-low border-0 border-b-2 border-transparent focus:border-tertiary-fixed-dim focus:ring-4 focus:ring-tertiary-fixed-dim/10 transition-all px-4 py-3 text-sm placeholder:text-outline/50 font-medium rounded-t-lg"
                    placeholder="j.sterling@meridian.int"
                    type="email"
                    value={form.email}
                    onChange={(event) => updateForm("email", event.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {isClient ? (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">
                      Company
                    </label>
                    <input
                      className="w-full bg-surface-container-low border-0 border-b-2 border-transparent focus:border-tertiary-fixed-dim focus:ring-4 focus:ring-tertiary-fixed-dim/10 transition-all px-4 py-3 text-sm placeholder:text-outline/50 font-medium rounded-t-lg"
                      placeholder="Company name"
                      type="text"
                      value={form.company}
                      onChange={(event) => updateForm("company", event.target.value)}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">
                      Phone number
                    </label>
                    <input
                      className="w-full bg-surface-container-low border-0 border-b-2 border-transparent focus:border-tertiary-fixed-dim focus:ring-4 focus:ring-tertiary-fixed-dim/10 transition-all px-4 py-3 text-sm placeholder:text-outline/50 font-medium rounded-t-lg"
                      placeholder="+1 …"
                      type="tel"
                      value={form.phone}
                      onChange={(event) => updateForm("phone", event.target.value)}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">
                    Temporary Password
                  </label>
                  <input
                    className="w-full bg-surface-container-low border-0 border-b-2 border-transparent focus:border-tertiary-fixed-dim focus:ring-4 focus:ring-tertiary-fixed-dim/10 transition-all px-4 py-3 text-sm placeholder:text-outline/50 font-medium rounded-t-lg"
                    placeholder="Minimum 8 characters"
                    type="password"
                    value={form.password}
                    onChange={(event) => updateForm("password", event.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-outline-variant/10">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">
                  Permission Sets
                </label>
                {isClient ? (
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center gap-3 p-3 bg-white/40 hover:bg-white/80 transition-colors rounded-lg cursor-pointer border border-transparent hover:border-outline-variant/20">
                      <input
                        className="w-4 h-4 rounded-sm border-outline-variant text-primary focus:ring-tertiary-fixed-dim"
                        type="checkbox"
                        checked={clientPermissions.approveTimesheets}
                        onChange={(event) =>
                          setClientPermissions((prev) => ({
                            ...prev,
                            approveTimesheets: event.target.checked,
                          }))
                        }
                      />
                      <span className="text-sm font-medium text-on-surface">Approve Timesheets</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-white/40 hover:bg-white/80 transition-colors rounded-lg cursor-pointer border border-transparent hover:border-outline-variant/20">
                      <input
                        className="w-4 h-4 rounded-sm border-outline-variant text-primary focus:ring-tertiary-fixed-dim"
                        type="checkbox"
                        checked={clientPermissions.rejectTimesheets}
                        onChange={(event) =>
                          setClientPermissions((prev) => ({
                            ...prev,
                            rejectTimesheets: event.target.checked,
                          }))
                        }
                      />
                      <span className="text-sm font-medium text-on-surface">Reject Timesheets</span>
                    </label>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {HR_ADMIN_PERMISSION_GROUPS.map((group) => (
                      <div key={group.id}>
                        <p className="text-xs font-bold uppercase tracking-wider text-primary/70 mb-3">{group.label}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {group.keys.map(({ key, label }) => (
                            <label
                              key={key}
                              className="flex items-center gap-3 p-3 bg-white/40 hover:bg-white/80 transition-colors rounded-lg cursor-pointer border border-transparent hover:border-outline-variant/20"
                            >
                              <input
                                className="w-4 h-4 rounded-sm border-outline-variant text-primary focus:ring-tertiary-fixed-dim"
                                type="checkbox"
                                checked={Boolean(hrPermissions[key])}
                                onChange={(event) =>
                                  setHrPermissions((prev) => ({
                                    ...prev,
                                    [key]: event.target.checked,
                                  }))
                                }
                              />
                              <span className="text-sm font-medium text-on-surface">{label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="px-10 py-8 bg-surface-container/30 flex justify-end items-center gap-4 shrink-0">
              <button
                className="px-6 py-3 text-sm font-bold text-primary hover:bg-surface-container transition-all rounded"
                onClick={() => setShowAddAdminModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-8 py-3 bg-primary-container text-on-primary text-sm font-bold tracking-tight rounded shadow-lg hover:translate-y-[-2px] hover:shadow-xl active:scale-95 transition-all"
                disabled={createAdminMutation.isPending}
                onClick={submitNewAdmin}
              >
                {createAdminMutation.isPending ? "Adding..." : "Add Admin"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
