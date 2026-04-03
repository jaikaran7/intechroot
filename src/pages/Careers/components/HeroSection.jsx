import Button from "../../../components/Form/Button";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex items-center pt-32 pb-24 overflow-hidden hero-gradient">
      <div className="mesh-gradient opacity-60"></div>
      <div className="absolute inset-0 network-grid opacity-20"></div>
      <div className="absolute top-1/4 right-[10%] w-64 h-64 bg-tertiary-fixed/10 rounded-full blur-[100px] floating-element" style={{ animationDelay: "-2s" }}></div>
      <div className="absolute bottom-1/4 left-[5%] w-48 h-48 bg-secondary/10 rounded-full blur-[80px] floating-element" style={{ animationDelay: "-4s" }}></div>
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
          <div className="lg:col-span-7 space-y-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-fixed opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-tertiary-fixed"></span>
              </span>
              <span className="text-[10px] font-bold text-white uppercase tracking-[0.3em]">Future-Proof Your Ambition</span>
            </div>
            <h1 className="text-7xl md:text-8xl font-headline font-extrabold text-white leading-[0.95] tracking-tighter monolith-text">
              Build Your Career with <br />
              <span className="bg-gradient-to-r from-white via-tertiary-fixed to-secondary bg-clip-text text-transparent">Global Legends.</span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl font-light leading-relaxed">
              Join an elite network of architectural intelligence and high-level strategy. We connect world-class IT talent with the most ambitious digital transformations on the planet.
            </p>
            <div className="flex flex-wrap gap-6 pt-6">
              <Button
                className="group relative px-10 py-5 overflow-hidden rounded-full transition-all duration-500 shadow-2xl"
                onClick={() => document.querySelector("section.max-w-7xl.mx-auto.px-8.py-32")?.scrollIntoView({ behavior: "smooth" })}
              >
                <div className="absolute inset-0 bg-tertiary-fixed transition-transform group-hover:scale-110"></div>
                <span className="relative font-headline font-bold text-[11px] uppercase tracking-[0.25em] text-primary">View Open Roles</span>
              </Button>
              <Button
                className="px-10 py-5 rounded-full border border-white/20 text-white font-headline font-bold text-[11px] uppercase tracking-[0.25em] backdrop-blur-md hover:bg-white/5 transition-all"
                onClick={() => navigate("/apply")}
              >
                Submit Resume
              </Button>
            </div>
          </div>
          <div className="lg:col-span-5 relative hidden lg:block">
            <div className="relative z-20 w-full aspect-[4/5] glass-card rounded-[2.5rem] overflow-hidden border-white/10 p-2">
              <img
                alt="Collaboration in modern office"
                className="w-full h-full object-cover rounded-[2rem] grayscale contrast-125 opacity-80"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5ksx9Z0zxWsf23TQD58QilTvyqRUNjPcN4TBRx3V7xIfm13SJf4CKmAoJdlKmjoxuVGbCV6aX8m7xiA1B5glb5juiB8rLhjfKr79itwOOYWILCn376WW3tiP_VQb9NuJ1nVIf3Q8FMc-WGOL8HjvE5Oa21u3q-pzDdqEIRiLxLRHFMGWZNZnNAf_qnRvWFwfCcrPkdQJBSR4fPyC84a6Ise1MxUeJzsVWKeOeLV0REeXvFl5NXqL8qR48tHuibv7APOZi-O01JosM"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#000615] via-transparent to-transparent opacity-60"></div>
            </div>
            <div className="absolute -bottom-10 -right-10 z-30 floating-element">
              <div className="glass-card p-6 rounded-3xl w-64 border-white/30 text-primary">
                <div className="text-[10px] font-black text-secondary uppercase tracking-widest mb-4">Network Status</div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <div className="text-[11px] font-semibold">Active Placements: 482</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <div className="text-[11px] font-semibold">High Priority: 12</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
