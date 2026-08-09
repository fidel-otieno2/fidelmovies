import { Link } from 'react-router-dom'
import { posterUrl } from '../services/tmdb'

export default function MovieCard({ movie }) {
  const { id, title, poster_path, vote_average, release_date, genre_ids } = movie

  return (
    <Link to={`/movie/${id}`} className="group block">
      <div className="relative overflow-hidden rounded-lg bg-gray-900 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-red-900/30">
        <img
          src={posterUrl(poster_path)}
          alt={title}
          className="w-full aspect-[2/3] object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
          <p className="text-white text-sm font-semibold line-clamp-2">{title}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-yellow-400 text-xs">⭐ {vote_average?.toFixed(1)}</span>
            <span className="text-gray-400 text-xs">{release_date?.slice(0, 4)}</span>
          </div>
        </div>
      </div>
      <div className="mt-2 px-1">
        <p className="text-white text-sm font-medium line-clamp-1">{title}</p>
        <p className="text-yellow-400 text-xs mt-0.5">⭐ {vote_average?.toFixed(1)}</p>
      </div>
    </Link>
  )
}
