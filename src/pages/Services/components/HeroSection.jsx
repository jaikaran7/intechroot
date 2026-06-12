import Button from "../../../components/Form/Button";
import Card from "../../../components/Card";
import FeaturedRoleSpotlightCard from "../../../components/FeaturedRoleSpotlightCard";

export default function HeroSection() {
  return (
    <>
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20 md:pt-24 lg:pt-20">
        <div className="absolute inset-0 hero-gradient -z-10"></div>
        <div className="absolute inset-0 network-grid -z-10"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-tertiary-fixed-dim/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-[100px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-5 md:space-y-8">
            <div data-sr="up" className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-pulse"></span>
              <span className="text-xs font-bold text-white uppercase tracking-widest">Global Staffing Hub</span>
            </div>

            <h1
              data-sr="up" data-delay="100"
              className="text-[2.25rem] sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-headline font-extrabold text-white leading-[1.1] tracking-tighter"
            >
              Empowering Enterprises with{" "}
              <span className="text-tertiary-fixed-dim">InTechRoot IT Talent</span>
            </h1>

            <p
              data-sr="up" data-delay="200"
              className="text-sm sm:text-base md:text-lg text-white/70 max-w-xl font-light leading-relaxed"
            >
              We provide pre-vetted technology professionals and end-to-end IT solutions for global businesses scaling at the speed of thought.
            </p>

            <div data-sr="up" data-delay="300" className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 pt-2 lg:pt-4">
              <Button className="bg-tertiary-fixed-dim text-primary px-7 md:px-8 py-3.5 md:py-4 rounded-xl font-headline font-bold text-sm uppercase tracking-widest hover:bg-white transition-colors shadow-[0_20px_40px_rgba(76,215,246,0.25)]">
                Build Your Team
              </Button>
              <Button className="border border-white/30 text-white px-7 md:px-8 py-3.5 md:py-4 rounded-xl font-headline font-bold text-sm uppercase tracking-widest backdrop-blur-md hover:bg-white/10 transition-colors">
                Our Solutions
              </Button>
            </div>
          </div>

          {/* Right panel — desktop only */}
          <div className="lg:col-span-5 relative hidden lg:block" data-sr="right" data-delay="150">
            <FeaturedRoleSpotlightCard variant="services" />
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
                  <div className="text-xs">New Client: TCS</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
