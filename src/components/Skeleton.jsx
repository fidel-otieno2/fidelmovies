export function MovieCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-800 rounded-lg aspect-[2/3] w-full" />
      <div className="mt-2 h-3 bg-gray-800 rounded w-3/4" />
      <div className="mt-1 h-3 bg-gray-800 rounded w-1/4" />
    </div>
  )
}

export function RowSkeleton({ count = 6 }) {
  return (
    <section className="px-6 mb-10">
      <div className="h-6 bg-gray-800 rounded w-40 mb-4 animate-pulse" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    </section>
  )
}
