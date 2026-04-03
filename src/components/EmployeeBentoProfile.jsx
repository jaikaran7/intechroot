export function formatDateShort(value) {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
}

export function formatDateMedium(value) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatSalary(value) {
  if (value === undefined || value === null || value === "") return "—";
  const n = Number(String(value).replace(/,/g, ""));
  if (Number.isNaN(n)) return String(value);
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function buildFields(employee, formData) {
  const fd = formData || {};
  return {
    dateOfBirth: fd.dateOfBirth ?? employee.personal?.dateOfBirth ?? "",
    gender: fd.gender ?? employee.personal?.gender ?? "",
    address: fd.address ?? employee.personal?.address ?? "",
    employmentType: fd.employmentType ?? employee.employment?.employmentType ?? "",
    jobTitle: fd.jobTitle ?? employee.employment?.jobTitle ?? employee.role ?? "",
    department: employee.department || "—",
    directManager: employee.directManager || employee.employment?.directManager || "—",
    shiftType: fd.shiftType ?? employee.employment?.shiftType ?? "",
    salary: fd.salary ?? employee.employment?.salary ?? "",
    payFrequency: fd.payFrequency ?? employee.employment?.payFrequency ?? "",
    contractType: fd.contractType ?? employee.employment?.contractType ?? "",
    contractTypeDescription: fd.contractTypeDescription ?? employee.employment?.contractTypeDescription ?? "",
    employmentStatus: fd.employmentStatus ?? employee.employment?.employmentStatus ?? employee.status ?? "",
    employmentStatusTag: fd.employmentStatusTag ?? employee.employment?.employmentStatusTag ?? "",
    joiningDate: fd.joiningDate ?? employee.employment?.joiningDate ?? "",
    contractEndDate: fd.contractEndDate ?? employee.employment?.contractEndDate ?? "",
  };
}

/**
 * Shared Stitch-style bento profile (employee portal + admin profile tab).
 */
export default function EmployeeBentoProfile({
  employee,
  variant = "employee",
  formData = null,
  isEditMode = false,
  /** When true (admin), Edit only unlocks Employee Details — not job/compensation/status. */
  adminEditsPersonalDetailsOnly = false,
  /** Employee portal: pen icon puts Employee Details in edit mode. */
  personalDetailsEditMode = false,
  onPersonalDetailsPenClick,
  updateField,
  handleSalaryChange,
  formatDateValue,
  heroBeforeName = null,
  heroActions = null,
}) {
  const fd = buildFields(employee, formData);
  const personalSectionEditable =
    (variant === "admin" && isEditMode) || (variant === "employee" && personalDetailsEditMode);
  const jobSectionEditable = variant === "admin" && isEditMode && !adminEditsPersonalDetailsOnly;
  const portraitSrc = employee.performance?.panelImage;
  const quickNote =
    employee.quickNotes ||
    `${employee.name} is currently recorded as ${employee.status} on the ${fd.department} team${
      employee.performance?.tenure ? ` with ${employee.performance.tenure} tenure` : ""
    }.`;

  const contractEndDisplay = fd.contractEndDate ? formatDateMedium(fd.contractEndDate) : null;
  const statusLabel =
    variant === "employee"
      ? employee.status || fd.employmentStatus || "—"
      : fd.employmentStatus || employee.status || "—";
  const statusActive = String(employee.status || "").toLowerCase() === "active";

  const adminDate = formatDateValue
    ? (v) => formatDateValue(v)
    : (v) => formatDateMedium(v) || "—";

  const resolvedHeroActions = heroActions ?? null;

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-5">
        <svg className="h-full w-full" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10%" cy="20%" fill="#000615" r="1" />
          <circle cx="30%" cy="40%" fill="#000615" r="1" />
          <circle cx="50%" cy="10%" fill="#000615" r="1" />
          <circle cx="70%" cy="80%" fill="#000615" r="1" />
          <circle cx="90%" cy="30%" fill="#000615" r="1" />
          <line stroke="#000615" strokeWidth="0.5" x1="10%" x2="30%" y1="20%" y2="40%" />
          <line stroke="#000615" strokeWidth="0.5" x1="30%" x2="50%" y1="40%" y2="10%" />
          <line stroke="#000615" strokeWidth="0.5" x1="50%" x2="70%" y1="10%" y2="80%" />
          <line stroke="#000615" strokeWidth="0.5" x1="70%" x2="90%" y1="80%" y2="30%" />
        </svg>
      </div>

      <div className="relative z-10">
        <div className="px-12 pb-8 pt-12">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex items-center gap-8">
              <div className="relative shrink-0">
                <img
                  alt=""
                  className="h-32 w-32 rounded-xl border-4 border-white object-cover shadow-2xl"
                  src={portraitSrc}
                />
                <div className="absolute -bottom-2 -right-2 rounded-lg bg-blue-600 p-1.5 text-white shadow-lg">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                </div>
              </div>
              <div>
                {heroBeforeName}
                <h2 className="font-headline text-4xl font-extrabold tracking-tight text-primary">{employee.name}</h2>
                <div className="mt-2 flex flex-wrap items-center gap-4">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary-container px-3 py-1 text-xs font-bold text-on-primary-container">
                    <span className="material-symbols-outlined text-[14px]">badge</span>
                    {employee.id}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm font-medium text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px] text-blue-600">call</span>
                    {employee.phone || "—"}
                  </span>
                </div>
              </div>
            </div>
            {resolvedHeroActions ? <div className="flex flex-wrap gap-3">{resolvedHeroActions}</div> : null}
          </div>
        </div>

        <div className="px-12 pb-20">
          <div className="grid grid-cols-12 items-start gap-6">
            <div className="col-span-12 space-y-6 md:col-span-4">
              <div className="glass-card rounded-xl p-8 shadow-sm">
                <div className="mb-8 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 font-headline text-lg font-bold">
                    <span className="material-symbols-outlined text-blue-600">person_search</span>
                    Employee Details
                  </h3>
                  {variant === "employee" && onPersonalDetailsPenClick ? (
                    <button
                      type="button"
                      onClick={onPersonalDetailsPenClick}
                      className={`rounded-lg p-1.5 transition-colors ${
                        personalDetailsEditMode
                          ? "bg-primary-container/15 text-primary-container"
                          : "text-slate-400 hover:bg-surface-container hover:text-blue-600"
                      }`}
                      aria-label="Edit employee details"
                    >
                      <span className="material-symbols-outlined text-xl">edit</span>
                    </button>
                  ) : null}
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Date of Birth
                    </label>
                    {personalSectionEditable ? (
                      <input
                        className="w-full border-b border-outline-variant bg-transparent py-2 text-sm font-medium text-primary focus:border-tertiary-fixed-dim focus:outline-none"
                        type="date"
                        value={fd.dateOfBirth}
                        onChange={(e) => updateField?.("dateOfBirth", e.target.value)}
 />
                    ) : (
                      <p className="font-medium text-primary">{formatDateShort(fd.dateOfBirth)}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Gender
                    </label>
                    {personalSectionEditable ? (
                      <select
                        className="w-full appearance-none border-b border-outline-variant bg-transparent py-2 text-sm font-medium text-primary focus:border-tertiary-fixed-dim focus:outline-none"
                        value={fd.gender}
                        onChange={(e) => updateField?.("gender", e.target.value)}
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Non-binary</option>
                        <option>Prefer not to say</option>
                      </select>
                    ) : (
                      <p className="font-medium text-primary">{fd.gender || "—"}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Residential Address
                    </label>
                    {personalSectionEditable ? (
                      <input
                        className="w-full border-b border-outline-variant bg-transparent py-2 text-sm font-medium text-primary focus:border-tertiary-fixed-dim focus:outline-none"
                        type="text"
                        value={fd.address}
                        onChange={(e) => updateField?.("address", e.target.value)}
 />
                    ) : (
                      <p className="leading-relaxed text-primary font-medium">
                        {fd.address ? (
                          <>
                            {fd.address.split(",").map((p, i, arr) => (
                              <span key={i}>
                                {p.trim()}
                                {i < arr.length - 1 ? (
                                  <>
                                    ,<br />
                                  </>
                                ) : null}
                              </span>
                            ))}
                          </>
                        ) : (
                          "—"
                        )}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Employment Type
                    </label>
                    {personalSectionEditable ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {["Full-Time", "Part-Time", "Contract"].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            className={
                              fd.employmentType === opt
                                ? "rounded-full bg-primary-container px-3 py-1 text-xs font-bold text-on-primary"
                                : "rounded-full border border-outline-variant px-3 py-1 text-xs font-bold text-slate-500 hover:bg-surface-container"
                            }
                            onClick={() => updateField?.("employmentType", opt)}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    ) : fd.employmentType ? (
                      <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                        {fd.employmentType}
                      </span>
                    ) : (
                      <p className="font-medium text-primary">—</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-xl bg-primary-container p-8 text-white shadow-xl">
                <div className="relative z-10">
                  <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-blue-300">Quick Notes</h4>
                  <p className="text-sm font-light leading-relaxed text-blue-50/80">{quickNote}</p>
                </div>
                <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-9xl text-white/5 transition-transform duration-500 group-hover:scale-110">
                  rate_review
                </span>
              </div>
            </div>

            <div className="col-span-12 space-y-6 md:col-span-8">
              <div className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-8 shadow-sm">
                <h3 className="mb-8 flex items-center gap-2 font-headline text-lg font-bold">
                  <span className="material-symbols-outlined text-blue-600">work</span>
                  Job Information
                </h3>
                <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <span className="material-symbols-outlined">title</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Job Title
                      </label>
                      {jobSectionEditable ? (
                        <input
                          className="w-full border-b border-outline-variant bg-transparent py-2 text-lg font-bold text-primary focus:border-tertiary-fixed-dim focus:outline-none"
                          type="text"
                          value={fd.jobTitle}
                          onChange={(e) => updateField?.("jobTitle", e.target.value)}
 />
                      ) : (
                        <p className="text-lg font-bold text-primary">{fd.jobTitle}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <span className="material-symbols-outlined">account_tree</span>
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Department
                      </label>
                      <p className="font-medium text-primary">{fd.department}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <span className="material-symbols-outlined">supervisor_account</span>
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Direct Manager
                      </label>
                      <p className="font-medium text-primary">{fd.directManager}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <span className="material-symbols-outlined">history_toggle_off</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Shift Type
                      </label>
                      {jobSectionEditable ? (
                        <select
                          className="w-full appearance-none border-b border-outline-variant bg-transparent py-2 text-sm font-medium text-primary focus:border-tertiary-fixed-dim focus:outline-none"
                          value={fd.shiftType}
                          onChange={(e) => updateField?.("shiftType", e.target.value)}
                        >
                          <option>Day (09:00 - 17:00)</option>
                          <option>Night (17:00 - 01:00)</option>
                          <option>Flexible</option>
                        </select>
                      ) : (
                        <p className="font-medium text-primary">{fd.shiftType || "—"}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-8 shadow-sm">
                  <h3 className="mb-8 flex items-center gap-2 font-headline text-lg font-bold">
                    <span className="material-symbols-outlined text-blue-600">payments</span>
                    Compensation
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      <span className="text-sm text-slate-500">Annual Salary</span>
                      {jobSectionEditable ? (
                        <div className="relative min-w-[8rem]">
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                          <input
                            className="w-full border-b border-outline-variant bg-transparent py-1 pl-4 text-right text-sm font-bold text-primary focus:border-tertiary-fixed-dim focus:outline-none"
                            inputMode="decimal"
                            value={fd.salary}
                            onChange={handleSalaryChange}
 />
                        </div>
                      ) : (
                        <span className="font-bold text-primary">{formatSalary(fd.salary)}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      <span className="text-sm text-slate-500">Pay Frequency</span>
                      {jobSectionEditable ? (
                        <select
                          className="max-w-[10rem] appearance-none border-b border-outline-variant bg-transparent py-1 text-right text-sm font-medium text-primary focus:border-tertiary-fixed-dim focus:outline-none"
                          value={fd.payFrequency}
                          onChange={(e) => updateField?.("payFrequency", e.target.value)}
                        >
                          <option>Bi-Weekly</option>
                          <option>Monthly</option>
                          <option>Weekly</option>
                        </select>
                      ) : (
                        <span className="font-medium text-primary">{fd.payFrequency || "—"}</span>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm text-slate-500">Contract Type</span>
                        {jobSectionEditable ? (
                          <input
                            className="max-w-[12rem] border-b border-outline-variant bg-transparent py-1 text-right text-sm font-medium text-primary focus:border-tertiary-fixed-dim focus:outline-none"
                            type="text"
                            value={fd.contractType}
                            onChange={(e) => updateField?.("contractType", e.target.value)}
 />
                        ) : (
                          <span className="font-medium text-primary">{fd.contractType || "—"}</span>
                        )}
                      </div>
                      {jobSectionEditable ? (
                        <input
                          className="w-full border-b border-outline-variant bg-transparent py-1 text-xs text-on-primary-container focus:border-tertiary-fixed-dim focus:outline-none"
                          placeholder="Description"
                          value={fd.contractTypeDescription}
                          onChange={(e) => updateField?.("contractTypeDescription", e.target.value)}
 />
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-8 shadow-sm">
                  <h3 className="mb-8 flex items-center gap-2 font-headline text-lg font-bold">
                    <span className="material-symbols-outlined text-blue-600">calendar_today</span>
                    Status &amp; Dates
                  </h3>
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                      <span className="text-sm text-slate-500">Current Status</span>
                      <span className="flex flex-wrap items-center gap-2 font-bold text-primary">
                        <span
                          className={`h-2 w-2 shrink-0 animate-pulse rounded-full ${statusActive ? "bg-emerald-500" : "bg-amber-500"}`}
                        />
                        {jobSectionEditable ? (
                          <>
                            <input
                              className="min-w-0 flex-1 border-b border-outline-variant bg-transparent py-1 text-sm font-bold text-primary focus:border-tertiary-fixed-dim focus:outline-none"
                              value={fd.employmentStatus}
                              onChange={(e) => updateField?.("employmentStatus", e.target.value)}
 />
                            <input
                              className="w-24 rounded bg-surface-container-high px-2 py-0.5 text-[10px] font-medium text-on-surface-variant focus:outline-none"
                              value={fd.employmentStatusTag}
                              onChange={(e) => updateField?.("employmentStatusTag", e.target.value)}
 />
                          </>
                        ) : (
                          <>
                            {statusLabel}
                            {fd.employmentStatusTag ? (
                              <span className="rounded bg-surface-container-high px-2 py-0.5 text-[10px] font-medium text-on-surface-variant">
                                {fd.employmentStatusTag}
                              </span>
                            ) : null}
                          </>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <span className="text-sm text-slate-500">Joining Date</span>
                      {jobSectionEditable ? (
                        <input
                          className="border-b border-outline-variant bg-transparent py-1 text-sm font-medium text-primary focus:border-tertiary-fixed-dim focus:outline-none"
                          type="date"
                          value={fd.joiningDate}
                          onChange={(e) => updateField?.("joiningDate", e.target.value)}
 />
                      ) : (
                        <span className="font-medium text-primary">{adminDate(fd.joiningDate)}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Contract End</span>
                      {jobSectionEditable ? (
                        <input
                          className="border-b border-outline-variant bg-transparent py-1 text-sm font-medium text-primary focus:border-tertiary-fixed-dim focus:outline-none"
                          type="date"
                          value={fd.contractEndDate}
                          onChange={(e) => updateField?.("contractEndDate", e.target.value)}
 />
                      ) : contractEndDisplay ? (
                        <span className="font-medium text-primary">{contractEndDisplay}</span>
                      ) : (
                        <span className="italic text-slate-400">N/A</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-outline-variant/15 bg-white p-8 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="font-headline text-lg font-bold">Performance Snapshot</h3>
                  <span className="text-xs font-bold text-blue-600">FY2023 RECAP</span>
                </div>
                <div className="flex h-32 items-end gap-2">
                  <div
                    className="flex-1 cursor-help rounded-t-md bg-blue-50 transition-colors hover:bg-blue-100"
                    style={{ height: "65%" }}
                  />
                  <div
                    className="flex-1 cursor-help rounded-t-md bg-blue-50 transition-colors hover:bg-blue-100"
                    style={{ height: "80%" }}
                  />
                  <div
                    className="flex-1 cursor-help rounded-t-md bg-blue-50 transition-colors hover:bg-blue-100"
                    style={{ height: "45%" }}
                  />
                  <div
                    className="flex-1 cursor-help rounded-t-md bg-blue-600 transition-colors hover:bg-blue-700"
                    style={{ height: "95%" }}
                  />
                  <div
                    className="flex-1 cursor-help rounded-t-md bg-blue-50 transition-colors hover:bg-blue-100"
                    style={{ height: "70%" }}
                  />
                  <div
                    className="flex-1 cursor-help rounded-t-md bg-blue-50 transition-colors hover:bg-blue-100"
                    style={{ height: "85%" }}
                  />
                </div>
                <div className="mt-4 flex justify-between text-[10px] font-bold tracking-tighter text-slate-400">
                  <span>Q1</span>
                  <span>Q2</span>
                  <span>Q3</span>
                  <span>Q4</span>
                  <span>Q5</span>
                  <span>Q6</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
