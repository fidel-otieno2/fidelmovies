import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getMovieDetails, posterUrl, BACKDROP_SIZE, POSTER_SIZE } from '../services/tmdb'
import { getWatchlist, addToWatchlist, removeFromWatchlist, getReviews, addReview, deleteReview } from '../services/api'
import { useAuth } from '../context/AuthContext'
import MovieRow from '../components/MovieRow'

export default function MovieDetails() {
  const { id } = useParams()
  const { user } = useAuth()

  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [inWatchlist, setInWatchlist] = useState(false)
  const [watchlistLoading, setWatchlistLoading] = useState(false)

  const [reviews, setReviews] = useState([])
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [reviewLoading, setReviewLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(null)
    Promise.all([
      getMovieDetails(id),
      getReviews(id),
    ])
      .then(([movieRes, reviewsRes]) => {
        setMovie(movieRes.data)
        setReviews(reviewsRes.data)
      })
      .catch(() => setError('Could not load movie details.'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!user) return
    getWatchlist()
      .then((res) => setInWatchlist(res.data.some((i) => i.movie_id === parseInt(id))))
      .catch(() => {})
  }, [id, user])

  const toggleWatchlist = async () => {
    if (!user) return
    setWatchlistLoading(true)
    try {
      if (inWatchlist) {
        await removeFromWatchlist(id)
        setInWatchlist(false)
      } else {
        await addToWatchlist({
          movie_id: parseInt(id),
          title: movie.title,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
          release_date: movie.release_date,
        })
        setInWatchlist(true)
      }
    } catch {}
    setWatchlistLoading(false)
  }

  const submitReview = async (e) => {
    e.preventDefault()
    setReviewLoading(true)
    try {
      const res = await addReview(id, reviewForm)
      setReviews((prev) => {
        const existing = prev.findIndex((r) => r.user_id === user.id)
        if (existing >= 0) {
          const updated = [...prev]
          updated[existing] = res.data
          return updated
        }
        return [res.data, ...prev]
      })
      setReviewForm({ rating: 5, comment: '' })
    } catch {}
    setReviewLoading(false)
  }

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(id, reviewId)
      setReviews((prev) => prev.filter((r) => r.id !== reviewId))
    } catch {}
  }

  if (loading) return <div className="h-screen bg-gray-900 animate-pulse" />
  if (error) return <div className="flex items-center justify-center h-screen text-gray-400">{error}</div>
  if (!movie) return null

  const trailer = movie.videos?.results?.find((v) => v.type === 'Trailer' && v.site === 'YouTube')
  const cast = movie.credits?.cast?.slice(0, 10) || []
  const similar = movie.similar?.results?.slice(0, 12) || []

  return (
    <div>
      {/* Backdrop */}
      <div className="relative w-full h-[60vh]">
        <img src={posterUrl(movie.backdrop_path, BACKDROP_SIZE)} alt={movie.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-black/40 to-transparent" />
      </div>

      {/* Details */}
      <div className="px-6 md:px-12 -mt-32 relative z-10 flex flex-col md:flex-row gap-8">
        <img
          src={posterUrl(movie.poster_path, POSTER_SIZE)}
          alt={movie.title}
          className="w-48 rounded-xl shadow-2xl hidden md:block flex-shrink-0"
        />
        <div className="flex-1">
          <h1 className="text-3xl md:text-5xl font-bold text-white">{movie.title}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-400">
            <span className="text-yellow-400 font-semibold">⭐ {movie.vote_average?.toFixed(1)}</span>
            <span>{movie.release_date?.slice(0, 4)}</span>
            <span>{movie.runtime} min</span>
            {movie.genres?.map((g) => (
              <span key={g.id} className="bg-white/10 px-3 py-1 rounded-full text-xs text-white">{g.name}</span>
            ))}
          </div>
          <p className="text-gray-300 mt-4 max-w-2xl leading-relaxed">{movie.overview}</p>

          <div className="flex gap-3 mt-5 flex-wrap">
            {trailer && (
              <a
                href={`https://www.youtube.com/watch?v=${trailer.key}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                ▶ Watch Trailer
              </a>
            )}
            {user ? (
              <button
                onClick={toggleWatchlist}
                disabled={watchlistLoading}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  inWatchlist
                    ? 'bg-green-700 hover:bg-red-700 text-white'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                {inWatchlist ? '✓ In Watchlist' : '＋ Watchlist'}
              </button>
            ) : (
              <Link to="/login" className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-semibold transition">
                Sign in to save
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Cast */}
      {cast.length > 0 && (
        <section className="px-6 md:px-12 mt-12">
          <h2 className="text-white text-xl font-bold mb-4">Cast</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {cast.map((person) => (
              <div key={person.id} className="flex-shrink-0 w-24 text-center">
                <img
                  src={posterUrl(person.profile_path, 'w185')}
                  alt={person.name}
                  className="w-24 h-24 rounded-full object-cover bg-gray-800"
                />
                <p className="text-white text-xs mt-2 line-clamp-2">{person.name}</p>
                <p className="text-gray-500 text-xs line-clamp-1">{person.character}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Reviews */}
      <section className="px-6 md:px-12 mt-12">
        <h2 className="text-white text-xl font-bold mb-6">Reviews</h2>

        {user ? (
          <form onSubmit={submitReview} className="bg-gray-900 rounded-xl p-5 mb-8 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Your rating:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewForm((f) => ({ ...f, rating: star }))}
                  className={`text-xl transition ${star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              value={reviewForm.comment}
              onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
              placeholder="Write your review..."
              rows={3}
              className="bg-white/10 text-white placeholder-gray-500 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-red-600 resize-none"
            />
            <button
              type="submit"
              disabled={reviewLoading}
              className="self-end bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              {reviewLoading ? 'Posting...' : 'Post Review'}
            </button>
          </form>
        ) : (
          <p className="text-gray-500 mb-6">
            <Link to="/login" className="text-red-400 hover:text-red-300">Sign in</Link> to leave a review.
          </p>
        )}

        {reviews.length === 0 ? (
          <p className="text-gray-600">No reviews yet. Be the first!</p>
        ) : (
          <div className="flex flex-col gap-4">
            {reviews.map((r) => (
              <div key={r.id} className="bg-gray-900 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-white font-semibold">{r.user_name}</span>
                    <span className="text-yellow-400 text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600 text-xs">{new Date(r.created_at).toLocaleDateString()}</span>
                    {user?.id === r.user_id && (
                      <button onClick={() => handleDeleteReview(r.id)} className="text-red-500 hover:text-red-400 text-xs">Delete</button>
                    )}
                  </div>
                </div>
                {r.comment && <p className="text-gray-300 text-sm leading-relaxed">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Similar */}
      <div className="mt-10">
        <MovieRow title="Similar Movies" movies={similar} />
      </div>
    </div>
  )
}
