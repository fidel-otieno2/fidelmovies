import { useEffect, useState } from 'react'
import Hero from '../components/Hero'
import MovieRow from '../components/MovieRow'
import { RowSkeleton } from '../components/Skeleton'
import { getTrending, getPopular, getTopRated, getUpcoming, getTrendingTV, getPopularTV, getTopRatedTV, getAiringToday } from '../services/tmdb'

export default function Home() {
  const [heroItems, setHeroItems] = useState([])
  const [trending, setTrending] = useState([])
  const [popular, setPopular] = useState([])
  const [topRated, setTopRated] = useState([])
  const [upcoming, setUpcoming] = useState([])
  const [trendingTV, setTrendingTV] = useState([])
  const [popularTV, setPopularTV] = useState([])
  const [topRatedTV, setTopRatedTV] = useState([])
  const [airingToday, setAiringToday] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [t, p, tr, u, ttv, ptv, trtv, at] = await Promise.all([
          getTrending(), getPopular(), getTopRated(), getUpcoming(),
          getTrendingTV(), getPopularTV(), getTopRatedTV(), getAiringToday(),
        ])

        const movies = t.data.results
        const tvShows = ttv.data.results.map((s) => ({ ...s, media_type: 'tv' }))

        setTrending(movies)
        setPopular(p.data.results)
        setTopRated(tr.data.results)
        setUpcoming(u.data.results)
        setTrendingTV(tvShows)
        setPopularTV(ptv.data.results.map((s) => ({ ...s, media_type: 'tv' })))
        setTopRatedTV(trtv.data.results.map((s) => ({ ...s, media_type: 'tv' })))
        setAiringToday(at.data.results.map((s) => ({ ...s, media_type: 'tv' })))

        // Mix top 5 movies + top 5 series for the hero carousel
        const mixed = []
        for (let i = 0; i < 5; i++) {
          if (movies[i]) mixed.push({ ...movies[i], media_type: 'movie' })
          if (tvShows[i]) mixed.push(tvShows[i])
        }
        setHeroItems(mixed)
      } catch {
        setError('Failed to load content. Please try again.')
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
        <div className="w-full h-[88vh] bg-gray-900 animate-pulse" />
      ) : (
        <Hero items={heroItems} />
      )}

      <div className="mt-6">
        {loading ? (
          <>
            <RowSkeleton />
            <RowSkeleton />
            <RowSkeleton />
            <RowSkeleton />
          </>
        ) : (
          <>
            <MovieRow title="🔥 Trending This Week" movies={trending} />
            <MovieRow title="📺 Trending Series" movies={trendingTV} />
            <MovieRow title="🎬 Popular Movies" movies={popular} />
            <MovieRow title="📡 Airing Today" movies={airingToday} />
            <MovieRow title="⭐ Top Rated Movies" movies={topRated} />
            <MovieRow title="🏆 Top Rated Series" movies={topRatedTV} />
            <MovieRow title="🗓️ Upcoming Movies" movies={upcoming} />
            <MovieRow title="🌟 Popular Series" movies={popularTV} />
          </>
        )}
      </div>
    </div>
  )
}
