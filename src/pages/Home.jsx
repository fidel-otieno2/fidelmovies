import { useEffect, useState } from 'react'
import Hero from '../components/Hero'
import MovieRow from '../components/MovieRow'
import { RowSkeleton } from '../components/Skeleton'
import { getTrending, getPopular, getTopRated, getUpcoming } from '../services/tmdb'

export default function Home() {
  const [trending, setTrending] = useState([])
  const [popular, setPopular] = useState([])
  const [topRated, setTopRated] = useState([])
  const [upcoming, setUpcoming] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [t, p, tr, u] = await Promise.all([
          getTrending(), getPopular(), getTopRated(), getUpcoming()
        ])
        setTrending(t.data.results)
        setPopular(p.data.results)
        setTopRated(tr.data.results)
        setUpcoming(u.data.results)
      } catch {
        setError('Failed to load movies. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  if (error) return (
    <div className="flex flex-col items-center justify-center h-screen text-center gap-4">
      <p className="text-4xl">😕</p>
      <p className="text-gray-300">{error}</p>
      <button onClick={() => window.location.reload()} className="bg-red-600 px-6 py-2 rounded-lg text-white hover:bg-red-700 transition">
        Try Again
      </button>
    </div>
  )

  return (
    <div>
      {loading ? (
        <div className="w-full h-[85vh] bg-gray-900 animate-pulse" />
      ) : (
        <Hero movie={trending[0]} />
      )}

      <div className="mt-6">
        {loading ? (
          <>
            <RowSkeleton />
            <RowSkeleton />
            <RowSkeleton />
          </>
        ) : (
          <>
            <MovieRow title="🔥 Trending This Week" movies={trending} />
            <MovieRow title="🎬 Popular" movies={popular} />
            <MovieRow title="⭐ Top Rated" movies={topRated} />
            <MovieRow title="🗓️ Upcoming" movies={upcoming} />
          </>
        )}
      </div>
    </div>
  )
}
