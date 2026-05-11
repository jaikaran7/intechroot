import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import EntityAvatar from "@/components/shared/EntityAvatar";
import { useAuthStore } from "@/store/authStore";
import { employeesService } from "@/services/employees.service";
import { documentsService } from "@/services/documents.service";
import { EmployeeDocumentsWorkspace } from "@/components/employees/EmployeeDocumentsWorkspace";
import { uploadStatusBadge } from "@/components/shared/requiredDocumentBadges";

const STEPS = [
  { id: 1, label: "Profile", icon: "account_circle" },
  { id: 2, label: "Personal Details", icon: "person" },
  { id: 3, label: "Job Information", icon: "business_center" },
  { id: 4, label: "Documents", icon: "folder_open" },
  { id: 5, label: "Review & Confirm", icon: "verified" },
];

const inputClass =
  "w-full bg-transparent border-0 border-b border-outline-variant focus:border-tertiary-fixed-dim focus:ring-0 p-0 pb-2 text-primary font-medium placeholder:text-outline-variant/50 transition-all";
const labelClass =
  "block text-[10px] font-bold text-outline-variant uppercase tracking-widest mb-1 transition-colors group-focus-within:text-tertiary-fixed-dim";

function initialForm() {
  return {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    nationality: "",
    gender: "",
    jobTitle: "",
    department: "",
    joiningDate: "",
    employmentType: "Full-time",
    contractType: "Permanent",
    client: "",
  };
}

function buildEmployeePayload(form) {
  const name = `${form.firstName} ${form.lastName}`.trim() || "New employee";
  return {
    name,
    email: form.email.trim().toLowerCase(),
    phone: form.phone.trim(),
    role: form.jobTitle.trim() || "Employee",
    department: form.department.trim(),
    client: form.client.trim(),
    dateOfBirth: form.dateOfBirth || undefined,
    nationality: form.nationality || undefined,
    gender: form.gender || undefined,
    jobTitle: form.jobTitle.trim() || undefined,
    employmentType: form.employmentType || undefined,
    joiningDate: form.joiningDate || undefined,
    contractType: form.contractType || undefined,
  };
}

function validatePersonal(form) {
  if (!form.firstName.trim()) return "First name is required.";
  if (!form.lastName.trim()) return "Last name is required.";
  const email = form.email.trim();
  if (!email) return "Professional email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address.";
  return "";
}

function validateJob(form) {
  if (!form.jobTitle.trim()) return "Job title is required.";
  if (!form.department.trim()) return "Department is required.";
  return "";
}

function validateForEmployeeSave(form) {
  return validatePersonal(form) || validateJob(form);
}

