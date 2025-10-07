import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoritesProvider';

export default function NavBar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { favorites } = useFavorites();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" aria-label="SoundWave home">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg" aria-hidden="true">🎵</span>
            </div>
            <span className="text-white font-bold text-xl">SoundWave</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-white/90 hover:text-white transition-colors ${
                isActive('/') ? 'text-white font-semibold' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/favorites"
              className={`text-white/90 hover:text-white transition-colors flex items-center space-x-1 ${
                isActive('/favorites') ? 'text-white font-semibold' : ''
              }`}
            >
              <span>Favorites</span>
              {favorites.length > 0 && (
                <span className="bg-purple-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                  {favorites.length}
                </span>
              )}
            </Link>
          </div>

          {/* Search and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-white/90 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
              aria-label="Toggle search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white/90 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
              aria-label="Open mobile menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search Bar (Expandable) */}
        {isSearchOpen && (
          <div className="pb-4">
            <div className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for tracks, artists, albums..."
                  className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  autoFocus
                  aria-label="Search music"
                />
                <button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                  aria-label="Submit search"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Navigation Menu (Hidden for now, can be expanded later) */}
      <div className="md:hidden hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white/5">
          <Link
            to="/"
            className="block px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-md"
          >
            Home
          </Link>
          <Link
            to="/favorites"
            className="block px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-md"
          >
            Favorites ({favorites.length})
          </Link>
        </div>
      </div>
    </nav>
  );
}
