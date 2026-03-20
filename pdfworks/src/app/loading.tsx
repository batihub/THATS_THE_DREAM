export default function HomeLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
      {/* Hero skeleton */}
      <div className="h-12 w-96 max-w-full rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
      <div className="h-6 w-72 max-w-full rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse" />
      <div className="flex gap-3 mt-2">
        <div className="h-10 w-32 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
        <div className="h-10 w-32 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
      </div>
      {/* Cards row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-3xl mt-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
        ))}
      </div>
    </div>
  )
}
