export default function SuccessHero({ fullName }) {
  return (
    <header className="mb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <span className="inline-block py-1 px-3 bg-secondary-container/20 text-on-secondary-container text-[10px] font-bold uppercase tracking-[0.2em] mb-4 rounded">
            Application Confirmed
          </span>
          <h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tighter text-primary leading-[0.95] mb-6">
            Success. <br />
            <span className="text-secondary">You are in.</span>
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed max-w-lg">
            Welcome, {fullName}. Your profile has been received by InTechRoot and routed to the final matching queue.
          </p>
        </div>
        <div className="flex flex-col items-end text-right">
          <p className="text-sm font-medium text-on-surface-variant uppercase tracking-widest mb-1">Current Status</p>
          <p className="text-3xl font-headline font-bold text-secondary">Completed</p>
          <div className="flex gap-2 mt-4">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
          </div>
        </div>
      </div>
    </header>
  );
}
