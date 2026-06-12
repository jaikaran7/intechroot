import { Link } from "react-router-dom";
import { CONSULTATION_MAILTO } from "../../../constants/companyContact";

export default function FinalCTASection() {
  return (
    <section className="py-60 bg-white relative">
      <div className="max-w-7xl mx-auto px-8">
        <div className="relative rounded-[5rem] overflow-hidden bg-primary-container p-32 text-center shadow-[0_100px_150px_rgba(0,6,21,0.4)]">
          {/* Background layers */}
          <div className="absolute inset-0 mesh-gradient opacity-40" />
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-secondary/40 via-transparent to-transparent" />
          <div className="absolute inset-0 network-grid-intricate opacity-15" />

          {/* Decorative floaters */}
          <div className="absolute top-10 left-10 w-40 h-40 bg-white/5 backdrop-blur-3xl rounded-full floating-element" />
          <div
            className="absolute bottom-10 right-10 w-60 h-60 bg-tertiary-fixed-dim/5 backdrop-blur-3xl rounded-full floating-element"
            style={{ animationDelay: "-3s" }}
          />
          <div
            className="absolute top-1/2 left-[8%] w-24 h-24 bg-secondary/10 backdrop-blur-2xl rounded-3xl floating-element"
            style={{ animationDelay: "-6s", animationDuration: "18s" }}
          />

          <div className="relative z-10">
            <div className="inline-block px-6 py-3 rounded-full border border-white/10 mb-12 backdrop-blur-2xl">
              <span className="text-[11px] font-black text-tertiary-fixed-dim uppercase tracking-[0.5em]">
                Start Your Transformation
              </span>
            </div>

            <h2 className="text-7xl md:text-9xl font-headline font-extrabold text-white tracking-tighter mb-10 leading-[0.9]">
              Ready to Build
              <br />
              What&apos;s Next?
            </h2>

            <p className="text-2xl text-white/40 font-light max-w-2xl mx-auto mb-20 leading-relaxed">
              Partner with InTechRoot and unlock your organization's full technology potential.
              From strategy to deployment, we engineer the outcomes that move businesses forward.
            </p>

            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center bg-white text-primary px-16 py-8 rounded-2xl font-headline font-black text-sm uppercase tracking-[0.4em] hover:scale-110 transition-transform shadow-[0_40px_80px_rgba(255,255,255,0.2)] glint-effect"
              >
                Contact Us
              </Link>
              <a
                href={CONSULTATION_MAILTO}
                className="inline-flex items-center gap-6 text-white font-headline font-black text-sm uppercase tracking-[0.4em] hover:gap-10 transition-all group"
              >
                Schedule Consultation
                <span className="material-symbols-outlined text-tertiary-fixed-dim group-hover:translate-x-3 transition-transform text-3xl">
                  east
                </span>
              </a>
            </div>

            {/* Trust micro-copy */}
            <div className="mt-20 flex flex-wrap justify-center gap-10">
              {[
                ["97%", "Client Retention"],
                ["250+", "Projects Delivered"],
                ["24/7", "Support Available"],
              ].map(([val, label]) => (
                <div key={label} className="text-center">
                  <div className="text-3xl font-headline font-black text-tertiary-fixed-dim">{val}</div>
                  <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
