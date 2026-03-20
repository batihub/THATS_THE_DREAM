export default function ToolLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      {/* Breadcrumb */}
      <div className="h-4 w-48 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
      {/* Title + description */}
      <div className="space-y-3">
        <div className="h-9 w-72 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
        <div className="h-5 w-96 max-w-full rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
      </div>
      {/* Drop zone skeleton */}
      <div className="h-56 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 animate-pulse" />
      {/* Options */}
      <div className="flex gap-3">
        <div className="h-10 w-36 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
        <div className="h-10 w-36 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
      </div>
    </div>
  )
}
