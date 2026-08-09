import axios from 'axios'

const BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

export const IMAGE_BASE = 'https://image.tmdb.org/t/p'
export const POSTER_SIZE = 'w500'
export const BACKDROP_SIZE = 'original'

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY },
})

export const getTrending = () => tmdb.get('/trending/movie/week')
export const getPopular = () => tmdb.get('/movie/popular')
export const getTopRated = () => tmdb.get('/movie/top_rated')
export const getUpcoming = () => tmdb.get('/movie/upcoming')
export const getMovieDetails = (id) => tmdb.get(`/movie/${id}`, { params: { append_to_response: 'credits,videos,similar,watch/providers' } })
export const searchMovies = (query, page = 1) => tmdb.get('/search/movie', { params: { query, page } })
export const getGenres = () => tmdb.get('/genre/movie/list')
export const getMoviesByGenre = (genreId, page = 1) => tmdb.get('/discover/movie', { params: { with_genres: genreId, page } })

// TV / Series
export const getTrendingTV = () => tmdb.get('/trending/tv/week')
export const getPopularTV = () => tmdb.get('/tv/popular')
export const getTopRatedTV = () => tmdb.get('/tv/top_rated')
export const getAiringToday = () => tmdb.get('/tv/airing_today')

export const posterUrl = (path, size = POSTER_SIZE) =>
  path ? `${IMAGE_BASE}/${size}${path}` : '/placeholder.png'
