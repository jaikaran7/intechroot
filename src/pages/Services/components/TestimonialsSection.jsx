import Card from "../../../components/Card";

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2 grid grid-cols-2 gap-8 opacity-40 grayscale group">
            <div className="h-24 bg-surface-container-high rounded-xl flex items-center justify-center p-6 hover:grayscale-0 transition-all duration-500 hover:opacity-100">
              <span className="font-black text-primary/40 tracking-tighter text-xl">CLIENT_A</span>
            </div>
            <div className="h-24 bg-surface-container-high rounded-xl flex items-center justify-center p-6 hover:grayscale-0 transition-all duration-500 hover:opacity-100">
              <span className="font-black text-primary/40 tracking-tighter text-xl">CLIENT_B</span>
            </div>
            <div className="h-24 bg-surface-container-high rounded-xl flex items-center justify-center p-6 hover:grayscale-0 transition-all duration-500 hover:opacity-100">
              <span className="font-black text-primary/40 tracking-tighter text-xl">CLIENT_C</span>
            </div>
            <div className="h-24 bg-surface-container-high rounded-xl flex items-center justify-center p-6 hover:grayscale-0 transition-all duration-500 hover:opacity-100">
              <span className="font-black text-primary/40 tracking-tighter text-xl">CLIENT_D</span>
            </div>
          </div>
          <div className="lg:w-1/2">
            <Card className="glass-card p-12 rounded-2xl relative">
              <span className="material-symbols-outlined text-secondary text-5xl absolute -top-6 left-12 opacity-20">format_quote</span>
              <p className="text-xl font-body font-light italic leading-relaxed text-on-surface mb-8">
                "InTech Road transformed our cloud migration strategy. The senior engineers they provided didn't just code; they helped redefine our entire infrastructure architecture for the next decade."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-surface-container-high overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    alt="professional portrait of a CTO man in a clean studio lighting environment"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_LgOhCaTkCs8cq6TGtac_7S7U46X8VOsoLwinvvlmyc6jpcq3G2A53tDIWG_H2St8HM1rggKJ0UgJt4n8lFcgZagovO0HQhz0WxUqif2uzNb-ugpN10fexXWwEKAw-DUGDSNLtyAKILAUQcljlbsMhtd1_Uqk9yOplLwRomh1krvI1OLNyMGo55t5fSJtFNxh0e2sDuaVuagQzrBAnYql4iVQSubQP8oWN0d50moXZo8ztF-nrtFOC-B1XONXWdhs4f0bCocGw_no"
                  />
                </div>
                <div>
                  <div className="text-sm font-bold">Marcus Thorne</div>
                  <div className="text-xs text-on-primary-container">CTO, Global Finance Corp</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
