import { useState, useRef, useEffect } from 'react';
import { usePlayer } from '../contexts/PlayerProvider';

export default function ProgressBar({ className = '', showTime = true }) {
  const { currentTime, duration, seek, currentTrack } = usePlayer();
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState(0);
  const progressRef = useRef(null);

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (!duration) return 0;
    const time = isDragging ? dragTime : currentTime;
    return Math.min((time / duration) * 100, 100);
  };

  const handleMouseDown = (e) => {
    if (!duration || !currentTrack) return;
    setIsDragging(true);
    updateProgress(e);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !duration) return;
    updateProgress(e);
  };

  const handleMouseUp = (e) => {
    if (!isDragging || !duration) return;
    updateProgress(e);
    seek(dragTime);
    setIsDragging(false);
  };

  const updateProgress = (e) => {
    if (!progressRef.current || !duration) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newTime = percentage * duration;
    setDragTime(newTime);
  };

  const handleKeyDown = (e) => {
    if (!duration || !currentTrack) return;
    
    let newTime = currentTime;
    const step = 5; // 5 seconds
    
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        newTime = Math.max(0, currentTime - step);
        seek(newTime);
        break;
      case 'ArrowRight':
        e.preventDefault();
        newTime = Math.min(duration, currentTime + step);
        seek(newTime);
        break;
      case 'Home':
        e.preventDefault();
        seek(0);
        break;
      case 'End':
        e.preventDefault();
        seek(duration - 1);
        break;
    }
  };

  // Add global mouse event listeners when dragging
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e) => handleMouseMove(e);
      const handleGlobalMouseUp = (e) => handleMouseUp(e);
      
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging]);

  const displayTime = isDragging ? dragTime : currentTime;

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {showTime && (
        <span className="text-xs text-white/70 font-mono min-w-[2.5rem] text-right">
          {formatTime(displayTime)}
        </span>
      )}
      
      <div className="flex-1 relative">
        <div
          ref={progressRef}
          className="relative h-2 bg-white/20 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-300"
          onMouseDown={handleMouseDown}
          onKeyDown={handleKeyDown}
          tabIndex={currentTrack ? 0 : -1}
          role="slider"
          aria-label="Seek track position"
          aria-valuemin={0}
          aria-valuemax={duration || 0}
          aria-valuenow={displayTime}
          aria-valuetext={`${formatTime(displayTime)} of ${formatTime(duration)}`}
        >
          {/* Progress Fill */}
          <div
            className="absolute top-0 left-0 h-full bg-purple-400 rounded-full transition-all duration-100"
            style={{ width: `${getProgressPercentage()}%` }}
          />
          
          {/* Drag Handle */}
          {currentTrack && (
            <div
              className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-100 ${
                isDragging ? 'scale-125' : 'scale-0 group-hover:scale-100'
              }`}
              style={{ left: `calc(${getProgressPercentage()}% - 0.5rem)` }}
            />
          )}
        </div>
      </div>
      
      {showTime && (
        <span className="text-xs text-white/70 font-mono min-w-[2.5rem]">
          {formatTime(duration)}
        </span>
      )}
    </div>
  );
}
