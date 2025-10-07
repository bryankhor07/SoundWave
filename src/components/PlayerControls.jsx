import { usePlayer } from '../contexts/PlayerProvider';

export default function PlayerControls({ size = 'medium', className = '' }) {
  const { play, pause, next, prev, isPlaying, currentTrack, queue, currentIndex } = usePlayer();

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else if (currentTrack) {
      play(currentTrack, queue);
    }
  };

  const handlePrevious = () => {
    prev();
  };

  const handleNext = () => {
    next();
  };

  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  // Size variants
  const sizeClasses = {
    small: {
      button: 'p-2',
      icon: 'w-4 h-4',
      playButton: 'p-2',
      playIcon: 'w-5 h-5'
    },
    medium: {
      button: 'p-3',
      icon: 'w-5 h-5',
      playButton: 'p-3',
      playIcon: 'w-6 h-6'
    },
    large: {
      button: 'p-4',
      icon: 'w-6 h-6',
      playButton: 'p-4',
      playIcon: 'w-8 h-8'
    }
  };

  const sizes = sizeClasses[size] || sizeClasses.medium;

  const canGoPrev = queue.length > 0 && currentIndex > 0;
  const canGoNext = queue.length > 0 && currentIndex < queue.length - 1;

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        onKeyDown={(e) => handleKeyDown(e, handlePrevious)}
        disabled={!canGoPrev}
        className={`${sizes.button} rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300 ${
          canGoPrev 
            ? 'text-white hover:text-purple-300 focus:text-purple-300' 
            : 'text-white/30 cursor-not-allowed'
        }`}
        title="Previous track"
        aria-label="Previous track"
      >
        <svg className={sizes.icon} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
        </svg>
      </button>

      {/* Play/Pause Button */}
      <button
        onClick={handlePlayPause}
        onKeyDown={(e) => handleKeyDown(e, handlePlayPause)}
        disabled={!currentTrack}
        className={`${sizes.playButton} bg-purple-500 hover:bg-purple-600 focus:bg-purple-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-lg`}
        title={isPlaying ? 'Pause' : 'Play'}
        aria-label={isPlaying ? 'Pause current track' : 'Play current track'}
      >
        <svg className={sizes.playIcon} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          {isPlaying ? (
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
          ) : (
            <path d="M8 5v14l11-7z"/>
          )}
        </svg>
      </button>

      {/* Next Button */}
      <button
        onClick={handleNext}
        onKeyDown={(e) => handleKeyDown(e, handleNext)}
        disabled={!canGoNext}
        className={`${sizes.button} rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300 ${
          canGoNext 
            ? 'text-white hover:text-purple-300 focus:text-purple-300' 
            : 'text-white/30 cursor-not-allowed'
        }`}
        title="Next track"
        aria-label="Next track"
      >
        <svg className={sizes.icon} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
        </svg>
      </button>
    </div>
  );
}
