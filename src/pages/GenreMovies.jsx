import { useEffect, useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { getMoviesByGenre } from '../services/tmdb'
import MovieCard from '../components/MovieCard'
import { MovieCardSkeleton } from '../components/Skeleton'

export default function GenreMovies() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const name = searchParams.get('name') || 'Genre'
  const [movies, setMovies] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    setLoading(true)
    setMovies([])
    setPage(1)
    getMoviesByGenre(id, 1)
      .then((res) => {
        setMovies(res.data.results)
        setTotalPages(res.data.total_pages)
      })
      .finally(() => setLoading(false))
  }, [id])

  const loadMore = () => {
    const next = page + 1
    setLoadingMore(true)
    getMoviesByGenre(id, next)
      .then((res) => {
        setMovies((prev) => [...prev, ...res.data.results])
        setPage(next)
      })
      .finally(() => setLoadingMore(false))
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Header */}
      <div className="px-6 mb-8">
        <Link to="/genres" className="flex items-center gap-2 text-gray-500 hover:text-white text-sm transition mb-4 w-fit">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          All Genres
        </Link>
        <div className="flex items-end gap-4">
          <h1 className="text-white text-4xl font-extrabold">{name}</h1>
          {!loading && (
            <span className="text-gray-500 text-sm mb-1">{movies.length} titles</span>
          )}
        </div>
        <div className="mt-3 w-12 h-1 bg-red-600 rounded-full" />
      </div>

      {/* Grid */}
      <div className="px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {loading
            ? Array.from({ length: 18 }).map((_, i) => <MovieCardSkeleton key={i} />)
            : movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
          }
          {loadingMore && Array.from({ length: 6 }).map((_, i) => <MovieCardSkeleton key={`more-${i}`} />)}
        </div>

        {/* Load more */}
        {!loading && page < totalPages && (
          <div className="flex justify-center mt-12">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white px-8 py-3 rounded-full font-semibold text-sm transition border border-white/10"
            >
              {loadingMore ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                    <path d="M12 2a10 10 0 0 1 10 10" />
                  </svg>
                  Loading...
                </>
              ) : (
                'Load More'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
