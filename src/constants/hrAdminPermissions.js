/** Keys stored on AdminProfile.permissions for `hr_admin` (keep in sync with backend `panelPermissions.js`). */
export const HR_ADMIN_PERMISSION_KEYS = [
  "approveTimesheets",
  "rejectTimesheets",
  "editTimesheets",
  "viewEmployeeDetails",
  "editEmployeeDetails",
  "viewApplicationJourney",
  "editApplicationStage",
  "acceptRejectApplicantDocuments",
  "sendInterviewLinks",
  "sendMessagesToApplicants",
  "manageOnboardingProcess",
  "scheduleInterview",
  "portalApproveRejectApplicant",
  "advanceApplicationStage",
  "approveApplicantProfile",
  "requestAdditionalDocuments",
  "setBGVDetails",
  "approveBGVVerification",
  "finalHireRejectApplicant",
  "verifyApplicantDocuments",
  "requestExtraEmployeeDocuments",
  "viewEmployeeDocuments",
  "viewJobPostings",
  "createEditJobPostings",
  "openCloseJobPostings",
];

export const HR_ADMIN_PERMISSION_GROUPS = [
  {
    id: "timesheet",
    label: "Timesheet Management",
    keys: [
      { key: "approveTimesheets", label: "Approve Timesheets" },
      { key: "rejectTimesheets", label: "Reject Timesheets" },
      { key: "editTimesheets", label: "Edit Timesheets" },
    ],
  },
  {
    id: "employee",
    label: "Employee Management",
    keys: [
      { key: "viewEmployeeDetails", label: "View Employee Details" },
      { key: "editEmployeeDetails", label: "Edit Employee Details" },
    ],
  },
  {
    id: "application",
    label: "Application Management",
    keys: [
      { key: "viewApplicationJourney", label: "View Application Journey" },
      { key: "editApplicationStage", label: "Edit / Update Application Journey Stage" },
      { key: "acceptRejectApplicantDocuments", label: "Accept or Reject Applicant Documents" },
      { key: "sendInterviewLinks", label: "Send Meeting / Interview Links" },
      { key: "sendMessagesToApplicants", label: "Send Messages to Applicants" },
      { key: "scheduleInterview", label: "Schedule / Reschedule / Cancel Interviews" },
      { key: "portalApproveRejectApplicant", label: "Approve or Reject at Portal Review" },
      { key: "advanceApplicationStage", label: "Advance Application Lifecycle Stage" },
    ],
  },
  {
    id: "onboarding",
    label: "Onboarding Management",
    keys: [
      { key: "manageOnboardingProcess", label: "Manage Onboarding Process" },
      { key: "approveApplicantProfile", label: "Approve Applicant Profile (Onboarding)" },
      { key: "requestAdditionalDocuments", label: "Request Additional Documents from Applicant" },
      { key: "setBGVDetails", label: "Set BGV Link and Note" },
      { key: "approveBGVVerification", label: "Mark BGV as Verified" },
      { key: "finalHireRejectApplicant", label: "Final Hire or Reject After Onboarding" },
    ],
  },
  {
    id: "documents",
    label: "Document Management",
    keys: [
      { key: "verifyApplicantDocuments", label: "Verify or Reject Applicant-Uploaded Documents" },
      { key: "requestExtraEmployeeDocuments", label: "Request Extra Documents from Employees" },
      { key: "viewEmployeeDocuments", label: "View Assigned Employees' Documents" },
    ],
  },
  {
    id: "jobs",
    label: "Job Postings",
    keys: [
      { key: "viewJobPostings", label: "View Job Postings" },
      { key: "createEditJobPostings", label: "Create and Edit Job Postings" },
      { key: "openCloseJobPostings", label: "Open, Close, or Draft Job Postings" },
    ],
  },
];

export function emptyHrAdminPermissionState() {
  return Object.fromEntries(HR_ADMIN_PERMISSION_KEYS.map((k) => [k, false]));
}
