import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getGenres } from '../services/tmdb'

const GENRE_CONFIG = {
  28:  { label: 'Action',      emoji: '💥', from: '#7f1d1d', to: '#dc2626', img: 'https://image.tmdb.org/t/p/w500/8Y43POKjjkvZM5zAKMNiz9BKZJZ.jpg' },
  12:  { label: 'Adventure',   emoji: '🗺️', from: '#1c3a5e', to: '#2563eb', img: 'https://image.tmdb.org/t/p/w500/gRApXuxWmO2forYTuTmcz5RaNUV.jpg' },
  16:  { label: 'Animation',   emoji: '🎨', from: '#4c1d95', to: '#7c3aed', img: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
  35:  { label: 'Comedy',      emoji: '😂', from: '#713f12', to: '#d97706', img: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsLLeHjnDPEYB.jpg' },
  80:  { label: 'Crime',       emoji: '🔫', from: '#1f2937', to: '#4b5563', img: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg' },
  99:  { label: 'Documentary', emoji: '🎥', from: '#064e3b', to: '#059669', img: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg' },
  18:  { label: 'Drama',       emoji: '🎭', from: '#831843', to: '#db2777', img: 'https://image.tmdb.org/t/p/w500/rSPw7tgCH9c6NqICZef4kZjFOQ5.jpg' },
  10751:{ label: 'Family',     emoji: '👨‍👩‍👧', from: '#1e3a5f', to: '#0ea5e9', img: 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg' },
  14:  { label: 'Fantasy',     emoji: '🧙', from: '#3b0764', to: '#9333ea', img: 'https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg' },
  36:  { label: 'History',     emoji: '🏛️', from: '#451a03', to: '#92400e', img: 'https://image.tmdb.org/t/p/w500/zb6fM1CX41D9rF9hdgclu0peUmy.jpg' },
  27:  { label: 'Horror',      emoji: '👻', from: '#0f0f0f', to: '#1f2937', img: 'https://image.tmdb.org/t/p/w500/xazWoLealQwEgqZ89MLZklLZD3k.jpg' },
  10402:{ label: 'Music',      emoji: '🎵', from: '#1e1b4b', to: '#4f46e5', img: 'https://image.tmdb.org/t/p/w500/rSPw7tgCH9c6NqICZef4kZjFOQ5.jpg' },
  9648: { label: 'Mystery',    emoji: '🔍', from: '#1e293b', to: '#334155', img: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg' },
  10749:{ label: 'Romance',    emoji: '❤️', from: '#881337', to: '#f43f5e', img: 'https://image.tmdb.org/t/p/w500/rSPw7tgCH9c6NqICZef4kZjFOQ5.jpg' },
  878: { label: 'Sci-Fi',      emoji: '🚀', from: '#0c4a6e', to: '#0284c7', img: 'https://image.tmdb.org/t/p/w500/8Y43POKjjkvZM5zAKMNiz9BKZJZ.jpg' },
  10770:{ label: 'TV Movie',   emoji: '📺', from: '#1a1a2e', to: '#16213e', img: 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg' },
  53:  { label: 'Thriller',    emoji: '😱', from: '#1c1917', to: '#44403c', img: 'https://image.tmdb.org/t/p/w500/xazWoLealQwEgqZ89MLZklLZD3k.jpg' },
  10752:{ label: 'War',        emoji: '⚔️', from: '#292524', to: '#57534e', img: 'https://image.tmdb.org/t/p/w500/zb6fM1CX41D9rF9hdgclu0peUmy.jpg' },
  37:  { label: 'Western',     emoji: '🤠', from: '#431407', to: '#c2410c', img: 'https://image.tmdb.org/t/p/w500/gRApXuxWmO2forYTuTmcz5RaNUV.jpg' },
}

const FALLBACK = { emoji: '🎬', from: '#1f2937', to: '#374151' }

export default function Genres() {
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getGenres()
      .then((res) => setGenres(res.data.genres))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      {/* Header */}
      <div className="mb-10">
        <p className="text-red-500 text-sm font-semibold tracking-widest uppercase mb-2">Explore</p>
        <h1 className="text-white text-4xl font-extrabold">Browse by Genre</h1>
        <p className="text-gray-400 mt-2 text-sm">Find exactly what you're in the mood for</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-gray-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {genres.map((genre) => {
            const cfg = GENRE_CONFIG[genre.id] || FALLBACK
            return (
              <Link
                key={genre.id}
                to={`/genre/${genre.id}?name=${encodeURIComponent(genre.name)}`}
                className="group relative overflow-hidden rounded-2xl h-32 flex flex-col justify-end p-4 cursor-pointer"
                style={{ background: `linear-gradient(135deg, ${cfg.from}, ${cfg.to})` }}
              >
                {/* Subtle noise texture overlay */}
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: 'cover' }}
                />

                {/* Hover shine */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300 rounded-2xl" />

                {/* Scale on hover */}
                <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105" />

                {/* Emoji */}
                <span className="text-3xl mb-1 relative z-10 drop-shadow-lg transition-transform duration-300 group-hover:-translate-y-1">
                  {cfg.emoji}
                </span>

                {/* Genre name */}
                <span className="text-white font-bold text-sm relative z-10 drop-shadow-md">
                  {genre.name}
                </span>

                {/* Arrow that appears on hover */}
                <span className="absolute top-3 right-3 text-white/0 group-hover:text-white/80 transition-all duration-300 text-lg z-10">
                  →
                </span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
