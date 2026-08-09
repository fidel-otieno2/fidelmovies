import { Link } from 'react-router-dom'
import { posterUrl, BACKDROP_SIZE } from '../services/tmdb'

export default function Hero({ movie }) {
  if (!movie) return null

  const { id, title, overview, vote_average, backdrop_path, release_date } = movie

  return (
    <div className="relative w-full h-[85vh] flex items-end">
      <img
        src={posterUrl(backdrop_path, BACKDROP_SIZE)}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

      <div className="relative z-10 px-8 pb-20 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-3">{title}</h1>
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-300">
          <span className="text-yellow-400 font-semibold">⭐ {vote_average?.toFixed(1)}</span>
          <span>{release_date?.slice(0, 4)}</span>
        </div>
        <p className="text-gray-300 text-sm md:text-base line-clamp-3 mb-6">{overview}</p>
        <div className="flex gap-3">
          <Link
            to={`/movie/${id}`}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            ▶ Watch Trailer
          </Link>
          <Link
            to={`/movie/${id}`}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-semibold transition backdrop-blur-sm"
          >
            ＋ Watchlist
          </Link>
        </div>
      </div>
    </div>
  )
}
