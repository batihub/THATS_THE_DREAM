export default function ToolsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      {/* Category tabs skeleton */}
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-9 w-24 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse shrink-0" />
        ))}
      </div>
      {/* Tool grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
        ))}
      </div>
    </div>
  )
}
