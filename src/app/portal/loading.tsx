export default function PortalLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-56 bg-neutral-200 rounded-lg animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="h-4 w-24 bg-neutral-200 rounded animate-pulse mb-3" />
            <div className="h-8 w-16 bg-neutral-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
