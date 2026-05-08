import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { adminPanelService } from "@/services/adminPanel.service";

/**
 * Loads `/admin-panel/dashboard` permissions for `hr_admin`.
 * Non–HR admin roles get full access flags (bypass UI gates).
 */
export function useHrAdminPermissions() {
  const role = useAuthStore((s) => s.role);
  const isHrAdmin = role === "hr_admin";

  const { data, isLoading } = useQuery({
    queryKey: ["admin-panel-dashboard"],
    queryFn: () => adminPanelService.getDashboard(),
    staleTime: 60_000,
    enabled: isHrAdmin,
  });

  const raw = data?.permissions || {};
  const full = !isHrAdmin;

  return {
    isHrAdmin,
    isLoading: isHrAdmin && isLoading,
    permissions: raw,
    can: {
      approveTimesheets: full || Boolean(raw.approveTimesheets),
      rejectTimesheets: full || Boolean(raw.rejectTimesheets),
      editTimesheets: full || Boolean(raw.editTimesheets),
      viewEmployeeDetails: full || Boolean(raw.viewEmployeeDetails),
      editEmployeeDetails: full || Boolean(raw.editEmployeeDetails),
      viewApplicationJourney: full || Boolean(raw.viewApplicationJourney),
      editApplicationStage: full || Boolean(raw.editApplicationStage),
      acceptRejectApplicantDocuments: full || Boolean(raw.acceptRejectApplicantDocuments),
      sendInterviewLinks: full || Boolean(raw.sendInterviewLinks),
      sendMessagesToApplicants: full || Boolean(raw.sendMessagesToApplicants),
      manageOnboardingProcess: full || Boolean(raw.manageOnboardingProcess),
      scheduleInterview: full || Boolean(raw.scheduleInterview),
      portalApproveRejectApplicant: full || Boolean(raw.portalApproveRejectApplicant),
      advanceApplicationStage: full || Boolean(raw.advanceApplicationStage),
      approveApplicantProfile: full || Boolean(raw.approveApplicantProfile),
      requestAdditionalDocuments: full || Boolean(raw.requestAdditionalDocuments),
      setBGVDetails: full || Boolean(raw.setBGVDetails),
      approveBGVVerification: full || Boolean(raw.approveBGVVerification),
      finalHireRejectApplicant: full || Boolean(raw.finalHireRejectApplicant),
      verifyApplicantDocuments: full || Boolean(raw.verifyApplicantDocuments),
      requestExtraEmployeeDocuments: full || Boolean(raw.requestExtraEmployeeDocuments),
      viewEmployeeDocuments: full || Boolean(raw.viewEmployeeDocuments),
      viewJobPostings: full || Boolean(raw.viewJobPostings),
      createEditJobPostings: full || Boolean(raw.createEditJobPostings),
      openCloseJobPostings: full || Boolean(raw.openCloseJobPostings),
    },
  };
}
