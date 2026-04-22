/** Shared initial form state for employee profile (admin + employee portal). */
export function buildProfileFormState(employee) {
  if (!employee) {
    return {};
  }
  return {
    dateOfBirth: employee.personal?.dateOfBirth || employee.applicationProfile?.dateOfBirth || "",
    gender: employee.personal?.gender || employee.applicationProfile?.gender || "",
    address: employee.personal?.address || "",
    employmentType: employee.employment?.employmentType || "",
    jobTitle: employee.employment?.jobTitle || employee.role || "",
    client: employee.client || "Client A",
    customClient: "",
    shiftType: employee.employment?.shiftType || "",
    salary: employee.employment?.salary || "",
    payFrequency: employee.employment?.payFrequency || "",
    contractType: employee.employment?.contractType || "",
    contractTypeDescription: employee.employment?.contractTypeDescription || "",
    employmentStatus: employee.employment?.employmentStatus || "",
    employmentStatusTag: employee.employment?.employmentStatusTag || "",
    joiningDate: employee.employment?.joiningDate || "",
    contractEndDate: employee.employment?.contractEndDate || "",
  };
}
