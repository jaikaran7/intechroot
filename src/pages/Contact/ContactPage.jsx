import { useEffect, useState } from "react";
import SiteFooter from "../../components/SiteFooter";
import { COMPANY_NAME } from "../../constants/companyBrand";
import { COMPANY_CONTACT } from "../../constants/companyContact";
import { inquiriesService } from "../../services/inquiries.service";
import "../Home/home.css";

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("sr-visible"); }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll("[data-sr]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

const SERVICES = [
  "ERP / SAP Solutions",
  "Cloud Services",
  "Software Development",
  "Data & Analytics",
  "AI & Automation",
  "IT Staffing",
  "IT Consulting",
  "Other",
];

const CONTACT_ITEMS = [
  { icon: "mail",        label: "Email",    value: COMPANY_CONTACT.email, href: `mailto:${COMPANY_CONTACT.email}` },
  { icon: "call",        label: "Phone",    value: COMPANY_CONTACT.phone, href: `tel:${COMPANY_CONTACT.phoneTel}` },
  { icon: "location_on", label: "Location", value: COMPANY_CONTACT.address || "North America", href: null },
];

const INITIAL = { name: "", email: "", company: "", phone: "", service: "", message: "" };

export default function ContactPage() {
  useScrollReveal();
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    document.title = `Contact | ${COMPANY_NAME}`;
    document.body.className =
      "bg-background font-body text-on-surface selection:bg-tertiary-fixed-dim selection:text-on-tertiary-fixed overflow-x-hidden";
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.message.trim()) e.message = "Message is required";
    else if (form.message.trim().length < 10) e.message = "Message must be at least 10 characters";
    return e;
  };

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStatus("submitting");
    try {
      await inquiriesService.submit({
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim() || undefined,
        phone: form.phone.trim() || undefined,
        service: form.service || undefined,
        message: form.message.trim(),
      });
      setStatus("success");
      setForm(INITIAL);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err?.response?.data?.error?.message || "Something went wrong. Please try again.");
    }
  };

  const inputClass = (field) =>
    `w-full bg-white border rounded-xl px-4 py-3.5 text-sm font-medium text-primary placeholder:text-on-surface-variant/40 outline-none transition-all focus:ring-2 ${
      errors[field]
        ? "border-red-400 focus:ring-red-400/20"
        : "border-outline-variant/20 focus:border-secondary focus:ring-secondary/15"
    }`;

  return (
    <>
      {/* ── Hero band ──────────────────────────────────────── */}
      <section className="relative hero-gradient overflow-hidden pt-24 md:pt-28 lg:pt-32 pb-20 md:pb-28 lg:pb-36">
        <div className="absolute inset-0 network-grid-intricate opacity-15" />
        <div className="absolute top-[20%] right-[10%] w-72 h-72 bg-secondary/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="max-w-2xl">
            <div data-sr="up" className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-6">
              <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-pulse" />
              <span className="text-[10px] font-black text-white/70 uppercase tracking-[0.4em]">Get in touch</span>
            </div>
            <h1 data-sr="up" data-delay="100" className="text-4xl sm:text-5xl md:text-6xl font-headline font-extrabold text-white tracking-tight leading-[1.05] mb-4">
              Let's Start a{" "}
              <span className="bg-gradient-to-r from-tertiary-fixed-dim to-white bg-clip-text text-transparent">
                Conversation
              </span>
            </h1>
            <p data-sr="up" data-delay="200" className="text-base md:text-lg text-white/50 font-light leading-relaxed max-w-xl">
              Tell us about your project or challenge. Our team typically responds within one business day.
            </p>
          </div>
        </div>
      </section>

      {/* ── Main content ────────────────────────────────────── */}
      <main className="relative z-10 bg-[#f7f9fc] pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

            {/* ── Contact info sidebar ──────────────────────── */}
            <div data-sr="left" className="lg:col-span-4 flex flex-col gap-4 min-w-0 max-lg:pt-8 lg:-mt-20">
              {/* Contact methods */}
              <div className="bg-primary-container rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/20 rounded-full blur-[80px] -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-tertiary-fixed-dim/10 rounded-full blur-[60px] -ml-10 -mb-10" />
                <div className="relative z-10">
                  <div className="text-[10px] font-black text-tertiary-fixed-dim uppercase tracking-[0.5em] mb-4">Direct Contact</div>
                  <h3 className="text-xl font-headline font-bold mb-6">Reach Us Directly</h3>
                  <div className="space-y-5">
                    {CONTACT_ITEMS.map(({ icon, label, value, href }) => (
                      <div key={label} className="flex items-start gap-4">
                        <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-base text-tertiary-fixed-dim">{icon}</span>
                        </div>
                        <div>
                          <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-0.5">{label}</div>
                          {href ? (
                            <a href={href} className="text-sm font-medium text-white/85 hover:text-tertiary-fixed-dim transition-colors break-all">
                              {value}
                            </a>
                          ) : (
                            <span className="text-sm font-medium text-white/85">{value}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Response time card */}
              <div className="bg-white rounded-2xl p-6 border border-outline-variant/15 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-secondary/8 flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary text-base">schedule</span>
                  </div>
                  <div className="text-sm font-headline font-bold text-primary">Response Time</div>
                </div>
                <div className="space-y-3">
                  {[
                    ["General inquiries", "Within 1 business day"],
                    ["Enterprise projects", "Within 4 hours"],
                    ["Urgent staffing", "Same day"],
                  ].map(([type, time]) => (
                    <div key={type} className="flex items-center justify-between py-2 border-b border-outline-variant/8 last:border-0">
                      <span className="text-xs text-on-primary-container/60 font-medium">{type}</span>
                      <span className="text-xs font-black text-secondary">{time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* What to expect */}
              <div className="bg-white rounded-2xl p-6 border border-outline-variant/15 shadow-sm">
                <div className="text-[10px] font-black text-secondary uppercase tracking-[0.4em] mb-4">What Happens Next</div>
                <div className="space-y-4">
                  {[
                    ["1", "We review your inquiry"],
                    ["2", "A specialist reaches out"],
                    ["3", "We schedule a discovery call"],
                  ].map(([num, text]) => (
                    <div key={num} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-secondary/10 flex items-center justify-center text-[11px] font-black text-secondary shrink-0">{num}</div>
                      <span className="text-sm text-on-primary-container/70 font-medium">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Form ─────────────────────────────────────── */}
            <div data-sr="right" data-delay="100" className="lg:col-span-8 min-w-0 max-lg:mt-2 lg:pt-2">
              <div className="bg-white rounded-2xl p-6 md:p-10 border border-outline-variant/15 shadow-sm">

                {status === "success" ? (
                  /* Success state */
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-6 shadow-lg shadow-green-100">
                      <span className="material-symbols-outlined text-4xl text-green-500" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                    <h3 className="text-2xl font-headline font-bold text-primary mb-3">Message Received!</h3>
                    <p className="text-on-primary-container/60 text-base max-w-sm leading-relaxed mb-8">
                      Thank you for reaching out. A member of our team will be in touch within one business day.
                    </p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary-container text-white rounded-xl font-headline font-bold text-[11px] uppercase tracking-[0.3em] hover:opacity-90 transition-opacity"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                      Send Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-8">
                      <h2 className="text-2xl font-headline font-bold text-primary mb-1">Send a Message</h2>
                      <p className="text-sm text-on-primary-container/50">Fill in the details and we'll get back to you promptly.</p>
                    </div>

                    {/* Name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-[11px] font-black text-on-primary-container/60 uppercase tracking-[0.3em] mb-2">
                          Full Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={set("name")}
                          placeholder="Jane Smith"
                          className={inputClass("name")}
                        />
                        {errors.name && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-[11px] font-black text-on-primary-container/60 uppercase tracking-[0.3em] mb-2">
                          Work Email <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={set("email")}
                          placeholder="jane@company.com"
                          className={inputClass("email")}
                        />
                        {errors.email && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.email}</p>}
                      </div>
                    </div>

                    {/* Company + Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-[11px] font-black text-on-primary-container/60 uppercase tracking-[0.3em] mb-2">
                          Company
                        </label>
                        <input
                          type="text"
                          value={form.company}
                          onChange={set("company")}
                          placeholder="Acme Corp"
                          className={inputClass("company")}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-black text-on-primary-container/60 uppercase tracking-[0.3em] mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={set("phone")}
                          placeholder="+1 (555) 000-0000"
                          className={inputClass("phone")}
                        />
                      </div>
                    </div>

                    {/* Service interest */}
                    <div className="mb-4">
                      <label className="block text-[11px] font-black text-on-primary-container/60 uppercase tracking-[0.3em] mb-2">
                        Service Interest
                      </label>
                      <div className="relative">
                        <select
                          value={form.service}
                          onChange={set("service")}
                          className="w-full bg-white border border-outline-variant/20 rounded-xl px-4 py-3.5 text-sm font-medium text-primary outline-none transition-all focus:border-secondary focus:ring-2 focus:ring-secondary/15 appearance-none cursor-pointer"
                        >
                          <option value="">Select a service area</option>
                          {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-sm pointer-events-none">expand_more</span>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="mb-7">
                      <label className="block text-[11px] font-black text-on-primary-container/60 uppercase tracking-[0.3em] mb-2">
                        Message <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        value={form.message}
                        onChange={set("message")}
                        placeholder="Tell us about your project, challenge, or what you're looking for..."
                        rows={5}
                        className={`${inputClass("message")} resize-none`}
                      />
                      {errors.message && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.message}</p>}
                      <p className="mt-1.5 text-[11px] text-on-surface-variant/40 font-medium">{form.message.length} / 2000</p>
                    </div>

                    {/* Error banner */}
                    {status === "error" && (
                      <div className="mb-5 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                        <span className="material-symbols-outlined text-red-500 text-base shrink-0">error</span>
                        <p className="text-sm text-red-700 font-medium">{errorMsg}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="w-full flex items-center justify-center gap-3 bg-primary-container text-white py-4 rounded-xl font-headline font-bold text-[11px] uppercase tracking-[0.35em] shadow-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {status === "submitting" ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-base">send</span>
                          Send Message
                        </>
                      )}
                    </button>

                    <p className="mt-4 text-center text-[11px] text-on-surface-variant/40 font-medium">
                      Your information is never shared with third parties.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
