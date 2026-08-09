import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { posterUrl, BACKDROP_SIZE } from '../services/tmdb'

export default function Hero({ items = [] }) {
  const [index, setIndex] = useState(0)
  const timerRef = useRef(null)
  const touchX = useRef(null)

  function next(i, len) {
    return (i + 1) % len
  }
  function prev(i, len) {
    return (i - 1 + len) % len
  }

  // Auto-rotate every 4 seconds — restarts whenever index or items change
  useEffect(() => {
    if (items.length < 2) return
    timerRef.current = setTimeout(() => {
      setIndex((i) => next(i, items.length))
    }, 4000)
    return () => clearTimeout(timerRef.current)
  }, [index, items.length])

  function goNext() {
    clearTimeout(timerRef.current)
    setIndex((i) => next(i, items.length))
  }

  function goPrev() {
    clearTimeout(timerRef.current)
    setIndex((i) => prev(i, items.length))
  }

  function goTo(i) {
    clearTimeout(timerRef.current)
    setIndex(i)
  }

  function onTouchStart(e) {
    touchX.current = e.touches[0].clientX
  }

  function onTouchEnd(e) {
    if (touchX.current === null) return
    const diff = touchX.current - e.changedTouches[0].clientX
    if (diff > 50) goNext()
    else if (diff < -50) goPrev()
    touchX.current = null
  }

  if (!items.length) return null

  const item = items[index]
  const title = item.title || item.name || ''
  const year = (item.release_date || item.first_air_date || '').slice(0, 4)
  const isTV = item.media_type === 'tv' || (!item.title && !!item.name)
  const rating = item.vote_average ? item.vote_average.toFixed(1) : null

  return (
    <div
      className="relative w-full overflow-hidden select-none"
      style={{ height: '88vh' }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* All backdrops stacked, only current is visible */}
      {items.map((it, i) => (
        <img
          key={it.id}
          src={posterUrl(it.backdrop_path, BACKDROP_SIZE)}
          alt={it.title || it.name}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            opacity: i === index ? 1 : 0,
            transition: 'opacity 1s ease',
            zIndex: 0,
          }}
        />
      ))}

      {/* Dark overlays */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)', zIndex: 1 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, transparent 60%)', zIndex: 1 }} />

      {/* LEFT ARROW — desktop only */}
      <button
        onClick={goPrev}
        style={{
          display: 'none',
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: '80px', zIndex: 10,
          alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(to right, rgba(0,0,0,0.6), transparent)',
          border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)',
          transition: 'color 0.2s',
        }}
        className="md-arrow-btn"
        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* RIGHT ARROW — desktop only */}
      <button
        onClick={goNext}
        style={{
          display: 'none',
          position: 'absolute', right: 0, top: 0, bottom: 0,
          width: '80px', zIndex: 10,
          alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(to left, rgba(0,0,0,0.6), transparent)',
          border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)',
          transition: 'color 0.2s',
        }}
        className="md-arrow-btn"
        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Content */}
      <div style={{ position: 'absolute', bottom: 80, left: 0, right: 0, zIndex: 5, padding: '0 5%', maxWidth: 700 }}>
        {/* Badges */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <span style={{ background: isTV ? '#2563eb' : '#dc2626', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 999 }}>
            {isTV ? '📺 SERIES' : '🎬 MOVIE'}
          </span>
          {rating && (
            <span style={{ background: 'rgba(234,179,8,0.15)', color: '#facc15', fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 999, border: '1px solid rgba(234,179,8,0.3)' }}>
              ⭐ {rating}
            </span>
          )}
          {year && (
            <span style={{ background: 'rgba(255,255,255,0.1)', color: '#9ca3af', fontSize: 11, padding: '4px 12px', borderRadius: 999 }}>
              {year}
            </span>
          )}
        </div>

        <h1 style={{ color: '#fff', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: 16, textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>
          {title}
        </h1>

        <p style={{ color: '#d1d5db', fontSize: 15, lineHeight: 1.7, marginBottom: 28, maxWidth: 560, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {item.overview}
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link
            to={`/movie/${item.id}`}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#dc2626', color: '#fff', padding: '12px 24px', borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: 'none', boxShadow: '0 8px 24px rgba(220,38,38,0.4)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            Watch Trailer
          </Link>
          <Link
            to={`/movie/${item.id}`}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.12)', color: '#fff', padding: '12px 24px', borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Watchlist
          </Link>
        </div>
      </div>

      {/* Dot indicators */}
      <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', gap: 8, alignItems: 'center' }}>
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              border: 'none', cursor: 'pointer', padding: 0,
              borderRadius: 999,
              width: i === index ? 24 : 8,
              height: 8,
              background: i === index ? '#dc2626' : 'rgba(255,255,255,0.3)',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.1)', zIndex: 10 }}>
        <div
          key={index}
          style={{
            height: '100%', background: '#dc2626',
            animation: 'heroProgress 4s linear forwards',
          }}
        />
      </div>

      <style>{`
        @keyframes heroProgress { from { width: 0% } to { width: 100% } }
        @media (min-width: 768px) { .md-arrow-btn { display: flex !important; } }
      `}</style>
    </div>
  )
}
