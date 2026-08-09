import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setQuery('')
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-transparent px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-red-600 text-2xl font-bold tracking-wider">
        🎬 CineVerse
      </Link>

      <div className="hidden md:flex gap-6 text-sm text-gray-300">
        <Link to="/" className="hover:text-white transition">Home</Link>
        <Link to="/genres" className="hover:text-white transition">Genres</Link>
        <Link to="/watchlist" className="hover:text-white transition">Watchlist</Link>
      </div>

      <div className="flex items-center gap-3">

        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies..."
            className="bg-white/10 text-white placeholder-gray-400 text-sm px-4 py-2 rounded-full outline-none focus:bg-white/20 transition w-48"
          />
          <button type="submit" className="text-gray-300 hover:text-white transition">🔍</button>
        </form>

        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-gray-300 text-sm hidden md:block">{user.name}</span>
            <button onClick={signOut} className="text-sm text-red-400 hover:text-red-300 transition">Sign out</button>
          </div>
        ) : (
          <Link to="/login" className="text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition">Sign in</Link>
        )}
      </div>
    </nav>
  )
}
