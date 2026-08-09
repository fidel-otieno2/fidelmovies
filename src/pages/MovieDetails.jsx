import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getMovieDetails, posterUrl, BACKDROP_SIZE, POSTER_SIZE } from '../services/tmdb'
import MovieRow from '../components/MovieRow'

export default function MovieDetails() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    getMovieDetails(id)
      .then((res) => setMovie(res.data))
      .catch(() => setError('Could not load movie details.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="h-screen bg-gray-900 animate-pulse" />
  if (error) return <div className="flex items-center justify-center h-screen text-gray-400">{error}</div>
  if (!movie) return null

  const trailer = movie.videos?.results?.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  )
  const cast = movie.credits?.cast?.slice(0, 10) || []
  const similar = movie.similar?.results?.slice(0, 12) || []

  return (
    <div>
      {/* Backdrop */}
      <div className="relative w-full h-[60vh]">
        <img
          src={posterUrl(movie.backdrop_path, BACKDROP_SIZE)}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-black/40 to-transparent" />
      </div>

      {/* Details */}
      <div className="px-6 md:px-12 -mt-32 relative z-10 flex flex-col md:flex-row gap-8">
        <img
          src={posterUrl(movie.poster_path, POSTER_SIZE)}
          alt={movie.title}
          className="w-48 rounded-xl shadow-2xl hidden md:block flex-shrink-0"
        />
        <div className="flex-1">
          <h1 className="text-3xl md:text-5xl font-bold text-white">{movie.title}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-400">
            <span className="text-yellow-400 font-semibold">⭐ {movie.vote_average?.toFixed(1)}</span>
            <span>{movie.release_date?.slice(0, 4)}</span>
            <span>{movie.runtime} min</span>
            {movie.genres?.map((g) => (
              <span key={g.id} className="bg-white/10 px-3 py-1 rounded-full text-xs text-white">{g.name}</span>
            ))}
          </div>
          <p className="text-gray-300 mt-4 max-w-2xl leading-relaxed">{movie.overview}</p>

          {trailer && (
            <a
              href={`https://www.youtube.com/watch?v=${trailer.key}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-5 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              ▶ Watch Trailer
            </a>
          )}
        </div>
      </div>

      {/* Cast */}
      {cast.length > 0 && (
        <section className="px-6 md:px-12 mt-12">
          <h2 className="text-white text-xl font-bold mb-4">Cast</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {cast.map((person) => (
              <div key={person.id} className="flex-shrink-0 w-24 text-center">
                <img
                  src={posterUrl(person.profile_path, 'w185')}
                  alt={person.name}
                  className="w-24 h-24 rounded-full object-cover bg-gray-800"
                />
                <p className="text-white text-xs mt-2 line-clamp-2">{person.name}</p>
                <p className="text-gray-500 text-xs line-clamp-1">{person.character}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Similar */}
      <div className="mt-10">
        <MovieRow title="Similar Movies" movies={similar} />
      </div>
    </div>
  )
}
