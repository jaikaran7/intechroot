import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import OnboardingShell from "./OnboardingShell";
import { onboardingService } from "@/services/onboarding.service";
import { documentsService } from "@/services/documents.service";

const NATIONALITIES = [
  "Canadian", "American", "Indian", "British", "Australian", "German", "French",
  "Mexican", "Japanese", "Chinese", "Brazilian", "South African", "Nigerian", "Other",
];

const GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"];

function splitName(name) {
  const n = String(name || "").trim();
  if (!n) return { firstName: "", lastName: "" };
  const parts = n.split(/\s+/);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" "),
  };
}

function toDateInputValue(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

export default function ProfileStep({ applicationId, onboarding, maxAllowed }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const app = onboarding?.application || {};

  const initialFromApp = useMemo(() => {
    const { firstName, lastName } = splitName(app.name);
    return {
      firstName,
      lastName,
      email: app.email || "",
      phone: app.phone || "",
      dateOfBirth: toDateInputValue(app.dateOfBirth),
      gender: app.gender || "",
      nationality: app.nationality || "",
      profilePhotoUrl: app.profilePhotoUrl || "",
      profilePhotoName: app.profilePhotoName || "",
    };
  }, [app.name, app.email, app.phone, app.dateOfBirth, app.gender, app.nationality, app.profilePhotoUrl, app.profilePhotoName]);

  const [form, setForm] = useState(initialFromApp);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [photoPreview, setPhotoPreview] = useState(initialFromApp.profilePhotoUrl || "");
  const [photoUploading, setPhotoUploading] = useState(false);

  useEffect(() => {
    setForm(initialFromApp);
    setPhotoPreview(initialFromApp.profilePhotoUrl || "");
  }, [initialFromApp]);

  const uploadPhotoMutation = useMutation({
    mutationFn: (file) => {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("applicationId", applicationId);
      fd.append("templateKey", "profile_photo");
      fd.append("name", "Profile Photo");
      return documentsService.upsert(fd);
    },
  });

  const submitProfileMutation = useMutation({
    mutationFn: (payload) => onboardingService.submitProfile(applicationId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding', applicationId] });
      queryClient.invalidateQueries({ queryKey: ['application', applicationId] });
      navigate("/applicant/onboarding/2", { replace: true });
    },
    onError: (err) => {
      setSubmitError(err?.response?.data?.error?.message || "Unable to save your profile. Please try again.");
    },
  });

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((er) => ({ ...er, [key]: "" }));
    setSubmitError("");
  }

  function validate() {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required.";
    if (!form.lastName.trim()) e.lastName = "Last name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Enter a valid email address.";
    if (!form.phone.trim()) e.phone = "Phone number is required.";
    if (!form.dateOfBirth) e.dateOfBirth = "Date of birth is required.";
    if (!form.gender.trim()) e.gender = "Gender is required.";
    if (!form.nationality.trim()) e.nationality = "Nationality is required.";
    if (!form.profilePhotoUrl.trim()) e.profilePhotoUrl = "Profile photo is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handlePhotoPick() {
    fileInputRef.current?.click();
  }

  async function handlePhotoSelected(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!/^image\//.test(file.type)) {
      setErrors((er) => ({ ...er, profilePhotoUrl: "Please select an image file." }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((er) => ({ ...er, profilePhotoUrl: "Image must be 5MB or smaller." }));
      return;
    }
    const localPreview = URL.createObjectURL(file);
    setPhotoPreview(localPreview);
    setPhotoUploading(true);
    try {
      const doc = await uploadPhotoMutation.mutateAsync(file);
      setField("profilePhotoUrl", doc.storagePath || doc.fileUrl || "");
      setField("profilePhotoName", doc.fileName || file.name);
      if (doc.fileUrl && /^https?:\/\//i.test(doc.fileUrl)) setPhotoPreview(doc.fileUrl);
    } catch (err) {
      setErrors((er) => ({
        ...er,
        profilePhotoUrl: err?.response?.data?.error?.message || "Photo upload failed. Try again.",
      }));
      setPhotoPreview(initialFromApp.profilePhotoUrl || "");
    } finally {
      setPhotoUploading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;
    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      dateOfBirth: form.dateOfBirth,
      gender: form.gender.trim(),
      nationality: form.nationality.trim(),
      profilePhotoUrl: form.profilePhotoUrl.trim(),
    };
    const photoName = form.profilePhotoName.trim();
    if (photoName) payload.profilePhotoName = photoName;
    submitProfileMutation.mutate(payload);
  }

  const totalComplete = 20;
  const finalSubmitted = Boolean(onboarding?.finalSubmitted);

  return (
    <OnboardingShell
      stepNum={1}
      maxAllowed={maxAllowed}
      onNavigate={(n) => navigate(`/applicant/onboarding/${n}`)}
      eyebrow="Step 01 — Getting Started"
      title="Profile"
      titleAccent="Identity"
      rightPill="Bank-Grade Encryption"
    >
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoSelected}
        />
        <div className="lg:col-span-2 rounded-2xl border border-outline-variant/10 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-white flex items-center justify-center">
              <span className="material-symbols-outlined">badge</span>
            </div>
            <div>
              <h2 className="font-headline text-xl font-bold text-primary">Legal Identity</h2>
              <p className="text-xs text-on-surface-variant">
                Start your onboarding by providing your legal information. Ensure details match your official documents.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="First Name" required error={errors.firstName}>
              <input
                className="input"
                type="text"
                value={form.firstName}
                disabled={finalSubmitted}
                onChange={(e) => setField("firstName", e.target.value)}
                placeholder="e.g. Jonathan"
              />
            </Field>
            <Field label="Last Name" required error={errors.lastName}>
              <input
                className="input"
                type="text"
                value={form.lastName}
                disabled={finalSubmitted}
                onChange={(e) => setField("lastName", e.target.value)}
                placeholder="e.g. Sterling"
              />
            </Field>
            <Field label="Email Address" required error={errors.email} className="md:col-span-2">
              <input
                className="input"
                type="email"
                value={form.email}
                disabled={finalSubmitted}
                onChange={(e) => setField("email", e.target.value)}
                placeholder="j.sterling@example.com"
              />
            </Field>
            <Field label="Phone Number" required error={errors.phone}>
              <input
                className="input"
                type="tel"
                value={form.phone}
                disabled={finalSubmitted}
                onChange={(e) => setField("phone", e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </Field>
            <Field label="Date of Birth" required error={errors.dateOfBirth}>
              <input
                className="input"
                type="date"
                value={form.dateOfBirth}
                disabled={finalSubmitted}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setField("dateOfBirth", e.target.value)}
              />
            </Field>
            <Field label="Gender" required error={errors.gender}>
              <select
                className="input"
                value={form.gender}
                disabled={finalSubmitted}
                onChange={(e) => setField("gender", e.target.value)}
              >
                <option value="">Select gender</option>
                {GENDERS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </Field>
            <Field label="Nationality" required error={errors.nationality}>
              <select
                className="input"
                value={form.nationality}
                disabled={finalSubmitted}
                onChange={(e) => setField("nationality", e.target.value)}
              >
                <option value="">Select your country</option>
                {NATIONALITIES.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-outline-variant/10 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline text-base font-bold text-primary">Profile Photo</h3>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  form.profilePhotoUrl ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                }`}
              >
                {form.profilePhotoUrl ? "Uploaded" : "Required"}
              </span>
            </div>
            <button
              type="button"
              onClick={handlePhotoPick}
              disabled={finalSubmitted || photoUploading}
              className="w-full aspect-square rounded-xl border-2 border-dashed border-outline-variant/40 bg-surface-container-lowest flex flex-col items-center justify-center text-center overflow-hidden hover:border-primary/40 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <>
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">image</span>
                  <p className="text-sm font-semibold text-primary">
                    {photoUploading ? "Uploading…" : "Click to upload photo"}
                  </p>
                  <p className="text-[10px] text-on-surface-variant mt-1">JPG, PNG up to 5MB</p>
                </>
              )}
            </button>
            {form.profilePhotoName ? (
              <p className="mt-3 text-xs text-on-surface-variant truncate">{form.profilePhotoName}</p>
            ) : null}
            {errors.profilePhotoUrl ? (
              <p className="mt-2 text-xs text-error font-medium">{errors.profilePhotoUrl}</p>
            ) : null}
            {form.profilePhotoUrl ? (
              <button
                type="button"
                onClick={handlePhotoPick}
                disabled={finalSubmitted || photoUploading}
                className="mt-3 text-xs font-bold text-secondary hover:underline disabled:opacity-50"
              >
                Replace photo
              </button>
            ) : null}
          </div>

          <div className="rounded-2xl bg-primary-container text-white p-6">
            <h4 className="font-headline text-base font-bold mb-2">Why this matters</h4>
            <p className="text-xs text-white/70 leading-relaxed">
              Your profile photo will be used for your internal identity card and system access once onboarding is
              complete.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              <span>Auto-ID Recognition Enabled</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 rounded-2xl border border-outline-variant/10 bg-white px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
          <div>
            {submitError ? (
              <p className="text-sm text-error font-semibold">{submitError}</p>
            ) : (
              <p className="text-xs text-on-surface-variant">
                Total progress: <span className="font-bold text-primary">{totalComplete}% Complete</span> · All fields are required.
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/applicant/dashboard")}
              className="px-5 py-2.5 text-xs font-bold text-on-surface-variant hover:text-primary"
            >
              Cancel Application
            </button>
            <button
              type="submit"
              disabled={submitProfileMutation.isPending || photoUploading || finalSubmitted}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg hover:opacity-95 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitProfileMutation.isPending ? "Saving…" : "Save & Continue"}
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        </div>
      </form>

      <style>{`
        .input {
          width: 100%;
          padding: 0.65rem 0.9rem;
          border-radius: 0.5rem;
          border: 1px solid rgba(17, 24, 39, 0.12);
          background: #fff;
          font-size: 0.875rem;
          color: #0b1f3a;
        }
        .input:focus { outline: none; box-shadow: 0 0 0 3px rgba(64,89,170,0.18); border-color: #4059aa; }
        .input:disabled { background: #f5f7fb; cursor: not-allowed; }
      `}</style>
    </OnboardingShell>
  );
}

function Field({ label, required, error, className, children }) {
  return (
    <div className={className}>
      <label className="block text-[10px] font-bold uppercase tracking-widest text-outline mb-1">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>
      {children}
      {error ? <p className="mt-1 text-[11px] text-error font-medium">{error}</p> : null}
    </div>
  );
}
