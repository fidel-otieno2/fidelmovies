import { Link } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { posterUrl, BACKDROP_SIZE } from '../services/tmdb'

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
)

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-5 h-5">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

export default function Hero({ items = [] }) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => {
    setCurrent((i) => (i + 1) % items.length)
  }, [items.length])

  const prev = () => setCurrent((i) => (i - 1 + items.length) % items.length)

  useEffect(() => {
    if (paused || items.length === 0) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [paused, next, items.length])

  if (!items.length) return null

  const item = items[current]
  const { id, title, name, overview, vote_average, backdrop_path, release_date, first_air_date, media_type } = item
  const displayTitle = title || name
  const year = (release_date || first_air_date || '').slice(0, 4)
  const isTV = media_type === 'tv' || !!name

  return (
    <div
      className="relative w-full h-[88vh] flex items-end overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Backdrop — fade between items */}
      {items.map((it, i) => (
        <img
          key={it.id}
          src={posterUrl(it.backdrop_path, BACKDROP_SIZE)}
          alt={it.title || it.name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}

      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10 px-8 pb-24 max-w-2xl w-full">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${isTV ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'}`}>
            {isTV ? '📺 SERIES' : '🎬 MOVIE'}
          </span>
          {vote_average > 0 && (
            <span className="text-xs font-semibold text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">
              ⭐ {vote_average.toFixed(1)}
            </span>
          )}
          {year && (
            <span className="text-xs text-gray-400 bg-white/10 px-3 py-1 rounded-full">{year}</span>
          )}
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
          {displayTitle}
        </h1>

        <p className="text-gray-300 text-sm md:text-base line-clamp-3 mb-8 max-w-xl leading-relaxed">
          {overview}
        </p>

        <div className="flex gap-3 flex-wrap">
          <Link
            to={`/${isTV ? 'movie' : 'movie'}/${id}`}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-red-900/40"
          >
            <PlayIcon /> Watch Trailer
          </Link>
          <Link
            to={`/movie/${id}`}
            className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 backdrop-blur-sm border border-white/10"
          >
            <PlusIcon /> Watchlist
          </Link>
        </div>
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/10 transition"
      >
        <ChevronLeft />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/10 transition"
      >
        <ChevronRight />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current ? 'w-6 h-2 bg-red-600' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
