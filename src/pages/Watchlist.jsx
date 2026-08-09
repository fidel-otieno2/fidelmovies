import { useEffect, useState } from 'react'
import MovieCard from '../components/MovieCard'

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([])

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('watchlist') || '[]')
    setWatchlist(saved)
  }, [])

  return (
    <div className="pt-24 px-6 min-h-screen">
      <h1 className="text-white text-2xl font-bold mb-6">My Watchlist</h1>

      {watchlist.length === 0 ? (
        <div className="text-center mt-20 text-gray-500">
          <p className="text-4xl mb-3">🎬</p>
          <p>Your watchlist is empty.</p>
          <p className="text-sm mt-1">Add movies from their detail page.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {watchlist.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  )
}
