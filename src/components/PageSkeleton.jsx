export default function PageSkeleton({ rows = 5 }) {
  return (
    <div className="animate-pulse space-y-3 p-6">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="h-4 bg-surface-container rounded w-1/4" />
          <div className="h-4 bg-surface-container rounded w-1/3" />
          <div className="h-4 bg-surface-container rounded w-1/5" />
          <div className="h-4 bg-surface-container rounded w-1/6" />
        </div>
      ))}
    </div>
  );
}
