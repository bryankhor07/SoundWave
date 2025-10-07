import { Link } from 'react-router-dom';
import { usePlayer } from '../contexts/PlayerProvider';
import { useFavorites } from '../contexts/FavoritesProvider';

export default function TrackCard({ track, currentList = [], showArtist = true, showAlbum = true, className = "" }) {
  const { play, pause, isPlaying, currentTrack } = usePlayer();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const isCurrentTrack = currentTrack?.id === track.id;
  const trackIsFavorite = isFavorite(track.id);

  const handlePlayPause = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isCurrentTrack && isPlaying) {
      pause();
    } else {
      // Pass the current list for queue functionality
      play(track, currentList.length > 0 ? currentList : [track]);
    }
  };

  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (trackIsFavorite) {
      removeFavorite(track.id);
    } else {
      addFavorite(track);
    }
  };

  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action(e);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all duration-200 group ${className}`}>
      <div className="relative">
        {/* Album Cover */}
        <div className="relative aspect-square mb-3 overflow-hidden rounded-lg">
          <img 
            src={track.album?.cover_medium || track.album?.cover_small || '/placeholder-album.jpg'} 
            alt={`${track.title} by ${track.artist?.name || 'Unknown Artist'}`}
            className="w-full h-full object-cover"
          />
          
          {/* Play/Pause Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <button
              onClick={handlePlayPause}
              onKeyDown={(e) => handleKeyDown(e, handlePlayPause)}
              className="bg-purple-500 hover:bg-purple-600 focus:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-300 text-white p-3 rounded-full transition-colors shadow-lg"
              title={isCurrentTrack && isPlaying ? 'Pause track' : 'Play track'}
              aria-label={`${isCurrentTrack && isPlaying ? 'Pause' : 'Play'} ${track.title} by ${track.artist?.name || 'Unknown Artist'}`}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {isCurrentTrack && isPlaying ? (
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                ) : (
                  <path d="M8 5v14l11-7z"/>
                )}
              </svg>
            </button>
          </div>

          {/* Currently Playing Indicator */}
          {isCurrentTrack && (
            <div className="absolute top-2 left-2">
              <div className="bg-purple-500 text-white px-2 py-1 rounded text-xs font-semibold">
                {isPlaying ? '♪ Playing' : '⏸ Paused'}
              </div>
            </div>
          )}
        </div>

        {/* Track Info */}
        <div className="space-y-1">
          <Link 
            to={`/track/${track.id}`}
            className="block font-semibold text-white hover:text-purple-300 transition-colors truncate"
            title={track.title}
          >
            {track.title}
          </Link>
          
          {showArtist && track.artist && (
            <Link 
              to={`/artist/${track.artist.id}`}
              className="block text-sm text-white/80 hover:text-white transition-colors truncate"
              title={track.artist.name}
            >
              {track.artist.name}
            </Link>
          )}
          
          {showAlbum && track.album && (
            <Link 
              to={`/album/${track.album.id}`}
              className="block text-xs text-white/60 hover:text-white/80 transition-colors truncate"
              title={track.album.title}
            >
              {track.album.title}
            </Link>
          )}
          
          {/* Duration and Actions */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-white/60">
              {formatDuration(track.duration)}
            </span>
            
            <button
              onClick={handleFavoriteToggle}
              onKeyDown={(e) => handleKeyDown(e, handleFavoriteToggle)}
              className={`p-1 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300 ${
                trackIsFavorite 
                  ? 'text-red-400 hover:text-red-300 focus:text-red-300' 
                  : 'text-white/60 hover:text-white focus:text-white'
              }`}
              title={trackIsFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-label={`${trackIsFavorite ? 'Remove' : 'Add'} ${track.title} ${trackIsFavorite ? 'from' : 'to'} favorites`}
            >
              <svg className="w-4 h-4" fill={trackIsFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
