import MovieCard from './MovieCard'

export default function MovieRow({ title, movies }) {
  if (!movies?.length) return null

  return (
    <section className="px-6 mb-10">
      <h2 className="text-white text-xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  )
}
