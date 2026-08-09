import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getGenres } from '../services/tmdb'

const GENRE_COLORS = [
  'from-red-800 to-red-600', 'from-blue-800 to-blue-600', 'from-purple-800 to-purple-600',
  'from-green-800 to-green-600', 'from-yellow-800 to-yellow-600', 'from-pink-800 to-pink-600',
  'from-indigo-800 to-indigo-600', 'from-teal-800 to-teal-600', 'from-orange-800 to-orange-600',
  'from-cyan-800 to-cyan-600', 'from-rose-800 to-rose-600', 'from-violet-800 to-violet-600',
]

export default function Genres() {
  const [genres, setGenres] = useState([])

  useEffect(() => {
    getGenres().then((res) => setGenres(res.data.genres))
  }, [])

  return (
    <div className="pt-24 px-6 min-h-screen">
      <h1 className="text-white text-2xl font-bold mb-6">Browse by Genre</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {genres.map((genre, i) => (
          <Link
            key={genre.id}
            to={`/genre/${genre.id}?name=${encodeURIComponent(genre.name)}`}
            className={`bg-gradient-to-br ${GENRE_COLORS[i % GENRE_COLORS.length]} rounded-xl p-6 text-center font-semibold text-white hover:scale-105 transition-transform duration-200 shadow-lg`}
          >
            {genre.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
