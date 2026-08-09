import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getWatchlist } from '../services/api'
import MovieCard from '../components/MovieCard'
import { MovieCardSkeleton } from '../components/Skeleton'

export default function Watchlist() {
  const { user } = useAuth()
  const [watchlist, setWatchlist] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    getWatchlist()
      .then((res) => setWatchlist(res.data))
      .finally(() => setLoading(false))
  }, [user])

  if (!user) return (
    <div className="flex flex-col items-center justify-center h-screen text-center gap-4">
      <p className="text-4xl">🎬</p>
      <p className="text-gray-300">Sign in to see your watchlist</p>
      <Link to="/login" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition">
        Sign In
      </Link>
    </div>
  )

  return (
    <div className="pt-24 px-6 min-h-screen">
      <h1 className="text-white text-2xl font-bold mb-6">My Watchlist</h1>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <MovieCardSkeleton key={i} />)}
        </div>
      ) : watchlist.length === 0 ? (
        <div className="text-center mt-20 text-gray-500">
          <p className="text-4xl mb-3">🎬</p>
          <p>Your watchlist is empty.</p>
          <p className="text-sm mt-1">Add movies from their detail page.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {watchlist.map((item) => (
            <MovieCard key={item.movie_id} movie={{
              id: item.movie_id,
              title: item.title,
              poster_path: item.poster_path,
              vote_average: item.vote_average,
              release_date: item.release_date,
            }} />
          ))}
        </div>
      )}
    </div>
  )
}
