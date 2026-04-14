import { useEffect, useMemo, useState } from "react";
import applicationsSeed from "../fixtures/applications.json";
import { REQUIRED_DOCUMENT_ROWS } from "../constants/requiredDocumentTemplates";
import { getExpiryBucket, hasUploadedFile, resolveDocVerification } from "../utils/onboardingDocumentRules";
import { safeJsonParse } from "../utils/safeJsonParse";

export const APPLICATIONS_STORAGE_KEY = "intechroot_applications_v1";
const STORAGE_KEY = APPLICATIONS_STORAGE_KEY;

/**
 * When true, onboarding stage moves and step gating enforce fully uploaded, non-expired required documents.
 * When false, incomplete documents are not blocking (enforcement still uses error "Candidate documents are incomplete" if this is turned on).
 */
export const ONBOARDING_REQUIRE_COMPLETE_DOCUMENTS = false;

/** Strip base64 payloads so localStorage never throws (quota ~5MB). */
function sanitizeAppsForStorage(apps) {
  return apps.map((app) => ({
    ...app,
    onboardingDocuments: (app.onboardingDocuments || []).map((doc) => ({
      ...doc,
      fileData: "",
    })),
  }));
}

export const STAGE_ORDER = [
  "Application Submitted",
  "Profile Screening",
  "Technical Evaluation",
  "Client Interview",
  "Offer & Onboarding",
];

export const OFFER_STAGE_INDEX = STAGE_ORDER.length - 1;

const LIFECYCLE_BY_INDEX = ["applied", "screening", "technical", "client"];

/** Admin onboarding wizard: 1 = profile review, 2 = documents, 3 = final hire. */
export function getOnboardingAdminStep(onboarding) {
  const ob = onboarding || {};
  if (!ob.profileCompleted) return 1;
  if (!ob.documentsCompleted) return 2;
  return 3;
}

/** Highest onboarding step URL the applicant may open (1–5), based on completed gates. */
export function getMaxAllowedApplicantOnboardingStep(onboarding) {
  const ob = onboarding || {};
  if (!ob.profileCompleted) return 1;
  if (ONBOARDING_REQUIRE_COMPLETE_DOCUMENTS && !ob.documentsCompleted) return 2;
  /** Step 4+ requires admin BGV clearance OR applicant "Proceed to Review" from step 3. */
  if (!ob.bgvCompleted && !ob.bgvApplicantAcknowledged) return 3;
  if (!ob.finalSubmitted) return 4;
  return 5;
}

export function defaultOnboardingState() {
  return {
    enabled: false,
    step: 1,
    completed: false,
    bgvLink: "",
    /** Shown in applicant step 3 "Required Action" when set by admin. */
    bgvNote: "",
    profileCompleted: false,
    documentsCompleted: false,
    bgvCompleted: false,
    /** Set when applicant leaves BGV iframe step 3 (does not replace admin bgvCompleted for hire). */
    bgvApplicantAcknowledged: false,
    finalSubmitted: false,
    hireCompleted: false,
  };
}

export function deriveLifecycleStage(app) {
  if (!app) return "applied";
  if (app.lifecycleStage === "employee") return "employee";
  if (app.onboarding?.hireCompleted) return "employee";
  if (app.onboarding?.enabled && !app.onboarding?.hireCompleted) return "onboarding";
  const idx = Number.isFinite(Number(app.currentStageIndex)) ? Number(app.currentStageIndex) : 0;
  if (idx >= OFFER_STAGE_INDEX) return "offer";
  return LIFECYCLE_BY_INDEX[idx] || "applied";
}

export function validateRequiredDocumentsForOnboarding(app) {
  if (!ONBOARDING_REQUIRE_COMPLETE_DOCUMENTS) return { ok: true };
  const docs = mergeOnboardingDocumentList(
    app.onboardingDocuments || [],
    app.adminRequestedDocuments || [],
  );
  const rowsToCheck = [
    ...REQUIRED_DOCUMENT_ROWS,
    ...(app.adminRequestedDocuments || []).map((r) => ({
      key: `adminreq_${r.id}`,
      label: r.name,
      required: true,
      status: "not_uploaded",
      expiry: "",
      action: "upload",
    })),
  ];
  for (const row of rowsToCheck) {
    if (!row.required) continue;
    const stored = docs.find((d) => d.templateKey === row.key);
    if (!hasUploadedFile(stored)) {
      return { ok: false, error: "Candidate documents are incomplete" };
    }
    const bucket = getExpiryBucket((stored?.expiryDate || "").slice(0, 10));
    if (bucket === "expired") {
      return { ok: false, error: "Candidate documents are incomplete" };
    }
  }
  return { ok: true };
}

