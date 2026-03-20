export default function AboutLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-6">
      <div className="h-10 w-64 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-4 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" style={{ width: `${85 + (i % 3) * 5}%` }} />
        ))}
      </div>
      <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
    </div>
  )
}
