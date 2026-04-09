export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 bg-neutral-700/20 rounded-lg animate-pulse" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="h-10 w-10 bg-neutral-200 rounded-xl animate-pulse mb-3" />
            <div className="h-6 w-12 bg-neutral-200 rounded animate-pulse mb-1" />
            <div className="h-3 w-20 bg-neutral-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