export function canAdminFinalizeHire(app) {
  if (!app?.onboarding?.enabled) return false;
  const documentsOk = ONBOARDING_REQUIRE_COMPLETE_DOCUMENTS ? app.onboarding.documentsCompleted : true;
  return Boolean(
    app.onboarding.profileCompleted &&
      documentsOk &&
      app.onboarding.bgvCompleted &&
      app.onboarding.finalSubmitted &&
      app.lifecycleStage !== "employee",
  );
}

function cloneSeed() {
  try {
    const base = applicationsSeed && typeof applicationsSeed === "object" ? applicationsSeed : [];
    const list = Array.isArray(base) ? base : [];
    return JSON.parse(JSON.stringify(list.length ? list : []));
  } catch {
    return [];
  }
}

const VERIFICATION_LEGACY = {
  unapproved: "Unapproved",
  waiting: "Waiting for Verification",
  verified: "Verified",
  rejected: "Rejected",
};

function defaultOnboardingDoc(row) {
  return {
    id: row.key,
    templateKey: row.key,
    name: row.label,
    status: "not_uploaded",
    verification: "unapproved",
    expiryDate: "",
    fileUrl: null,
    fileName: "",
    fileData: "",
    verificationStatus: "Unapproved",
  };
}

function adminRequestToTemplateRow(r) {
  return {
    key: `adminreq_${r.id}`,
    label: r.name,
    required: true,
    status: "not_uploaded",
    expiry: "",
    action: "upload",
  };
}

function mergeOnboardingDocumentList(existing, adminRequestedDocuments = []) {
  const prevByKey = new Map((existing || []).map((d) => [d.templateKey || d.id, d]));
  const baseMerged = REQUIRED_DOCUMENT_ROWS.map((row) => {
    const prev = prevByKey.get(row.key);
    const merged = prev
      ? { ...defaultOnboardingDoc(row), ...prev, templateKey: row.key, name: row.label, id: prev.id || row.key }
      : defaultOnboardingDoc(row);
    return syncOnboardingDocumentRow(merged);
  });
  const adminRows = (adminRequestedDocuments || []).map(adminRequestToTemplateRow);
  const adminMerged = adminRows.map((row) => {
    const prev = prevByKey.get(row.key);
    const merged = prev
      ? { ...defaultOnboardingDoc(row), ...prev, templateKey: row.key, name: row.label, id: prev.id || row.key }
      : defaultOnboardingDoc(row);
    return syncOnboardingDocumentRow(merged);
  });
  return [...baseMerged, ...adminMerged];
}

function syncOnboardingDocumentRow(doc) {
  if (!doc || typeof doc !== "object") return doc;
  const uploaded = hasUploadedFile(doc);
  const verification = resolveDocVerification(doc);
  return {
    ...doc,
    status: uploaded ? "uploaded" : "not_uploaded",
    verification,
    verificationStatus: VERIFICATION_LEGACY[verification] || "Unapproved",
  };
}

export function normalizeApplication(app) {
  if (!app) return app;
  const onboarding = { ...defaultOnboardingState(), ...(app.onboarding || {}) };
  const timesheets = Array.isArray(app.timesheets) ? app.timesheets : [];
  const adminRequestedDocuments = Array.isArray(app.adminRequestedDocuments) ? app.adminRequestedDocuments : [];
  const adminBgvRequests = Array.isArray(app.adminBgvRequests) ? app.adminBgvRequests : [];
  const merged = {
    ...app,
    messages: Array.isArray(app.messages) ? app.messages : [],
    adminRequestedDocuments,
    adminBgvRequests,
    onboardingDocuments: mergeOnboardingDocumentList(app.onboardingDocuments, adminRequestedDocuments),
    interview: app.interview ?? null,
    verificationDocuments: Array.isArray(app.verificationDocuments) ? app.verificationDocuments : [],
    interviews: Array.isArray(app.interviews) ? app.interviews : [],
    onboarding,
    timesheets,
    employeeId: app.employeeId != null && app.employeeId !== "" ? app.employeeId : null,
  };
  return {
    ...merged,
    lifecycleStage: merged.lifecycleStage || deriveLifecycleStage(merged),
  };
}

