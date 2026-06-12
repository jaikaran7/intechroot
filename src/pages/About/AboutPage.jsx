import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CONSULTATION_MAILTO } from "../../constants/companyContact";
import SiteFooter from "../../components/SiteFooter";
import "../Home/home.css";
import "./about.css";

/* ── Scroll-reveal hook ─────────────────────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("sr-visible");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll("[data-sr]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ── Data ───────────────────────────────────────────────────────────── */
const stats = [
  { val: "250+", label: "Projects Delivered", icon: "rocket_launch" },
  { val: "20+",  label: "Industries Served",  icon: "category"      },
  { val: "97%",  label: "Client Retention",   icon: "verified"      },
  { val: "100+", label: "Professionals",      icon: "groups"        },
];

const services = [
  { icon: "database",   label: "ERP Solutions",       sub: "SAP · Oracle · Microsoft", featured: true,
    desc: "Full-lifecycle ERP implementations, S/4HANA migrations, and managed services engineered for large-scale enterprise environments." },
  { icon: "cloud",      label: "Cloud Services",       sub: "AWS · Azure · GCP"         },
  { icon: "code",       label: "Software Development", sub: "Custom · API · Enterprise" },
  { icon: "insights",   label: "Data & Analytics",     sub: "BI · Pipelines · ML"       },
  { icon: "smart_toy",  label: "AI & Automation",      sub: "RPA · ML · Agents"         },
  { icon: "hub",        label: "IT Consulting",        sub: "Strategy · Roadmap"        },
];

const values = [
  { icon: "gavel",        title: "Integrity",    desc: "Transparent communication and accountability at every stage of delivery." },
  { icon: "diamond",      title: "Excellence",   desc: "Every solution is held to the highest technical and professional standard." },
  { icon: "group",        title: "Partnership",  desc: "We build long-term relationships grounded in consistent, excellent outcomes." },
  { icon: "trending_up",  title: "Innovation",   desc: "Continuous investment in emerging technology keeps clients ahead of the curve." },
];

