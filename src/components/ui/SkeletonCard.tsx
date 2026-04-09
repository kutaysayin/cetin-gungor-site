/* Skeleton loader — icerik yuklenirken placeholder kart */
export default function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-2xl bg-neutral-100 ${className}`}>
      <div className="aspect-video bg-neutral-200 rounded-t-2xl" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-neutral-200 rounded-full w-20" />
        <div className="h-5 bg-neutral-200 rounded-full w-3/4" />
        <div className="h-4 bg-neutral-200 rounded-full w-full" />
        <div className="h-4 bg-neutral-200 rounded-full w-2/3" />
      </div>
    </div>
  );
}