export function getApplicationsSnapshot() {
  try {
    if (typeof window === "undefined") {
      const seeded = cloneSeed().map(normalizeApplication);
      return Array.isArray(seeded) ? seeded : [];
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = safeJsonParse(raw, null);
    if (Array.isArray(parsed) && parsed.length > 0) {
      try {
        const normalized = parsed.map(normalizeApplication).filter(Boolean);
        const stored = sanitizeAppsForStorage(normalized);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
        } catch {
          /* ignore quota / private mode */
        }
        return Array.isArray(stored) ? stored : normalized;
      } catch {
        /* normalize failed — reseed */
      }
    }
    const seed = cloneSeed().map(normalizeApplication).filter(Boolean);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    } catch {
      /* ignore */
    }
    return Array.isArray(seed) ? seed : [];
  } catch (e) {
    console.error("getApplicationsSnapshot:", e);
    try {
      return cloneSeed().map(normalizeApplication).filter(Boolean);
    } catch {
      return [];
    }
  }
}

export function setApplicationsSnapshot(apps) {
  if (typeof window === "undefined") return;
  const sanitized = sanitizeAppsForStorage(apps);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
  } catch {
    /* quota or private mode — still notify UI */
  }
  window.dispatchEvent(new CustomEvent("applications-updated"));
}

export function updateApplication(id, updater) {
  const apps = getApplicationsSnapshot();
  const idx = apps.findIndex((a) => Number(a.id) === Number(id));
  if (idx === -1) return null;
  const prev = apps[idx];
  const next = typeof updater === "function" ? updater({ ...prev }) : { ...prev, ...updater };
  apps[idx] = normalizeApplication(next);
  setApplicationsSnapshot(apps);
  return apps[idx];
}

export function buildSyncedStages(app, currentStageIndex) {
  const capped = Math.max(0, Math.min(currentStageIndex, STAGE_ORDER.length - 1));
  return STAGE_ORDER.map((name, i) => {
    const prev = app.stages?.find((s) => s.name === name);
    const status = i < capped ? "completed" : i === capped ? "current" : "upcoming";
    let date = prev?.date;
    if (!date || date === "Pending") {
      if (i < capped) date = prev?.date && prev.date !== "Pending" ? prev.date : "Completed";
      else if (i === capped) date = "In Progress";
      else date = "Pending";
    }
    return { name, date, status };
  });
}

/**
 * @returns {{ success: boolean; error?: string }}
 */
export function moveApplicationToNextStage(id) {
  const apps = getApplicationsSnapshot();
  const app = apps.find((a) => Number(a.id) === Number(id));
  if (!app) return { success: false, error: "Application not found." };
  const cur = Number.isFinite(Number(app.currentStageIndex)) ? Number(app.currentStageIndex) : 0;

  if (cur < OFFER_STAGE_INDEX) {
    const nextIdx = cur + 1;
    const stageName = STAGE_ORDER[nextIdx];
    updateApplication(id, (prev) => ({
      ...prev,
      currentStageIndex: nextIdx,
      stage: stageName,
      stages: buildSyncedStages(prev, nextIdx),
      status: nextIdx === OFFER_STAGE_INDEX ? "Offer Sent" : "In Progress",
      lifecycleStage: deriveLifecycleStage({
        ...prev,
        currentStageIndex: nextIdx,
        onboarding: { ...defaultOnboardingState(), ...prev.onboarding },
      }),
    }));
    return { success: true };
  }

  if (cur === OFFER_STAGE_INDEX && !app.onboarding?.enabled) {
    const { ok, error } = validateRequiredDocumentsForOnboarding(app);
    if (!ok) return { success: false, error: error || "Candidate documents are incomplete" };
    updateApplication(id, (prev) => ({
      ...prev,
      onboarding: {
        ...defaultOnboardingState(),
        ...prev.onboarding,
        enabled: true,
        step: 1,
      },
      lifecycleStage: "onboarding",
    }));
    return { success: true };
  }

  return { success: false, error: "Candidate is already in onboarding or no further stage to advance." };
}

export function adminApproveOnboardingProfile(applicantId) {
  return updateApplication(applicantId, (prev) => ({
    ...prev,
    onboarding: { ...defaultOnboardingState(), ...prev.onboarding, profileCompleted: true },
  }));
}

