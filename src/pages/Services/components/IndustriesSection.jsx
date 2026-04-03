export default function IndustriesSection() {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-12 border border-white/10">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/3">
          <h4 className="text-2xl font-headline font-bold mb-4">Industries of Focus</h4>
          <p className="text-white/60 text-sm">Specialized domain knowledge across high-stakes industrial sectors.</p>
        </div>
        <div className="lg:w-2/3 flex flex-wrap gap-4">
          <div className="px-6 py-3 rounded-full border border-white/20 hover:border-tertiary-fixed-dim transition-colors cursor-default">Finance</div>
          <div className="px-6 py-3 rounded-full border border-white/20 hover:border-tertiary-fixed-dim transition-colors cursor-default">Healthcare</div>
          <div className="px-6 py-3 rounded-full border border-white/20 hover:border-tertiary-fixed-dim transition-colors cursor-default">Retail</div>
          <div className="px-6 py-3 rounded-full border border-white/20 hover:border-tertiary-fixed-dim transition-colors cursor-default">Manufacturing</div>
          <div className="px-6 py-3 rounded-full border border-white/20 hover:border-tertiary-fixed-dim transition-colors cursor-default">Technology</div>
        </div>
      </div>
    </div>
  );
}
