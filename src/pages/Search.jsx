import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchMovies } from '../services/tmdb'
import MovieCard from '../components/MovieCard'
import { MovieCardSkeleton } from '../components/Skeleton'

export default function Search() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!query) return
    setLoading(true)
    setError(null)
    searchMovies(query)
      .then((res) => setMovies(res.data.results))
      .catch(() => setError('Search failed. Please try again.'))
      .finally(() => setLoading(false))
  }, [query])

  return (
    <div className="pt-24 px-6 min-h-screen">
      <h1 className="text-white text-2xl font-bold mb-6">
        {query ? `Results for "${query}"` : 'Search for a movie'}
      </h1>

      {error && <p className="text-red-400">{error}</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => <MovieCardSkeleton key={i} />)
          : movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
        }
      </div>

      {!loading && !error && movies.length === 0 && query && (
        <div className="text-center mt-20 text-gray-500">
          <p className="text-4xl mb-3">🎬</p>
          <p>No movies found for "{query}"</p>
        </div>
      )}
    </div>
  )
}