/** Candidate finished step 1 (profile) in the onboarding iframe — unlocks later steps like admin approval would. */
export function applicantMarkOnboardingProfileComplete(applicantId) {
  return updateApplication(applicantId, (prev) => ({
    ...prev,
    onboarding: { ...defaultOnboardingState(), ...prev.onboarding, profileCompleted: true },
  }));
}

/** Applicant clicked through BGV step 3 — unlocks review (step 4). Admin hire still uses bgvCompleted. */
export function applicantAcknowledgeBgvStep(applicantId) {
  return updateApplication(applicantId, (prev) => ({
    ...prev,
    onboarding: { ...defaultOnboardingState(), ...prev.onboarding, bgvApplicantAcknowledged: true },
  }));
}

export function adminApproveOnboardingDocumentsBundle(applicantId) {
  return updateApplication(applicantId, (prev) => {
    const list = [...(prev.onboardingDocuments || [])];
    for (const row of REQUIRED_DOCUMENT_ROWS) {
      if (!row.required) continue;
      const ix = list.findIndex((d) => d.templateKey === row.key);
      if (ix >= 0) {
        list[ix] = {
          ...list[ix],
          verification: "verified",
          verificationStatus: VERIFICATION_LEGACY.verified,
        };
      }
    }
    return {
      ...prev,
      onboardingDocuments: mergeOnboardingDocumentList(list, prev.adminRequestedDocuments || []),
      onboarding: { ...defaultOnboardingState(), ...prev.onboarding, documentsCompleted: true },
    };
  });
}

/** Set BGV portal URL and optional instructions note for the applicant onboarding step 3. */
export function adminSetBgvInstructions(applicantId, { link, note } = {}) {
  return updateApplication(applicantId, (prev) => {
    const ob = { ...defaultOnboardingState(), ...prev.onboarding };
    const nextLink = link !== undefined ? String(link || "").trim() : ob.bgvLink;
    const nextNote = note !== undefined ? String(note || "").trim() : ob.bgvNote;
    return {
      ...prev,
      onboarding: { ...ob, bgvLink: nextLink, bgvNote: nextNote },
    };
  });
}

export function adminSetBgvLink(applicantId, url) {
  return adminSetBgvInstructions(applicantId, { link: url });
}

export function adminAddDocumentRequest(applicantId, name) {
  const trimmed = String(name || "").trim();
  if (!trimmed) return null;
  const id = `r_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  return updateApplication(applicantId, (prev) => ({
    ...prev,
    adminRequestedDocuments: [...(prev.adminRequestedDocuments || []), { id, name: trimmed }],
  }));
}

export function adminAddBgvRequest(applicantId, name) {
  const trimmed = String(name || "").trim();
  if (!trimmed) return null;
  const id = `b_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  return updateApplication(applicantId, (prev) => ({
    ...prev,
    adminBgvRequests: [...(prev.adminBgvRequests || []), { id, name: trimmed }],
  }));
}

export function adminApproveBgv(applicantId) {
  return updateApplication(applicantId, (prev) => ({
    ...prev,
    onboarding: { ...defaultOnboardingState(), ...prev.onboarding, bgvCompleted: true },
  }));
}

export function applicantSetOnboardingStep(applicantId, step) {
  const s = Math.max(1, Math.min(5, Number(step) || 1));
  return updateApplication(applicantId, (prev) => ({
    ...prev,
    onboarding: { ...defaultOnboardingState(), ...prev.onboarding, step: s },
  }));
}

export function applicantSubmitOnboardingFinal(applicantId) {
  return updateApplication(applicantId, (prev) => ({
    ...prev,
    onboarding: {
      ...defaultOnboardingState(),
      ...prev.onboarding,
      finalSubmitted: true,
      completed: true,
      step: 5,
    },
  }));
}

export function getPostLoginPathForApplicant(numericAppId) {
  const apps = getApplicationsSnapshot();
  const app = apps.find((a) => Number(a.id) === Number(numericAppId));
  if (!app) return "/applicant/dashboard";
  const normalized = normalizeApplication(app);
  if (normalized.lifecycleStage === "employee" && normalized.employeeId) {
    return { path: "/employee/dashboard", employeeId: String(normalized.employeeId) };
  }
  if (normalized.onboarding?.enabled && !normalized.onboarding?.finalSubmitted) {
    const step = normalized.onboarding.step || 1;
    return { path: `/applicant/onboarding/${step}` };
  }
  return { path: "/applicant/dashboard" };
}

