/** Shared initial form state for employee profile (admin + employee portal). */
export function buildProfileFormState(employee) {
  if (!employee) {
    return {};
  }
  const clientValue =
    employee.client != null && String(employee.client).trim() !== ""
      ? String(employee.client).trim()
      : employee.department || "";
  return {
    employeeCode: employee.employeeCode || "",
    phone: employee.phone || "",
    email: employee.email || "",
    dateOfBirth: employee.personal?.dateOfBirth || employee.applicationProfile?.dateOfBirth || "",
    gender: employee.personal?.gender || employee.applicationProfile?.gender || "",
    address: employee.personal?.address || "",
    employmentType: employee.employment?.employmentType || "",
    jobTitle: employee.employment?.jobTitle || employee.role || "",
    client: clientValue,
    directManager: employee.employment?.directManager || "",
    timeZone: employee.timeZone || employee.employment?.timeZone || employee.employment?.shiftType || "",
    salary: employee.employment?.salary || "",
    payFrequency: employee.employment?.payFrequency || "",
    contractType: employee.employment?.contractType || "",
    contractTypeDescription: employee.employment?.contractTypeDescription || "",
    employmentStatus: employee.employment?.employmentStatus || "",
    employmentStatusTag: employee.employment?.employmentStatusTag || "",
    status: employee.status || "Active",
    joiningDate: employee.employment?.joiningDate || "",
    contractEndDate: employee.employment?.contractEndDate || "",
  };
}