export default function EmployeeOnboarding() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [draftEmployeeId, setDraftEmployeeId] = useState(null);
  const [flowError, setFlowError] = useState("");

  const { data: reviewDocs = [] } = useQuery({
    queryKey: ["documents", draftEmployeeId],
    queryFn: () => documentsService.getByOwner(draftEmployeeId, "employee"),
    enabled: step === 5 && !!draftEmployeeId,
    staleTime: 30_000,
  });

  const createMutation = useMutation({
    mutationFn: (payload) => employeesService.create(payload),
    onSuccess: (emp) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      if (emp?.id) queryClient.setQueryData(["employee", emp.id], emp);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => employeesService.update(id, payload),
    onSuccess: (emp) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      if (emp?.id) queryClient.setQueryData(["employee", emp.id], emp);
    },
  });

  const saving = createMutation.isPending || updateMutation.isPending;

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const progressPct = useMemo(() => ((step - 1) / (STEPS.length - 1)) * 100, [step]);

  async function persistEmployeeThroughStep3() {
    const err = validateForEmployeeSave(form);
    if (err) {
      setFlowError(err);
      return false;
    }
    setFlowError("");
    const payload = buildEmployeePayload(form);
    try {
      if (draftEmployeeId) {
        await updateMutation.mutateAsync({ id: draftEmployeeId, payload });
      } else {
        const emp = await createMutation.mutateAsync(payload);
        if (emp?.id) setDraftEmployeeId(emp.id);
      }
      return true;
    } catch (e) {
      setFlowError(e?.response?.data?.error?.message || "Could not save employee. Check the form and try again.");
      return false;
    }
  }

  async function goNext() {
    if (step === 1) {
      setStep(2);
      return;
    }
    if (step === 2) {
      const err = validatePersonal(form);
      if (err) {
        setFlowError(err);
        return;
      }
      setFlowError("");
      setStep(3);
      return;
    }
    if (step === 3) {
      const ok = await persistEmployeeThroughStep3();
      if (ok) setStep(4);
      return;
    }
    if (step === 4) {
      setStep(5);
      return;
    }
    if (step === 5) {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      if (draftEmployeeId) {
        queryClient.invalidateQueries({ queryKey: ["documents", draftEmployeeId] });
        queryClient.invalidateQueries({ queryKey: ["employee", draftEmployeeId] });
      }
      navigate("/admin/employees");
    }
  }

  function goBack() {
    setFlowError("");
    if (step <= 1) {
      navigate("/admin/employees");
      return;
    }
    setStep((s) => s - 1);
  }

  const displayName = `${form.firstName} ${form.lastName}`.trim() || "New employee";

  return (
    <>
      <header className="fixed top-0 right-0 z-40 flex h-16 w-[calc(100%-16rem)] items-center justify-between bg-white/60 px-8 font-['Inter'] font-medium shadow-sm backdrop-blur-xl dark:bg-[#000615]/60 dark:shadow-none">
        <div className="flex w-96 items-center rounded-lg bg-surface-container px-4 py-1.5">
          <span className="material-symbols-outlined text-lg text-outline">search</span>
          <input
            className="w-full border-none bg-transparent text-sm placeholder:text-outline/60 focus:ring-0"
            placeholder="Search employees or files..."
            type="text"
          />
        </div>
        <div className="flex items-center gap-6">
          <button
            type="button"
            className="relative opacity-80 transition-opacity hover:text-[#4cd7f6] hover:opacity-100"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-error" />
          </button>
          <div className="h-8 w-[1px] bg-outline-variant/30" />
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-bold text-primary">{user?.name || "Admin"}</p>
              <p className="text-[10px] text-outline">
                {(user?.role && String(user.role).replace(/_/g, " ")) || "Administrator"}
              </p>
            </div>
            <EntityAvatar
              name={user?.name || user?.email || "Admin"}
              size="sm"
              className="border border-outline-variant/20"
            />
          </div>
        </div>
      </header>
      <main className="ml-64 min-h-screen px-12 pb-24 pt-24">
        <section className="relative mb-12">
          <div className="absolute -left-10 -top-10 h-64 w-64 rounded-full bg-tertiary-fixed-dim/5 blur-[100px]" />
          <h2 className="mb-2 font-headline text-5xl font-bold tracking-tight text-primary">Employee Onboarding</h2>
          <p className="max-w-2xl text-lg font-light text-on-primary-container">
            Initialize the onboarding sequence for a new global team member. Complete each step to ensure compliance and
            access.
          </p>
        </section>

        <div className="mx-auto mb-10 max-w-5xl">
          <div className="relative flex items-center justify-between px-2">
            <div className="absolute left-0 top-5 -z-10 h-[2px] w-full bg-surface-container-high">
              <div
                className="h-full bg-primary-container transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            {STEPS.map((s) => {
              const active = step === s.id;
              const done = step > s.id;
              return (
                <div key={s.id} className="flex flex-col items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold shadow-lg transition-colors ${
                      done
                        ? "bg-primary-container text-on-primary shadow-primary-container/20"
                        : active
                          ? "bg-primary-container text-on-primary shadow-primary-container/20"
                          : "bg-surface-container-highest text-outline"
                    }`}
                  >
                    {done ? (
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check
                      </span>
                    ) : (
                      <span className="material-symbols-outlined text-sm">{s.icon}</span>
                    )}
                  </div>
                  <span
                    className={`text-xs tracking-wide ${
                      active || done ? "font-bold text-primary" : "font-medium text-outline"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="glass-card ambient-shadow relative overflow-hidden rounded-xl p-10">
            <div className="absolute -right-32 -top-32 h-64 w-64 bg-secondary/5 blur-[80px]" />
            <div className="relative z-10">
              {step === 1 ? (
                <div className="grid grid-cols-12 gap-12">
                  <div className="col-span-12 lg:col-span-5">
                    <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-primary">Profile Identity</h3>
                    <div className="group relative">
                      <div className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-outline-variant/50 bg-surface-container-low transition-all group-hover:border-primary-container/30">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface shadow-sm">
                          <span className="material-symbols-outlined text-3xl text-outline transition-colors group-hover:text-primary-container">
                            add_a_photo
                          </span>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-bold text-primary">Drag & drop photo</p>
                          <p className="mt-1 text-[10px] text-outline">PNG, JPG up to 5MB</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 rounded-lg border border-primary-container/10 bg-primary-container/5 p-4">
                      <div className="flex gap-3">
                        <span className="material-symbols-outlined text-sm text-primary-container">info</span>
                        <p className="text-[11px] font-medium leading-relaxed text-on-primary-container">
                          Identity verification requires a clear, professional headshot against a neutral background.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12 flex flex-col justify-center lg:col-span-7">
                    <p className="text-sm text-on-primary-container">
                      Add a profile photo on the left when you are ready. Continue to personal details to enter legal
                      name and contact information.
                    </p>
                  </div>
                </div>
              ) : null}

              {step === 2 ? (
                <div>
                  <h3 className="mb-8 text-sm font-bold uppercase tracking-widest text-primary">Personal details</h3>
                  <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2">
                    <div className="group relative">
                      <label className={labelClass}>First Name</label>
                      <input
                        className={inputClass}
                        placeholder="e.g. Jonathan"
                        type="text"
                        value={form.firstName}
                        onChange={(e) => setField("firstName", e.target.value)}
                      />
                    </div>
                    <div className="group relative">
                      <label className={labelClass}>Last Name</label>
                      <input
                        className={inputClass}
                        placeholder="e.g. Sterling"
                        type="text"
                        value={form.lastName}
                        onChange={(e) => setField("lastName", e.target.value)}
                      />
                    </div>
                    <div className="group relative">
                      <label className={labelClass}>Professional Email</label>
                      <input
                        className={inputClass}
                        placeholder="j.sterling@intechroot.com"
                        type="email"
                        value={form.email}
                        onChange={(e) => setField("email", e.target.value)}
                      />
                    </div>
                    <div className="group relative">
                      <label className={labelClass}>Phone Number</label>
                      <input
                        className={inputClass}
                        placeholder="+1 (555) 000-0000"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setField("phone", e.target.value)}
                      />
                    </div>
                    <div className="group relative">
                      <label className={labelClass}>Date of Birth</label>
                      <input
                        className={inputClass}
                        type="date"
                        value={form.dateOfBirth}
                        onChange={(e) => setField("dateOfBirth", e.target.value)}
                      />
                    </div>
                    <div className="group relative">
                      <label className={labelClass}>Nationality</label>
                      <select
                        className={`${inputClass} appearance-none`}
                        value={form.nationality}
                        onChange={(e) => setField("nationality", e.target.value)}
                      >
                        <option value="">Select Region</option>
                        <option value="US">United States</option>
                        <option value="UK">United Kingdom</option>
                        <option value="DE">Germany</option>
                        <option value="SG">Singapore</option>
                        <option value="AU">Australia</option>
                      </select>
                      <span className="material-symbols-outlined pointer-events-none absolute bottom-2 right-0 text-lg text-outline">
                        expand_more
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}

              {step === 3 ? (
                <div>
                  <h3 className="mb-8 text-sm font-bold uppercase tracking-widest text-primary">Job information</h3>
                  <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2">
                    <div className="group relative md:col-span-2">
                      <label className={labelClass}>Job title</label>
                      <input
                        className={inputClass}
                        placeholder="e.g. Senior Solutions Architect"
                        type="text"
                        value={form.jobTitle}
                        onChange={(e) => setField("jobTitle", e.target.value)}
                      />
                    </div>
                    <div className="group relative md:col-span-2">
                      <label className={labelClass}>Department</label>
                      <input
                        className={inputClass}
                        placeholder="e.g. Cloud Infrastructure / Engineering"
                        type="text"
                        value={form.department}
                        onChange={(e) => setField("department", e.target.value)}
                      />
                    </div>
                    <div className="group relative">
                      <label className={labelClass}>Start / joining date</label>
                      <input
                        className={inputClass}
                        type="date"
                        value={form.joiningDate}
                        onChange={(e) => setField("joiningDate", e.target.value)}
                      />
                    </div>
                    <div className="group relative">
                      <label className={labelClass}>Employment type</label>
                      <select
                        className={`${inputClass} appearance-none`}
                        value={form.employmentType}
                        onChange={(e) => setField("employmentType", e.target.value)}
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                      </select>
                      <span className="material-symbols-outlined pointer-events-none absolute bottom-2 right-0 text-lg text-outline">
                        expand_more
                      </span>
                    </div>
                    <div className="group relative">
                      <label className={labelClass}>Contract type</label>
                      <select
                        className={`${inputClass} appearance-none`}
                        value={form.contractType}
                        onChange={(e) => setField("contractType", e.target.value)}
                      >
                        <option value="Permanent">Permanent</option>
                        <option value="Fixed-term">Fixed-term</option>
                      </select>
                      <span className="material-symbols-outlined pointer-events-none absolute bottom-2 right-0 text-lg text-outline">
                        expand_more
                      </span>
                    </div>
                    <div className="group relative">
                      <label className={labelClass}>Client (optional)</label>
                      <input
                        className={inputClass}
                        placeholder="Client or internal pool"
                        type="text"
                        value={form.client}
                        onChange={(e) => setField("client", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {step === 4 && draftEmployeeId ? (
                <div>
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-primary">Documents</h3>
                  <p className="mb-6 max-w-2xl text-sm text-on-primary-container">
                    Upload compliance documents for this employee. Documents are optional before you finish; you can
                    add more later from the employee profile.
                  </p>
                  <EmployeeDocumentsWorkspace
                    employeeId={draftEmployeeId}
                    layoutVariant="embedded"
                    showAuxSections={false}
                  />
                </div>
              ) : null}

              {step === 4 && !draftEmployeeId ? (
                <p className="text-sm text-on-surface-variant">Preparing employee record…</p>
              ) : null}

              {step === 5 ? (
                <div className="space-y-8">
                  <div>
                    <h2 className="mb-2 font-headline text-3xl font-extrabold tracking-tight text-primary">
                      Final verification
                    </h2>
                    <p className="max-w-xl text-on-primary-container">
                      Review the information below. When you confirm, the employee is kept in the directory with any
                      documents you uploaded in the previous step.
                    </p>
                  </div>

                  <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 flex gap-8 rounded-xl border border-outline-variant/15 bg-surface-container-low/40 p-8 lg:col-span-7">
                      <EntityAvatar name={displayName} size="hero" rounded="lg" className="border-2 border-white shadow-xl" />
                      <div className="flex-1">
                        <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-on-primary-container">
                          Personal profile
                        </span>
                        <h3 className="mb-6 font-headline text-2xl font-bold text-primary">{displayName}</h3>
                        <div className="grid grid-cols-2 gap-y-4 text-sm">
                          <div>
                            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-on-primary-container">
                              Email
                            </p>
                            <p className="font-medium">{form.email || "—"}</p>
                          </div>
                          <div>
                            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-on-primary-container">
                              Phone
                            </p>
                            <p className="font-medium">{form.phone || "—"}</p>
                          </div>
                          <div>
                            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-on-primary-container">
                              Date of birth
                            </p>
                            <p className="font-medium">{form.dateOfBirth || "—"}</p>
                          </div>
                          <div>
                            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-on-primary-container">
                              Nationality
                            </p>
                            <p className="font-medium">{form.nationality || "—"}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-12 rounded-xl border-l-4 border-l-[#4cd7f6] bg-surface-container-low/40 p-8 lg:col-span-5">
                      <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.2em] text-on-primary-container">
                        Employment terms
                      </span>
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-on-primary-container">Job title</p>
                      <p className="mb-4 font-headline text-lg font-bold text-primary">{form.jobTitle || "—"}</p>
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-on-primary-container">Department</p>
                      <p className="mb-4 text-sm font-medium text-secondary">{form.department || "—"}</p>
                      <div className="grid grid-cols-2 gap-4 border-t border-outline-variant/15 pt-6">
                        <div>
                          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-on-primary-container">
                            Joining date
                          </p>
                          <p className="text-sm font-semibold">{form.joiningDate || "—"}</p>
                        </div>
                        <div>
                          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-on-primary-container">
                            Employment type
                          </p>
                          <p className="text-sm font-semibold">{form.employmentType}</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-12 rounded-xl border border-outline-variant/15 bg-surface-container-low/30 p-8">
                      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-primary-container">
                          Documents
                        </span>
                      </div>
                      {!draftEmployeeId ? (
                        <p className="text-sm text-on-surface-variant">No employee record.</p>
                      ) : reviewDocs.length === 0 ? (
                        <p className="text-sm text-on-surface-variant">No documents uploaded in this session.</p>
                      ) : (
                        <ul className="divide-y divide-outline-variant/10">
                          {reviewDocs.map((doc) => (
                            <li key={doc.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                              <span className="text-sm font-bold text-primary">{doc.name}</span>
                              {uploadStatusBadge(doc.status)}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}

              {flowError ? (
                <p className="mt-6 text-sm font-medium text-error" role="alert">
                  {flowError}
                </p>
              ) : null}

              <div className="mt-12 flex flex-wrap items-center justify-end gap-6 border-t border-outline-variant/10 pt-10">
                <button
                  type="button"
                  className="px-6 py-2.5 text-sm font-bold text-outline transition-colors hover:text-primary"
                  onClick={() => (step === 1 ? navigate("/admin/employees") : goBack())}
                >
                  {step === 1 ? "Cancel" : "Back"}
                </button>
                <button
                  type="button"
                  disabled={saving || (step === 4 && !draftEmployeeId)}
                  className="flex items-center gap-3 rounded-lg bg-primary-container px-10 py-3 text-sm font-bold text-on-primary shadow-xl shadow-primary-container/10 transition-all hover:-translate-y-0.5 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => void goNext()}
                >
                  {step === 5 ? "Complete onboarding" : "Continue"}
                  <span className="material-symbols-outlined text-sm">
                    {step === 5 ? "task_alt" : "arrow_forward"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none fixed bottom-0 right-0 -z-10 p-8 opacity-5">
          <span className="material-symbols-outlined text-[20rem]" style={{ fontVariationSettings: "'wght' 100" }}>
            architecture
          </span>
        </div>
      </main>
    </>
  );
}
