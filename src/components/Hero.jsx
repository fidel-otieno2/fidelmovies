import { Link } from 'react-router-dom'
import { useState, useEffect, useRef, useCallback } from 'react'
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
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)
const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

export default function Hero({ items = [] }) {
  const [current, setCurrent] = useState(0)
  const intervalRef = useRef(null)
  const touchStartX = useRef(null)

  const startTimer = useCallback(() => {
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setCurrent((i) => (i + 1) % items.length)
    }, 4000)
  }, [items.length])

  // Start auto-rotation as soon as items are available — no pause on hover
  useEffect(() => {
    if (items.length === 0) return
    startTimer()
    return () => clearInterval(intervalRef.current)
  }, [items.length, startTimer])

  const goTo = (index) => {
    setCurrent((index + items.length) % items.length)
    startTimer() // reset timer on manual nav
  }

  // Touch swipe support for mobile
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1)
    touchStartX.current = null
  }

  if (!items.length) return null

  const item = items[current]
  const { id, title, name, overview, vote_average, backdrop_path, release_date, first_air_date, media_type } = item
  const displayTitle = title || name
  const year = (release_date || first_air_date || '').slice(0, 4)
  const isTV = media_type === 'tv' || (!title && !!name)

  return (
    <div
      className="relative w-full h-[88vh] flex items-end overflow-hidden select-none"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Backdrops — crossfade */}
      {items.map((it, i) => (
        <img
          key={it.id}
          src={posterUrl(it.backdrop_path, BACKDROP_SIZE)}
          alt={it.title || it.name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

      {/* Left arrow — desktop only, hugs the left edge */}
      <button
        onClick={() => goTo(current - 1)}
        className="hidden md:flex absolute left-0 top-0 bottom-0 w-16 z-20 items-center justify-start pl-3
                   bg-gradient-to-r from-black/50 to-transparent
                   hover:from-black/80 text-white/60 hover:text-white transition-all duration-200"
      >
        <ChevronLeft />
      </button>

      {/* Right arrow — desktop only, hugs the right edge */}
      <button
        onClick={() => goTo(current + 1)}
        className="hidden md:flex absolute right-0 top-0 bottom-0 w-16 z-20 items-center justify-end pr-3
                   bg-gradient-to-l from-black/50 to-transparent
                   hover:from-black/80 text-white/60 hover:text-white transition-all duration-200"
      >
        <ChevronRight />
      </button>

      {/* Content */}
      <div className="relative z-10 px-8 pb-20 max-w-2xl w-full">
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${isTV ? 'bg-blue-600' : 'bg-red-600'} text-white`}>
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
            to={`/movie/${id}`}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg shadow-red-900/40"
          >
            <PlayIcon /> Watch Trailer
          </Link>
          <Link
            to={`/movie/${id}`}
            className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white px-6 py-3 rounded-xl font-semibold transition backdrop-blur-sm border border-white/10"
          >
            <PlusIcon /> Watchlist
          </Link>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current ? 'w-6 h-2 bg-red-600' : 'w-2 h-2 bg-white/30 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 z-20">
        <div
          key={current}
          className="h-full bg-red-600"
          style={{ animation: 'progress 4s linear forwards' }}
        />
      </div>

      <style>{`
        @keyframes progress {
          from { width: 0% }
          to   { width: 100% }
        }
      `}</style>
    </div>
  )
}
