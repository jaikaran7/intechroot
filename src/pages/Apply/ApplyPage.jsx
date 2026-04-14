import { useMemo, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { appendNewApplicationFromForm } from "@/data/applicationsStore";
import {
  appendJobApplication,
  getJobApplications,
  hasUserApplied,
  normalizeApplicantUserId,
  resolveJobIdFromApplyState,
} from "../../utils/applicationService";
import Typography from "../../components/Typography";
import FormSection from "./components/FormSection";
import "./apply.css";

export default function ApplyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const incoming = location.state || {};
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    resume: null,
    discipline: incoming.discipline || "Cloud Infrastructure Architecture",
    experience: incoming.experience || "5-8 Years",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, resume: file }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validationErrors = useMemo(() => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!form.email.trim()) next.email = "Email is required.";
    if (!form.phone.trim()) next.phone = "Phone is required.";
    if (!form.resume) next.resume = "Resume upload is required.";
    return next;
  }, [form]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      const userId = normalizeApplicantUserId(form.email);
      const jobId = resolveJobIdFromApplyState(incoming, form.discipline);
      const ledger = getJobApplications();
      if (hasUserApplied(userId, jobId, ledger)) {
        const existingRow = ledger.find((a) => a.userId === userId && a.jobId === jobId);
        navigate("/already-applied", {
          state: {
            jobTitle: form.discipline,
            company: incoming.company || "InTechRoot",
            referenceId: existingRow?.id || undefined,
            lastUpdatedLabel: existingRow?.appliedAt
              ? new Date(existingRow.appliedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : undefined,
          },
        });
        return;
      }

      const formData = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        discipline: form.discipline,
        experience: form.experience,
        resumeName: form.resume?.name || "",
        jobId,
      };
      appendJobApplication({
        userId,
        jobId,
        status: "submitted",
        appliedAt: new Date().toISOString().slice(0, 10),
      });
      const applicationRecord = appendNewApplicationFromForm(formData);
      localStorage.setItem("applyFormData", JSON.stringify(formData));
      localStorage.setItem(
        "applySuccessContext",
        JSON.stringify({ formData, application: applicationRecord }),
      );
      const referenceId = `ITR-${String(applicationRecord.id).padStart(5, "0")}`;
      const submittedAtLabel = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      navigate("/application-success", {
        state: {
          referenceId,
          submittedAtLabel,
          jobTitle: form.discipline,
          company: incoming.company || "InTechRoot",
          applicantId: applicationRecord.id,
        },
      });
    }
  };

  return (
    <>
      <main className="min-h-screen pt-32 pb-20 px-6 network-bg relative overflow-hidden bg-surface font-body text-on-surface selection:bg-tertiary-fixed selection:text-on-tertiary-fixed">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-tertiary-fixed/10 rounded-full blur-[100px] -z-10 -translate-x-1/3 translate-y-1/3"></div>
        <div className="max-w-4xl mx-auto">
          <header className="mb-12 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant/15 mb-6">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">InTechRoot Talent Pipeline</span>
            </div>
            <Typography as="h1" className="font-headline text-5xl md:text-6xl font-extrabold tracking-tighter text-primary mb-4">
              Join the <span className="text-secondary">InTechRoot</span> Ecosystem
            </Typography>
            <Typography as="p" className="text-on-surface-variant text-lg max-w-xl font-light leading-relaxed">
              Secure your place in InTechRoot's global network of elite architects, consultants, and technology strategists.
            </Typography>
          </header>

          <FormSection form={form} errors={errors} onChange={handleChange} onFileChange={handleFileChange} onSelectChange={handleSelectChange} onSubmit={handleSubmit} />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-xl flex gap-4 items-start">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
              <div>
                <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-primary mb-1">Global Verification</h4>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">Our multi-tier verification ensures you work with the world's most sophisticated clients.</p>
              </div>
            </div>
            <div className="glass-panel p-6 rounded-xl flex gap-4 items-start">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                speed
              </span>
              <div>
                <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-primary mb-1">Accelerated Flow</h4>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">Initial assessment completed within 72 hours of strategic alignment verification.</p>
              </div>
            </div>
            <div className="glass-panel p-6 rounded-xl flex gap-4 items-start">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                hub
              </span>
              <div>
                <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-primary mb-1">Elite Network</h4>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">Gain immediate access to our proprietary collaboration platforms and methodology.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="w-full py-12 px-12 border-t border-[#c4c6ce]/15 bg-[#f7f9fc] dark:bg-[#000615]">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 max-w-[1920px] mx-auto">
          <div className="flex flex-col gap-2">
            <div className="font-['Manrope'] font-bold text-lg text-[#000615] dark:text-white">INTECHROOT</div>
            <p className="font-['Inter'] text-xs leading-relaxed tracking-wide text-[#7587a7]">© 2024 InTechRoot Architectural Intelligence. All rights reserved.</p>
          </div>
          <div className="flex gap-8">
            <Link className="font-['Inter'] text-xs leading-relaxed tracking-wide text-[#7587a7] hover:text-[#000615] dark:hover:text-[#acedff] transition-colors duration-200" to="/">
              Privacy Policy
            </Link>
            <Link className="font-['Inter'] text-xs leading-relaxed tracking-wide text-[#7587a7] hover:text-[#000615] dark:hover:text-[#acedff] transition-colors duration-200" to="/">
              Terms of Service
            </Link>
            <Link className="font-['Inter'] text-xs leading-relaxed tracking-wide text-[#7587a7] hover:text-[#000615] dark:hover:text-[#acedff] transition-colors duration-200" to="/">
              Global Compliance
            </Link>
            <Link className="font-['Inter'] text-xs leading-relaxed tracking-wide text-[#7587a7] hover:text-[#000615] dark:hover:text-[#acedff] transition-colors duration-200" to="/">
              Cookie Settings
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