/* ── Page ───────────────────────────────────────────────────────────── */
export default function AboutPage() {
  useScrollReveal();

  useEffect(() => {
    document.title = "About Us | InTechRoot";
    document.body.className =
      "bg-background font-body text-on-surface selection:bg-tertiary-fixed-dim selection:text-on-tertiary-fixed overflow-x-hidden";

    const onScroll = () => {
      const nav = document.querySelector("nav");
      if (!nav) return;
      const abs = nav.querySelector(".absolute");
      const inner = nav.querySelector(".max-w-7xl");
      if (!abs || !inner) return;
      if (window.pageYOffset > 50) {
        abs.classList.add("bg-white/80");
        inner.classList.replace("py-6", "py-4");
      } else {
        abs.classList.remove("bg-white/80");
        inner.classList.replace("py-4", "py-6");
      }
    };
    document.addEventListener("scroll", onScroll);
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ════════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════════ */}
      <section className="relative flex items-center min-h-[92vh] pt-24 md:pt-32 lg:pt-36 pb-16 md:pb-24 lg:pb-28 overflow-hidden hero-gradient">
        <div className="mesh-gradient -z-[5]" />
        <div className="absolute inset-0 network-grid-intricate opacity-20 -z-[4]" />
        <div className="absolute top-[15%] left-[5%] w-72 h-72 bg-secondary/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 lg:gap-16 items-center">
          {/* Left */}
          <div>
            <div
              data-sr="up"
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-6 md:mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-pulse" />
              <span className="text-[10px] font-black text-white/70 uppercase tracking-[0.4em]">
                About InTechRoot
              </span>
            </div>

            <h1
              data-sr="up" data-delay="100"
              className="text-[2rem] sm:text-[2.75rem] md:text-5xl lg:text-5xl xl:text-[3.75rem] font-headline font-extrabold text-white leading-[1.05] tracking-tight mb-5 md:mb-6"
            >
              Technology Partner
              <br />
              for{" "}
              <span className="bg-gradient-to-r from-tertiary-fixed-dim to-white bg-clip-text text-transparent">
                Enterprise Growth.
              </span>
            </h1>

            <p
              data-sr="up" data-delay="200"
              className="text-sm md:text-base text-white/50 max-w-lg font-light leading-relaxed mb-8 md:mb-10"
            >
              Founded in 2021, InTechRoot is a technology consulting firm delivering
              ERP, cloud, AI, and software development services to enterprise clients
              across North America.
            </p>

            <div data-sr="up" data-delay="300" className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Link
                to="/contact"
                className="group relative inline-flex items-center justify-center px-7 md:px-8 py-3.5 overflow-hidden rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:shadow-tertiary-fixed-dim/20 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-tertiary-fixed-dim group-hover:scale-105 transition-transform duration-300" />
                <span className="relative font-headline font-black text-[10px] uppercase tracking-[0.35em] text-primary">
                  Contact Us
                </span>
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 px-7 md:px-8 py-3.5 rounded-xl border border-white/20 text-white font-headline font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white/10 hover:border-white/40 transition-all duration-300"
              >
                Our Services
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Right — metric card */}
          <div className="relative flex items-center justify-center lg:justify-end" data-sr="right" data-delay="200">
            <div className="relative w-full max-w-sm">
              <div className="glass-card-dark rounded-[1.75rem] md:rounded-[2rem] p-6 md:p-8 border-white/10 shadow-2xl">
                <div className="flex items-center justify-between mb-6 md:mb-8">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-tertiary-fixed-dim/20 rounded-xl flex items-center justify-center border border-tertiary-fixed-dim/30">
                    <span className="material-symbols-outlined text-tertiary-fixed-dim text-xl md:text-2xl">corporate_fare</span>
                  </div>
                  <span className="text-[9px] font-black text-tertiary-fixed-dim uppercase tracking-widest bg-tertiary-fixed-dim/10 px-3 py-1.5 rounded-full border border-tertiary-fixed-dim/20">
                    Est. 2021
                  </span>
                </div>
                <div className="text-white font-headline font-bold text-xl md:text-2xl mb-1.5 md:mb-2">InTechRoot</div>
                <div className="text-white/40 text-sm leading-relaxed mb-6 md:mb-8">
                  Enterprise technology &amp; consulting, North America.
                </div>
                <div className="grid grid-cols-3 gap-3 md:gap-4 pt-5 md:pt-6 border-t border-white/10">
                  {[["250+","Projects"],["97%","Retention"],["100+","Experts"]].map(([v,l]) => (
                    <div key={l} className="text-center">
                      <div className="text-base md:text-lg font-headline font-black text-tertiary-fixed-dim">{v}</div>
                      <div className="text-[9px] text-white/30 uppercase tracking-wider font-black">{l}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badge */}
              <div
                className="absolute -bottom-5 -right-4 md:-bottom-6 md:-right-6 glass-card rounded-xl md:rounded-2xl p-3.5 md:p-5 shadow-2xl border-white/50 floating-element"
                style={{ animationDuration: "6s" }}
              >
                <div className="flex items-center gap-2.5 md:gap-3">
                  <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.7)] animate-pulse" />
                  <div>
                    <div className="text-[11px] md:text-xs font-headline font-bold text-primary">24/7 Support</div>
                    <div className="text-[8px] md:text-[9px] text-on-primary-container/50 font-black uppercase tracking-wide">Always Available</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          WHO WE ARE + STATS
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-22 lg:py-28 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          {/* Copy row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start mb-10 md:mb-14 lg:mb-16">
            <div data-sr="left">
              <div className="text-secondary font-black text-[11px] uppercase tracking-[0.5em] mb-3 md:mb-4">
                Who We Are
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-headline font-extrabold text-primary tracking-tight leading-tight">
                Built for Enterprise
                <br />
                <span className="text-secondary">Complexity</span>
              </h2>
            </div>
            <div data-sr="right" data-delay="100" className="pt-0 md:pt-1">
              <p className="text-sm md:text-base text-on-primary-container/70 font-light leading-relaxed mb-3 md:mb-4">
                InTechRoot is a technology consulting partner — not a conventional
                software vendor. We work alongside enterprise teams to design, build,
                and deliver solutions that solve real business problems at scale.
              </p>
              <p className="text-sm md:text-base text-on-primary-container/70 font-light leading-relaxed">
                Our certified professionals bring deep expertise across ERP, cloud,
                data, and custom development — with a track record that speaks through
                outcomes, not promises.
              </p>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {stats.map(({ val, label, icon }, i) => (
              <div
                key={label}
                data-sr="up"
                data-delay={String(i * 100)}
                className="stat-card bg-white border border-outline-variant/15 rounded-2xl md:rounded-3xl p-5 md:p-8 group hover:bg-surface-container-low transition-all duration-500 cursor-default"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-secondary/8 flex items-center justify-center mb-3 md:mb-5 group-hover:bg-secondary/15 transition-colors">
                  <span className="material-symbols-outlined text-lg md:text-xl text-secondary">{icon}</span>
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-headline font-black text-primary tracking-tight mb-1 group-hover:text-secondary transition-colors">
                  {val}
                </div>
                <div className="text-[9px] md:text-[10px] font-black text-on-primary-container/40 uppercase tracking-[0.3em] md:tracking-[0.35em]">
                  {label}
                </div>
                <div className="mt-3 md:mt-5 h-0.5 w-6 md:w-8 values-accent rounded-full group-hover:w-full transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          WHAT WE DO
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-22 lg:py-28 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 network-grid-intricate opacity-10" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute top-[20%] right-[5%] w-[30vw] h-[30vw] bg-secondary/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5 md:gap-8 mb-10 md:mb-14">
            <div data-sr="left">
              <div className="text-tertiary-fixed-dim font-black text-[11px] uppercase tracking-[0.5em] mb-3 md:mb-4">
                What We Do
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-headline font-extrabold tracking-tight leading-tight">
                Core Service Areas
              </h2>
            </div>
            <Link
              data-sr="right"
              to="/services"
              className="group inline-flex items-center gap-2 text-white/50 font-black text-[11px] uppercase tracking-[0.3em] hover:text-tertiary-fixed-dim transition-colors"
            >
              View All Services
              <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>

          {/* Featured card + grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Featured ERP card */}
            <div
              data-sr="up"
              className="lg:col-span-5 sap-enterprise-card rounded-[1.75rem] md:rounded-[2rem] p-7 md:p-10 relative group overflow-hidden border border-white/10 service-card"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-tertiary-fixed-dim/10 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-1000" />
              <div className="relative">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/10 flex items-center justify-center mb-6 md:mb-8 border border-white/15 group-hover:rotate-6 transition-transform">
                  <span className="material-symbols-outlined text-2xl md:text-3xl text-tertiary-fixed-dim">database</span>
                </div>
                <div className="text-[10px] font-black text-tertiary-fixed-dim uppercase tracking-[0.4em] mb-2">
                  Core Domain
                </div>
                <h3 className="text-xl md:text-2xl font-headline font-bold mb-3">ERP Solutions</h3>
                <p className="text-sm text-white/45 leading-relaxed mb-6 md:mb-8">
                  Full-lifecycle ERP implementations, S/4HANA migrations, and managed services
                  engineered for large-scale enterprise environments.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["SAP","Oracle","S/4HANA","ABAP"].map(t => (
                    <span key={t} className="px-3 py-1 bg-tertiary-fixed-dim/10 border border-tertiary-fixed-dim/20 rounded-full text-[9px] font-black text-tertiary-fixed-dim uppercase tracking-wider">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 5 smaller cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {services.slice(1).map(({ icon, label, sub }, i) => (
                <div
                  key={label}
                  data-sr="up"
                  data-delay={String((i + 1) * 100)}
                  className="glass-card-dark rounded-xl md:rounded-2xl p-5 md:p-7 border-white/10 group hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-400 service-card"
                >
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-white/8 flex items-center justify-center mb-4 md:mb-5 border border-white/10 group-hover:bg-tertiary-fixed-dim transition-colors duration-300">
                    <span className="material-symbols-outlined text-lg md:text-xl text-tertiary-fixed-dim group-hover:text-primary transition-colors">{icon}</span>
                  </div>
                  <div className="text-sm md:text-base font-headline font-bold text-white mb-1">{label}</div>
                  <div className="text-[10px] font-black text-white/35 uppercase tracking-wider">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          VALUES + CTA
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-22 lg:py-28 bg-surface-container-low overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          {/* Header */}
          <div className="text-center mb-10 md:mb-14" data-sr="up">
            <div className="text-secondary font-black text-[11px] uppercase tracking-[0.5em] mb-3 md:mb-4">
              How We Work
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-headline font-extrabold text-primary tracking-tight">
              The Principles Behind Every Engagement
            </h2>
          </div>

          {/* Values cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-10 md:mb-16">
            {values.map(({ icon, title, desc }, i) => (
              <div
                key={title}
                data-sr="up"
                data-delay={String(i * 100)}
                className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 group hover:-translate-y-1 md:hover:-translate-y-2 hover:shadow-xl transition-all duration-500 border border-outline-variant/10 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-0.5 values-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-secondary/6 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-secondary/15 transition-colors group-hover:rotate-3 duration-300">
                  <span className="material-symbols-outlined text-xl md:text-2xl text-secondary">{icon}</span>
                </div>
                <h3 className="text-base md:text-lg font-headline font-bold text-primary mb-2">{title}</h3>
                <p className="text-sm text-on-primary-container/60 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* CTA Block */}
          <div
            data-sr="scale"
            className="relative rounded-[1.75rem] md:rounded-[2.5rem] overflow-hidden bg-primary-container p-8 sm:p-12 md:p-14 lg:p-16 shadow-[0_40px_60px_rgba(0,6,21,0.2)] md:shadow-[0_60px_100px_rgba(0,6,21,0.25)]"
          >
            <div className="absolute inset-0 mesh-gradient opacity-40" />
            <div className="absolute inset-0 network-grid-intricate opacity-10" />
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-tertiary-fixed-dim/5 rounded-full blur-[60px]" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-10">
              <div className="text-center md:text-left">
                <div className="text-tertiary-fixed-dim font-black text-[10px] uppercase tracking-[0.5em] mb-2 md:mb-3">
                  Start the Conversation
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-headline font-extrabold text-white tracking-tight leading-tight mb-2 md:mb-3">
                  Ready to Transform
                  <br />
                  Your Business?
                </h3>
                <p className="text-white/40 text-sm font-light max-w-sm">
                  Partner with InTechRoot to unlock your organization's full technology potential.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 shrink-0 w-full sm:w-auto">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center bg-white text-primary px-7 md:px-9 py-3.5 md:py-4 rounded-xl font-headline font-black text-[10px] uppercase tracking-[0.35em] hover:scale-105 transition-transform shadow-[0_20px_40px_rgba(255,255,255,0.15)] glint-effect whitespace-nowrap"
                >
                  Contact Us
                </Link>
                <a
                  href={CONSULTATION_MAILTO}
                  className="inline-flex items-center justify-center gap-2.5 md:gap-3 border border-white/20 text-white px-7 md:px-9 py-3.5 md:py-4 rounded-xl font-headline font-black text-[10px] uppercase tracking-[0.35em] hover:bg-white/10 hover:border-white/40 transition-all whitespace-nowrap"
                >
                  Schedule Consultation
                  <span className="material-symbols-outlined text-sm text-tertiary-fixed-dim">east</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
