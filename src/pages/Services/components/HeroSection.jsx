import Button from "../../../components/Form/Button";
import Card from "../../../components/Card";

export default function HeroSection() {
  return (
    <>
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 hero-gradient -z-10"></div>
        <div className="absolute inset-0 network-grid -z-10"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-tertiary-fixed-dim/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-[100px]"></div>
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-pulse"></span>
              <span className="text-xs font-bold text-white uppercase tracking-widest">Global Staffing Hub</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-headline font-extrabold text-white leading-[1.1] tracking-tighter">
              Empowering Enterprises with <span className="text-tertiary-fixed-dim">InTech Road IT Talent</span>
            </h1>
            <p className="text-xl text-white/70 max-w-xl font-light leading-relaxed">
              We provide pre-vetted technology professionals and end-to-end IT solutions for global businesses scaling at the speed of thought.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button className="bg-tertiary-fixed-dim text-primary px-8 py-4 rounded-lg font-headline font-bold text-sm uppercase tracking-widest hover:bg-white transition-colors">
                Build Your Team
              </Button>
              <Button className="border border-white/30 text-white px-8 py-4 rounded-lg font-headline font-bold text-sm uppercase tracking-widest backdrop-blur-md hover:bg-white/10 transition-colors">
                Our Solutions
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 relative hidden lg:block">
            <Card className="glass-card absolute -top-12 -left-8 p-6 rounded-xl w-64 z-20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-surface-container-high overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    alt="professional woman developer with glasses smiling confidently in a modern tech office setting"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC61zkM6_8aK-6bDcKkPPAo3iWTAOL-gW_iK8X79opT9YtKKNZIrFsKADePE9HIejIgY_9VbGXpbFFRQcmjJm_rp6t0jzk_u93DMP3CxNnhrW0lrc98LidgWtt4gYtk7bzVRuf5V6VnCHkMUDQisBLVL-1o0FwW6HEg_pQ2b7BU9lU8d71ihqYPbLSNZR0AKoYZF16yXkvVoydGa8HxgYALg9gPCAccjrC6NVv3gvE2wc80sjul5wbO6gJukt9JV-JD9NPlLP5-mkzD"
                  />
                </div>
                <div>
                  <div className="text-sm font-bold">Sarah Chen</div>
                  <div className="text-[10px] text-on-primary-container uppercase font-bold tracking-tighter">Senior SAP Consultant</div>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="px-2 py-1 rounded-sm bg-tertiary-fixed-dim/20 text-tertiary-fixed-dim text-[10px] font-bold">VETTED</span>
                <span className="px-2 py-1 rounded-sm bg-secondary/10 text-secondary text-[10px] font-bold">AVAILABLE</span>
              </div>
            </Card>

            <Card className="glass-card p-6 rounded-xl w-72 translate-x-12 translate-y-12 z-10">
              <div className="text-xs font-bold text-on-primary-container mb-4 uppercase tracking-widest">Live Activity</div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary text-lg">check_circle</span>
                  <div className="text-xs">DevOps Team Scaled +4</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary-fixed-dim text-lg">bolt</span>
                  <div className="text-xs">QA Sprint Started</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-on-primary-container text-lg">public</span>
                  <div className="text-xs">New Client: Fortune 500 Retail</div>
                </div>
              </div>
            </Card>

            <div className="absolute inset-0 -z-10 opacity-30">
              <svg className="w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M45.7,-78.2C58.9,-71.4,69.1,-58.5,76.5,-44.6C83.8,-30.7,88.4,-15.3,87.6,-0.5C86.7,14.4,80.4,28.7,72.4,41.4C64.4,54.1,54.7,65.1,42.5,73.1C30.4,81.1,15.2,86,0.3,85.5C-14.6,85.1,-29.2,79.2,-42.2,70.8C-55.2,62.4,-66.6,51.5,-75,38.6C-83.4,25.7,-88.9,10.9,-87.3,-3.1C-85.7,-17,-77.1,-30.1,-67,-41.2C-57,-52.3,-45.5,-61.4,-33.1,-68.8C-20.7,-76.3,-7.4,-82.1,7.2,-83.4C21.8,-84.6,32.5,-85.1,45.7,-78.2Z"
                  fill="#4cd7f6"
                  transform="translate(100 100)"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
