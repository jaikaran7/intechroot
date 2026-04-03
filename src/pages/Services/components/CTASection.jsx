import Button from "../../../components/Form/Button";

export default function CTASection() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-8">
        <div className="bg-primary-container rounded-3xl p-16 text-center relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-secondary/30 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-tertiary-fixed-dim/30 rounded-full blur-[100px]"></div>
          <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-white tracking-tighter mb-8 relative">Ready to Build Your Team Today?</h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center relative">
            <Button className="bg-tertiary-fixed-dim text-primary px-10 py-5 rounded-lg font-headline font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform">Get a Free Quote</Button>
            <Button className="border border-white/20 text-white px-10 py-5 rounded-lg font-headline font-bold text-sm uppercase tracking-widest backdrop-blur-md hover:bg-white/10 transition-colors">Talk to an Expert</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
