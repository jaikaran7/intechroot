import Button from "../../../components/Form/Button";

export default function BlueprintSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute right-0 top-0 w-1/3 h-full bg-surface-container-low -z-10 skew-x-[-12deg] translate-x-20"></div>
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4">
            <h2 className="text-4xl font-headline font-extrabold text-primary tracking-tighter mb-6">Our Blueprint for Success</h2>
            <p className="text-on-primary-container mb-8">A streamlined methodology focused on precision hiring and rapid technical execution.</p>
            <Button className="bg-primary text-white px-8 py-4 rounded-lg font-headline font-bold text-sm uppercase tracking-widest shadow-xl">Get Started</Button>
          </div>
          <div className="lg:col-span-8 space-y-12">
            <div className="flex gap-8 group">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-secondary text-white flex items-center justify-center font-headline font-black text-xl shadow-lg shadow-secondary/20">1</div>
                <div className="w-[2px] h-full bg-outline-variant/30 my-2"></div>
              </div>
              <div className="pb-12">
                <h4 className="text-2xl font-headline font-bold mb-3">Discover &amp; Define</h4>
                <p className="text-on-primary-container max-w-xl">We analyze your project goals, technical requirements, and cultural fit to create a bespoke talent roadmap.</p>
              </div>
            </div>
            <div className="flex gap-8 group">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-tertiary-fixed-dim text-primary flex items-center justify-center font-headline font-black text-xl shadow-lg shadow-tertiary-fixed-dim/20">2</div>
                <div className="w-[2px] h-full bg-outline-variant/30 my-2"></div>
              </div>
              <div className="pb-12">
                <h4 className="text-2xl font-headline font-bold mb-3">Deploy Talent / Build Solution</h4>
                <p className="text-on-primary-container max-w-xl">Our engineers integrate with your existing teams or start building your greenfield solution immediately.</p>
              </div>
            </div>
            <div className="flex gap-8 group">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-primary-container text-white flex items-center justify-center font-headline font-black text-xl">3</div>
              </div>
              <div>
                <h4 className="text-2xl font-headline font-bold mb-3">Deliver &amp; Scale</h4>
                <p className="text-on-primary-container max-w-xl">Continuous optimization and scaling resources based on real-time project velocity and milestones.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
