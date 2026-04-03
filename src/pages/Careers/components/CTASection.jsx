import Button from "../../../components/Form/Button";
import { useNavigate } from "react-router-dom";

export default function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto px-8 py-40">
      <div className="relative p-1 md:p-1 rounded-[4rem] overflow-hidden bg-primary-container group">
        <div className="absolute inset-0 mesh-gradient opacity-40 group-hover:opacity-60 transition-opacity duration-1000"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/40 to-transparent"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center p-16 md:p-24">
          <div className="space-y-10">
            <div className="inline-block px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
              <span className="text-[10px] font-black text-tertiary-fixed uppercase tracking-[0.4em]">Strategic Reserve</span>
            </div>
            <h2 className="text-6xl font-headline font-extrabold text-white tracking-tighter leading-tight monolith-text">Can't find the perfect role today?</h2>
            <p className="text-xl text-white/60 leading-relaxed font-light">
              Join our Elite Talent Pool. Our architectural intelligence matches candidates with stealth-mode startups and enterprise giants before roles are even public.
            </p>
            <ul className="space-y-6">
              <li className="flex items-center gap-4 text-white font-medium">
                <span className="material-symbols-outlined text-tertiary-fixed text-2xl">verified</span>
                Priority access to unlisted global roles
              </li>
              <li className="flex items-center gap-4 text-white font-medium">
                <span className="material-symbols-outlined text-tertiary-fixed text-2xl">verified</span>
                Executive compensation strategy advice
              </li>
              <li className="flex items-center gap-4 text-white font-medium">
                <span className="material-symbols-outlined text-tertiary-fixed text-2xl">verified</span>
                Global relocation and visa assistance
              </li>
            </ul>
          </div>
          <div className="glass-card p-2 rounded-[2.5rem] border-white/10 backdrop-blur-3xl">
            <div className="bg-white/5 p-12 rounded-[2.25rem] flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-tertiary-fixed/10 rounded-full flex items-center justify-center mb-10 border border-white/10">
                <span className="material-symbols-outlined text-5xl text-tertiary-fixed">cloud_upload</span>
              </div>
              <h4 className="text-white font-extrabold text-2xl mb-4">Drop your resume here</h4>
              <p className="text-white/40 text-sm mb-12 font-medium">PDF, DOCX up to 10MB</p>
              <div
                className="w-full border-2 border-dashed border-white/20 rounded-[2rem] p-16 hover:border-tertiary-fixed/50 hover:bg-white/5 transition-all cursor-pointer group/upload"
                onClick={() => navigate("/apply")}
              >
                <span className="text-white/40 text-sm font-black uppercase tracking-widest group-hover/upload:text-white transition-colors">Click to browse or drag &amp; drop</span>
              </div>
              <Button
                className="mt-12 w-full py-6 bg-tertiary-fixed text-primary font-black uppercase tracking-[0.3em] text-[10px] rounded-full hover:bg-white transition-all duration-500 shadow-2xl"
                onClick={() => navigate("/apply")}
              >
                Submit to Talent Pool
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
