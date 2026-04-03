/**
 * Canonical template rows for Required Documents (applicant) and Document Verification (admin).
 * Keys match onboardingDocuments[].templateKey
 */
export const REQUIRED_DOCUMENT_ROWS = [
  {
    key: "passport",
    icon: "badge",
    label: "Passport (Front & Back)",
    required: true,
    status: "not_uploaded",
    expiry: "",
    action: "upload",
  },
  {
    key: "workAuth",
    icon: "description",
    label: "Work Authorization",
    required: true,
    status: "uploaded",
    expiry: "2026-12-31",
    action: "manage",
    thumb:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCfJAHoDQN71nzWuRqneuVIoPk2MGn2vFEtut8fhSJflppN3X5Z2XE-e6cdb9TKHhiqkIANVJYZoWGO5rV2ameMwhycVRy3hmdIMyoZgtJKU9m5WMMyPWIsIT1r_7RPVZ9xm1v10ajV3hJeOLmYYIBijtcCf-xwwkk5B6e9YYRnIGOMc__o8-vFS6icuRdvoilc3pdOKA0GCxEM3e1p0vs1ho8PrZqwH5f5rQqvtouieDNFo0Zo5c8VjgJkCk3sEFP5YM4Wn77pQ1u-",
  },
  {
    key: "govId",
    icon: "account_box",
    label: "Government ID",
    required: true,
    status: "expiring_soon",
    expiry: "2024-12-15",
    action: "replace",
  },
  {
    key: "sin",
    icon: "pin",
    label: "SIN Document",
    required: true,
    status: "expired",
    expiry: "2023-11-01",
    action: "reupload",
  },
  {
    key: "incorp",
    icon: "corporate_fare",
    label: "Incorporation Document",
    required: false,
    status: "not_uploaded_neutral",
    expiry: "",
    action: "upload_outline",
  },
  {
    key: "deposit",
    icon: "payments",
    label: "Direct Deposit (Void Check)",
    required: false,
    status: "not_uploaded_neutral",
    expiry: "",
    action: "upload_outline",
  },
];
