import { createContext, useContext, useState, useRef, useEffect } from 'react';

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const audioRef = useRef(null);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
      
      // Audio event listeners
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current.duration);
      });
      
      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current.currentTime);
      });
      
      audioRef.current.addEventListener('ended', () => {
        // Auto-play next track - use a callback to avoid circular dependency
        setTimeout(() => {
          if (queue.length > 0 && currentIndex < queue.length - 1) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            setCurrentTrack(queue[nextIndex]);
            setIsPlaying(true);
          } else {
            setIsPlaying(false);
          }
        }, 100);
      });
      
      audioRef.current.addEventListener('error', (e) => {
        console.warn('Audio playback error - this is normal for Deezer preview URLs:', e.target.error);
        setIsPlaying(false);
      });
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // Update audio source when current track changes
  useEffect(() => {
    if (audioRef.current && currentTrack?.preview) {
      audioRef.current.src = currentTrack.preview;
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentTrack]);

  // Handle play/pause state
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && currentTrack?.preview) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const play = (track, newQueue = []) => {
    if (newQueue.length > 0) {
      setQueue(newQueue);
      const trackIndex = newQueue.findIndex(t => t.id === track.id);
      setCurrentIndex(trackIndex >= 0 ? trackIndex : 0);
    }
    
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const next = () => {
    if (queue.length > 0 && currentIndex < queue.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentTrack(queue[nextIndex]);
      setIsPlaying(true);
    } else {
      // End of queue
      setIsPlaying(false);
    }
  };

  const prev = () => {
    if (queue.length > 0 && currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentTrack(queue[prevIndex]);
      setIsPlaying(true);
    } else if (audioRef.current) {
      // Restart current track if at beginning
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const seek = (seconds) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  const setVolumeLevel = (newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
  };

  const value = {
    // State
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    queue,
    currentIndex,
    
    // Controls
    play,
    pause,
    next,
    prev,
    seek,
    setVolume: setVolumeLevel,
    
    // Backward compatibility
    playTrack: play,
    pauseTrack: pause,
    resumeTrack: () => setIsPlaying(true),
    stopTrack: () => {
      setCurrentTrack(null);
      setIsPlaying(false);
      setCurrentTime(0);
      setQueue([]);
      setCurrentIndex(0);
    },
    seekTo: seek,
    setCurrentTime,
    setDuration,
    audioRef
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
