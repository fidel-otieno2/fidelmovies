import { useRef, useEffect, useCallback } from 'react'
import MovieCard from './MovieCard'

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

export default function MovieRow({ title, movies }) {
  const rowRef = useRef(null)
  const autoScrollRef = useRef(null)

  const CARD_WIDTH = 180
  const SCROLL_AMOUNT = CARD_WIDTH * 2

  const scrollBy = useCallback((amount) => {
    const el = rowRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    const next = el.scrollLeft + amount
    // Loop around
    if (next >= maxScroll) {
      el.scrollTo({ left: 0, behavior: 'smooth' })
    } else if (next < 0) {
      el.scrollTo({ left: maxScroll, behavior: 'smooth' })
    } else {
      el.scrollBy({ left: amount, behavior: 'smooth' })
    }
  }, [])

  // Auto-scroll every 3 seconds
  useEffect(() => {
    autoScrollRef.current = setInterval(() => {
      scrollBy(SCROLL_AMOUNT)
    }, 3000)
    return () => clearInterval(autoScrollRef.current)
  }, [scrollBy, SCROLL_AMOUNT])

  // Pause auto-scroll on hover
  const pauseAuto = () => clearInterval(autoScrollRef.current)
  const resumeAuto = () => {
    autoScrollRef.current = setInterval(() => scrollBy(SCROLL_AMOUNT), 3000)
  }

  if (!movies?.length) return null

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between px-6 mb-4">
        <h2 className="text-white text-xl font-bold">{title}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scrollBy(-SCROLL_AMOUNT)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={() => scrollBy(SCROLL_AMOUNT)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      <div
        ref={rowRef}
        onMouseEnter={pauseAuto}
        onMouseLeave={resumeAuto}
        onTouchStart={pauseAuto}
        onTouchEnd={resumeAuto}
        className="flex gap-4 overflow-x-auto scroll-smooth px-6 pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {movies.map((movie) => (
          <div key={movie.id} className="flex-shrink-0 w-40 sm:w-44">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  )
}