export function appendNewApplicationFromForm(formData) {
  const apps = getApplicationsSnapshot();
  const nextId = apps.length ? Math.max(...apps.map((a) => Number(a.id) || 0)) + 1 : 1;
  const stages = STAGE_ORDER.map((name, i) => ({
    name,
    date:
      i === 0
        ? new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "Pending",
    status: i === 0 ? "current" : "upcoming",
  }));
  const app = normalizeApplication({
    id: nextId,
    jobId: formData.jobId != null && String(formData.jobId).trim() !== "" ? String(formData.jobId) : "applied",
    name: formData.name,
    role: formData.discipline,
    experience: formData.experience,
    location: "",
    email: formData.email,
    phone: formData.phone,
    stage: STAGE_ORDER[0],
    status: "Submitted",
    skills: [],
    appliedDate: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    documents: {
      resume: formData.resumeName ? "#" : "",
      coverLetter: "",
      portfolio: "",
    },
    stages,
    currentStageIndex: 0,
    messages: [],
    adminRequestedDocuments: [],
    adminBgvRequests: [],
    onboardingDocuments: [],
    onboarding: defaultOnboardingState(),
    timesheets: [],
    employeeId: null,
    lifecycleStage: "applied",
    interview: null,
  });
  apps.push(app);
  setApplicationsSnapshot(apps);
  return app;
}

export function upsertOnboardingDocument(applicantId, templateKey, payload) {
  return updateApplication(applicantId, (app) => {
    const list = [...(app.onboardingDocuments || [])];
    const ix = list.findIndex((d) => d.templateKey === templateKey);
    const row = {
      templateKey,
      id: templateKey,
      name: payload.name,
      fileName: payload.fileName,
      fileData: "",
      fileUrl: "/sample.pdf",
      expiryDate: payload.expiryDate,
      status: "uploaded",
      verification: "unapproved",
      verificationStatus: "Unapproved",
    };
    if (ix >= 0) list[ix] = { ...list[ix], ...row };
    else list.push(row);
    return { ...app, onboardingDocuments: list };
  });
}

/**
 * @param {"unapproved"|"waiting"|"verified"|"rejected"} verification
 */
export function setOnboardingVerification(applicantId, templateKey, verification) {
  const legacy = VERIFICATION_LEGACY[verification] || "Unapproved";
  return updateApplication(applicantId, (app) => {
    const list = [...(app.onboardingDocuments || [])];
    const ix = list.findIndex((d) => d.templateKey === templateKey);
    const template = REQUIRED_DOCUMENT_ROWS.find((r) => r.key === templateKey);
    const adminReq = (app.adminRequestedDocuments || []).find((r) => `adminreq_${r.id}` === templateKey);
    const displayName = template?.label || adminReq?.name || templateKey;
    if (ix < 0) {
      list.push({
        id: templateKey,
        templateKey,
        name: displayName,
        fileName: "",
        fileData: "",
        fileUrl: null,
        expiryDate: template?.expiry ? String(template.expiry).slice(0, 10) : "",
        verification,
        verificationStatus: legacy,
      });
    } else {
      list[ix] = { ...list[ix], verification, verificationStatus: legacy };
    }
    return { ...app, onboardingDocuments: list };
  });
}

export function submitOnboardingDocumentForVerification(applicantId, templateKey) {
  return setOnboardingVerification(applicantId, templateKey, "waiting");
}

/** @deprecated use setOnboardingVerification */
export function setOnboardingVerificationStatus(applicantId, templateKey, verificationStatus) {
  const map = { Verified: "verified", Rejected: "rejected", "Waiting for Verification": "waiting", Unapproved: "unapproved" };
  const v = map[verificationStatus];
  if (!v) return null;
  return setOnboardingVerification(applicantId, templateKey, v);
}

export function useApplicationsSync() {
  const [version, setVersion] = useState(0);
  const refresh = () => setVersion((v) => v + 1);
  useEffect(() => {
    const onUpdate = () => refresh();
    window.addEventListener("applications-updated", onUpdate);
    const onStorage = (e) => {
      if (e.storageArea === localStorage && e.key === STORAGE_KEY) refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("applications-updated", onUpdate);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  const applications = useMemo(() => {
    try {
      const list = getApplicationsSnapshot();
      return Array.isArray(list) ? list : [];
    } catch (e) {
      console.error("useApplicationsSync:", e);
      return [];
    }
  }, [version]);
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log("Applications:", applications);
    }
  }, [applications]);
  return { applications, refresh, version };
}
