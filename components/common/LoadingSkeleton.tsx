export function LoadingSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="animate-pulse space-y-3" aria-label="Loading content">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="flex gap-3 p-3 rounded-xl border border-gray-100"
        >
          {/* Date column */}
          <div className="flex flex-col items-center gap-0.5 w-10 shrink-0">
            <div className="h-3 w-6 bg-gray-200 rounded" />
            <div className="h-4 w-7 bg-gray-200 rounded" />
          </div>
          {/* Icon */}
          <div className="w-4 h-4 mt-0.5 bg-gray-200 rounded shrink-0" />
          {/* Content */}
          <div className="flex-1 space-y-2">
            <div className="h-3.5 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-1/3" />
            <div className="flex gap-1.5">
              <div className="h-4 w-14 bg-gray-100 rounded-full" />
              <div className="h-4 w-12 bg-gray-100 rounded-full" />
            </div>
          </div>
          {/* Thumbnail */}
          <div className="w-16 h-12 bg-gray-200 rounded-lg shrink-0" />
        </div>
      ))}
    </div>
  );
}
