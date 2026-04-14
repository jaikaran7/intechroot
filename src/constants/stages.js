export const STAGE_ORDER = [
  'Application Submitted',
  'Profile Screening',
  'Technical Evaluation',
  'Client Interview',
  'Offer & Onboarding',
];

export const LIFECYCLE_STAGES = {
  APPLIED: 'applied',
  SCREENING: 'screening',
  TECHNICAL: 'technical',
  CLIENT: 'client',
  OFFER: 'offer',
  ONBOARDING: 'onboarding',
  EMPLOYEE: 'employee',
};

export const LIFECYCLE_LABEL = {
  applied: 'Application Submitted',
  screening: 'Profile Screening',
  technical: 'Technical Evaluation',
  client: 'Client Interview',
  offer: 'Offer & Onboarding',
  onboarding: 'Onboarding',
  employee: 'Hired',
};

export const DOC_VERIFICATION = {
  UNAPPROVED: 'unapproved',
  WAITING: 'waiting',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
};

export const TIMESHEET_STATUS = {
  DRAFT: 'Draft',
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

export const EMPLOYEE_STATUS = {
  ACTIVE: 'Active',
  ON_LEAVE: 'On_Leave',
  INACTIVE: 'Inactive',
};

export const JOB_STATUS = {
  ACTIVE: 'Active',
  DRAFT: 'Draft',
  CLOSED: 'Closed',
};

export const INTERVIEW_STATUS = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  RESCHEDULED: 'rescheduled',
};

export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
  APPLICANT: 'applicant',
};
