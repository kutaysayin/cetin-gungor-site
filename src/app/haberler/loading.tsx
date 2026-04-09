export default function HaberlerLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="h-8 w-48 bg-neutral-200 rounded-lg animate-pulse mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="h-48 bg-neutral-200 animate-pulse" />
            <div className="p-5 space-y-3">
              <div className="h-4 w-20 bg-neutral-200 rounded animate-pulse" />
              <div className="h-5 w-full bg-neutral-200 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-neutral-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
