import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePlayer } from '../contexts/PlayerProvider';
import { useFavorites } from '../contexts/FavoritesProvider';
import PlayerControls from './PlayerControls';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';

export default function NowPlayingBar() {
  const { currentTrack, isPlaying, queue, currentIndex } = usePlayer();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!currentTrack) {
    return null;
  }

  const trackIsFavorite = isFavorite(currentTrack.id, 'track');

  const handleFavoriteToggle = () => {
    if (trackIsFavorite) {
      removeFavorite(currentTrack.id, 'track');
    } else {
      addFavorite(currentTrack, 'track');
    }
  };

  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-white/10 z-50">
      {/* Expanded Progress Bar */}
      {isExpanded && (
        <div className="px-4 py-2 border-b border-white/10">
          <ProgressBar showTime={true} />
        </div>
      )}

      {/* Main Player Bar */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Track Info */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="relative group">
            <img
              src={currentTrack.album?.cover_small || currentTrack.album?.cover_medium || '/placeholder-album.jpg'}
              alt={`${currentTrack.title} by ${currentTrack.artist?.name || 'Unknown Artist'}`}
              className="w-12 h-12 rounded shadow-lg"
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-black/40 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <Link
              to={`/track/${currentTrack.id}`}
              className="block font-medium text-white hover:text-purple-300 transition-colors truncate"
              title={currentTrack.title}
            >
              {currentTrack.title}
            </Link>
            <Link
              to={`/artist/${currentTrack.artist?.id}`}
              className="block text-sm text-white/70 hover:text-white transition-colors truncate"
              title={currentTrack.artist?.name}
            >
              {currentTrack.artist?.name || 'Unknown Artist'}
            </Link>
          </div>

          <button
            onClick={handleFavoriteToggle}
            onKeyDown={(e) => handleKeyDown(e, handleFavoriteToggle)}
            className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300 ${
              trackIsFavorite
                ? 'text-red-400 hover:text-red-300 focus:text-red-300'
                : 'text-white/60 hover:text-white focus:text-white'
            }`}
            title={trackIsFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label={`${trackIsFavorite ? 'Remove' : 'Add'} ${currentTrack.title} ${trackIsFavorite ? 'from' : 'to'} favorites`}
          >
            <svg className="w-5 h-5" fill={trackIsFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center space-y-2 flex-1 max-w-md">
          <PlayerControls size="medium" />
          {!isExpanded && (
            <div className="w-full">
              <ProgressBar showTime={false} />
            </div>
          )}
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-3 flex-1 justify-end">
          {/* Queue Info */}
          {queue.length > 1 && (
            <div className="hidden sm:flex items-center space-x-2 text-xs text-white/60">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span>{currentIndex + 1} / {queue.length}</span>
            </div>
          )}

          {/* Volume Control */}
          <div className="hidden md:block">
            <VolumeControl />
          </div>

          {/* Expand/Collapse Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            onKeyDown={(e) => handleKeyDown(e, () => setIsExpanded(!isExpanded))}
            className="p-2 text-white/60 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-purple-300 rounded transition-colors"
            title={isExpanded ? 'Collapse player' : 'Expand player'}
            aria-label={isExpanded ? 'Collapse player' : 'Expand player'}
          >
            <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Volume Control (when expanded) */}
      {isExpanded && (
        <div className="px-4 pb-3 md:hidden">
          <VolumeControl />
        </div>
      )}
    </div>
  );
}
