import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoritesProvider';

export default function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white/90 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
            aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
            aria-expanded={isMobileMenuOpen}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white/5">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-md"
            >
              Home
            </Link>
            <Link
              to="/favorites"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-md"
            >
              Favorites ({favorites.length})
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
