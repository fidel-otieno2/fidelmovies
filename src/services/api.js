import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auth
export const register = (data) => api.post('/api/auth/register', data)
export const login = (data) => api.post('/api/auth/login', data)
export const getMe = () => api.get('/api/auth/me')

// Watchlist
export const getWatchlist = () => api.get('/api/watchlist/')
export const addToWatchlist = (movie) => api.post('/api/watchlist/', movie)
export const removeFromWatchlist = (movieId) => api.delete(`/api/watchlist/${movieId}`)

// Reviews
export const getReviews = (movieId) => api.get(`/api/reviews/${movieId}`)
export const addReview = (movieId, data) => api.post(`/api/reviews/${movieId}`, data)
export const deleteReview = (movieId, reviewId) => api.delete(`/api/reviews/${movieId}/${reviewId}`)
