import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { getMoviesByGenre } from '../services/tmdb'
import MovieCard from '../components/MovieCard'
import { MovieCardSkeleton } from '../components/Skeleton'

export default function GenreMovies() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const name = searchParams.get('name') || 'Genre'
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getMoviesByGenre(id)
      .then((res) => setMovies(res.data.results))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <div className="pt-24 px-6 min-h-screen">
      <h1 className="text-white text-2xl font-bold mb-6">{name}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => <MovieCardSkeleton key={i} />)
          : movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
        }
      </div>
    </div>
  )
}
