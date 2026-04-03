export default function SummaryCard({ data }) {
  return (
    <div className="md:col-span-4 glass-card p-10 rounded-xl overflow-hidden relative">
      <div className="relative z-10">
        <h4 className="font-headline font-bold text-2xl mb-8">Submission Summary</h4>
        <ul className="space-y-4">
          <li className="flex items-center justify-between text-sm py-2 border-b border-outline-variant/10">
            <span className="text-on-surface-variant">Full Name</span>
            <span className="font-bold text-primary">{data.name}</span>
          </li>
          <li className="flex items-center justify-between text-sm py-2 border-b border-outline-variant/10">
            <span className="text-on-surface-variant">Email</span>
            <span className="font-bold text-primary">{data.email}</span>
          </li>
          <li className="flex items-center justify-between text-sm py-2 border-b border-outline-variant/10">
            <span className="text-on-surface-variant">Discipline</span>
            <span className="font-bold text-primary">{data.discipline}</span>
          </li>
          <li className="flex items-center justify-between text-sm py-2">
            <span className="text-on-surface-variant">Experience</span>
            <span className="font-bold text-primary">{data.experience}</span>
          </li>
        </ul>
      </div>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl"></div>
    </div>
  );
}
