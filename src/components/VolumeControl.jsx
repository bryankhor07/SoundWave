import { useState } from 'react';
import { usePlayer } from '../contexts/PlayerProvider';

export default function VolumeControl({ className = '', orientation = 'horizontal' }) {
  const { volume, setVolume } = usePlayer();
  const [showSlider, setShowSlider] = useState(false);

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const toggleMute = () => {
    setVolume(volume > 0 ? 0 : 0.7);
  };

  const handleKeyDown = (e) => {
    const step = 0.1;
    let newVolume = volume;

    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowRight':
        e.preventDefault();
        newVolume = Math.min(1, volume + step);
        setVolume(newVolume);
        break;
      case 'ArrowDown':
      case 'ArrowLeft':
        e.preventDefault();
        newVolume = Math.max(0, volume - step);
        setVolume(newVolume);
        break;
      case 'Home':
        e.preventDefault();
        setVolume(0);
        break;
      case 'End':
        e.preventDefault();
        setVolume(1);
        break;
    }
  };

  const getVolumeIcon = () => {
    if (volume === 0) {
      return (
        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
      );
    } else if (volume < 0.3) {
      return (
        <path d="M7 9v6h4l5 5V4l-5 5H7z"/>
      );
    } else if (volume < 0.7) {
      return (
        <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
      );
    } else {
      return (
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
      );
    }
  };

  if (orientation === 'vertical') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setShowSlider(!showSlider)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setShowSlider(!showSlider);
            }
          }}
          className="p-2 text-white/70 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-purple-300 rounded transition-colors"
          title={`Volume: ${Math.round(volume * 100)}%`}
          aria-label={`Volume control, currently ${Math.round(volume * 100)}%`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            {getVolumeIcon()}
          </svg>
        </button>

        {showSlider && (
          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm rounded-lg p-3">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              onKeyDown={handleKeyDown}
              className="w-20 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider-vertical"
              style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical' }}
              aria-label="Volume slider"
            />
            <div className="text-xs text-white/70 text-center mt-2">
              {Math.round(volume * 100)}%
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <button
        onClick={toggleMute}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMute();
          }
        }}
        className="p-1 text-white/70 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-purple-300 rounded transition-colors"
        title={volume === 0 ? 'Unmute' : 'Mute'}
        aria-label={volume === 0 ? 'Unmute' : 'Mute'}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          {getVolumeIcon()}
        </svg>
      </button>

      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={volume}
        onChange={handleVolumeChange}
        onKeyDown={handleKeyDown}
        className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-300"
        style={{ maxWidth: '100px' }}
        aria-label="Volume slider"
      />

      <span className="text-xs text-white/70 font-mono min-w-[2rem] text-right">
        {Math.round(volume * 100)}%
      </span>
    </div>
  );
}
