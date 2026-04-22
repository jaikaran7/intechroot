import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { applicationsService } from "../../../services/applications.service";
import { jobsService } from "../../../services/jobs.service";
import FormSection from "./FormSection";

export default function ApplyTalentPipeline() {
  const navigate = useNavigate();
  const location = useLocation();
  const incoming = location.state || {};

  const { data: jobsApi, isLoading: jobsLoading } = useQuery({
    queryKey: ["jobs", { status: "Active" }],
    queryFn: () => jobsService.getAll({ status: "Active", limit: 100 }),
    staleTime: 300_000,
  });
  const jobs = useMemo(() => {
    const list = jobsApi?.data;
    return Array.isArray(list) ? list : [];
  }, [jobsApi]);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    linkedIn: "",
    portfolio: "",
    skills: [],
    resume: null,
    jobId: incoming.jobId || "",
    discipline: incoming.jobTitle || incoming.discipline || "",
    experience: "",
  });

  useEffect(() => {
    if (!incoming.jobId || !jobs.length) return;
    const j = jobs.find((x) => x.id === incoming.jobId);
    if (j) {
      setForm((f) => ({ ...f, jobId: j.id, discipline: j.title }));
    }
  }, [incoming.jobId, jobs]);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, resume: file }));
  };

  const handleRemoveResume = () => {
    setForm((prev) => ({ ...prev, resume: null }));
  };

  const resumePreviewUrl = useMemo(() => {
    if (!form.resume || !(form.resume instanceof File)) return null;
    if (form.resume.type === "application/pdf") return URL.createObjectURL(form.resume);
    return null;
  }, [form.resume]);

  useEffect(() => {
    return () => {
      if (resumePreviewUrl) URL.revokeObjectURL(resumePreviewUrl);
    };
  }, [resumePreviewUrl]);

  const handleJobChange = (e) => {
    const id = e.target.value;
    const job = jobs.find((j) => j.id === id);
    setForm((prev) => ({
      ...prev,
      jobId: id,
      discipline: job?.title || "",
    }));
  };

  const handleSkillAdd = (skill) => {
    const t = skill.trim();
    if (!t) return;
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(t) ? prev.skills : [...prev.skills, t],
    }));
  };

  const handleSkillRemove = (idx) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== idx),
    }));
  };

  const validationErrors = useMemo(() => {
    const next = {};
    if (!form.firstName.trim()) next.firstName = "First name is required.";
    if (!form.lastName.trim()) next.lastName = "Last name is required.";
    if (!form.email.trim()) next.email = "Email is required.";
    if (!form.phone.trim()) next.phone = "Phone is required.";
    const rawExp = Number(form.experience);
    const yearsRounded = Number.isFinite(rawExp) ? Math.round(rawExp) : NaN;
    if (form.experience === "" || form.experience == null) next.experience = "Years of experience is required.";
    else if (!Number.isFinite(rawExp) || yearsRounded < 0 || yearsRounded > 80) next.experience = "Enter a valid number (0–80).";
    if (!form.resume) next.resume = "Resume upload is required.";
    if (!form.jobId?.trim()) next.jobId = "Please select a job role.";
    return next;
  }, [form]);

  const submitMutation = useMutation({
    mutationFn: (payload) => applicationsService.create(payload),
    onSuccess: (application) => {
      const submittedAtLabel = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      navigate("/application-success", {
        state: {
          referenceId: application.referenceId,
          submittedAtLabel,
          jobTitle: form.discipline,
          company: incoming.company || "InTechRoot",
          applicantId: application.id,
          fromApply: true,
        },
      });
    },
    onError: (err) => {
      if (err.response?.status === 409) {
        navigate("/already-applied", {
          state: {
            jobTitle: form.discipline,
            company: incoming.company || "InTechRoot",
          },
        });
      } else {
        setSubmitError(
          err.response?.data?.error?.message || "Submission failed. Please try again."
        );
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError("");
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const fullName = [form.firstName, form.lastName].filter(Boolean).join(" ").trim();
    const expNum = Number(form.experience);
    const experience = Number.isFinite(expNum) ? `${Math.round(expNum)} Yrs` : String(form.experience).trim();

    const fd = new FormData();
    fd.append("name", fullName);
    fd.append("email", form.email);
    fd.append("phone", form.phone);
    fd.append("discipline", form.discipline || "");
    fd.append("experience", experience);
    fd.append("location", form.location || "");
    fd.append("linkedIn", form.linkedIn || "");
    fd.append("portfolio", form.portfolio || "");
    fd.append("skills", JSON.stringify(form.skills || []));
    if (form.jobId) fd.append("jobId", form.jobId);
    if (form.resume) fd.append("resume", form.resume);

    submitMutation.mutate(fd);
  };

  return (
    <div className="apply-talent-pipeline relative bg-transparent px-4 py-10 font-body text-on-surface selection:bg-tertiary-fixed selection:text-on-tertiary-fixed sm:px-6 md:py-12 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row rounded-2xl lg:rounded-3xl overflow-hidden border border-outline-variant/20 shadow-[0_40px_80px_-24px_rgba(0,6,21,0.12)] bg-white">
          <aside className="hero-gradient relative lg:w-[38%] xl:w-[40%] shrink-0 px-8 py-10 md:px-10 md:py-11 flex flex-col justify-center overflow-hidden">
            <div className="absolute inset-0 mesh-gradient opacity-50 pointer-events-none" aria-hidden />
            <div className="absolute inset-0 network-grid opacity-25 pointer-events-none" aria-hidden />
            <div className="absolute top-1/4 right-0 w-48 h-48 bg-tertiary-fixed/15 rounded-full blur-[80px] pointer-events-none" aria-hidden />
            <div className="relative z-10 text-white space-y-5 md:space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-tertiary-fixed shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/90">InTechRoot Talent Pipeline</span>
              </div>
              <h1 className="font-headline text-3xl sm:text-4xl md:text-[2.35rem] font-extrabold tracking-tighter leading-[1.08] text-white monolith-text">
                Join the <span className="bg-gradient-to-r from-white via-tertiary-fixed to-secondary bg-clip-text text-transparent">InTechRoot</span> Ecosystem
              </h1>
              <p className="text-sm md:text-base text-white/70 font-light leading-relaxed max-w-md">
                Secure your place in InTechRoot&apos;s global network of elite architects, consultants, and technology strategists.
              </p>
            </div>
          </aside>

          <div className="min-h-0 flex-1 min-w-0 bg-white lg:min-h-0">
            <FormSection
              form={form}
              errors={errors}
              jobs={jobs}
              jobsLoading={jobsLoading}
              onChange={handleChange}
              onFileChange={handleFileChange}
              onJobChange={handleJobChange}
              onRemoveResume={handleRemoveResume}
              resumePreviewUrl={resumePreviewUrl}
              onSubmit={handleSubmit}
              onSkillAdd={handleSkillAdd}
              onSkillRemove={handleSkillRemove}
              isPending={submitMutation.isPending}
              submitError={submitError}
            />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-panel p-4 rounded-xl flex gap-3 items-start">
            <span className="material-symbols-outlined text-secondary text-xl shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
            <div>
              <h4 className="font-headline font-bold text-[10px] uppercase tracking-wider text-primary mb-0.5">Global Verification</h4>
              <p className="text-[10px] text-on-surface-variant leading-snug">Our multi-tier verification ensures you work with the world&apos;s most sophisticated clients.</p>
            </div>
          </div>
          <div className="glass-panel p-4 rounded-xl flex gap-3 items-start">
            <span className="material-symbols-outlined text-secondary text-xl shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
              speed
            </span>
            <div>
              <h4 className="font-headline font-bold text-[10px] uppercase tracking-wider text-primary mb-0.5">Accelerated Flow</h4>
              <p className="text-[10px] text-on-surface-variant leading-snug">Initial assessment completed within 72 hours of strategic alignment verification.</p>
            </div>
          </div>
          <div className="glass-panel p-4 rounded-xl flex gap-3 items-start">
            <span className="material-symbols-outlined text-secondary text-xl shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
              hub
            </span>
            <div>
              <h4 className="font-headline font-bold text-[10px] uppercase tracking-wider text-primary mb-0.5">Elite Network</h4>
              <p className="text-[10px] text-on-surface-variant leading-snug">Gain immediate access to our proprietary collaboration platforms and methodology.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
