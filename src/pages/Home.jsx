import { useEffect, useState } from 'react';
import { searchTracks, getCharts } from '../lib/deezer';
import { usePlayer } from '../contexts/PlayerProvider';
import { useFavorites } from '../contexts/FavoritesProvider';

export default function Home() {
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { play, pause, next, prev, isPlaying, currentTrack, volume, setVolume, currentTime, duration } = usePlayer();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const loadCharts = async () => {
      try {
        setLoading(true);
        const chartsData = await getCharts();
        setCharts(chartsData);
        
        // Check if we're using mock data (no error thrown but limited data)
        if (chartsData.tracks?.data?.length === 3 && chartsData.tracks.data[0].title === "Harder Better Faster Stronger") {
          console.log('Using mock data - API unavailable');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCharts();
  }, []);

  const handlePlayTrack = (track, trackList = []) => {
    if (currentTrack?.id === track.id && isPlaying) {
      pause();
    } else {
      play(track, trackList);
    }
  };

  const handleFavoriteToggle = (track) => {
    if (isFavorite(track.id)) {
      removeFavorite(track.id);
    } else {
      addFavorite(track);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading charts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-red-300 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Discover Music</h1>
          <p className="text-xl text-white/90">Explore trending tracks, artists, and albums</p>
          
          {/* Demo Player Controls */}
          {currentTrack && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mt-8 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-white mb-4">Now Playing</h3>
              <div className="flex items-center space-x-3 mb-4">
                <img src={currentTrack.album?.cover_small} alt={currentTrack.title} className="w-12 h-12 rounded" />
                <div className="flex-1 text-left">
                  <p className="font-medium text-white truncate">{currentTrack.title}</p>
                  <p className="text-sm text-white/70 truncate">{currentTrack.artist?.name}</p>
                </div>
                <button
                  onClick={() => handleFavoriteToggle(currentTrack)}
                  className={`p-2 rounded-full transition-colors ${
                    isFavorite(currentTrack.id) ? 'text-red-400 hover:text-red-300' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <svg className="w-5 h-5" fill={isFavorite(currentTrack.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-white/70 mb-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-purple-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Controls */}
              <div className="flex items-center justify-center space-x-4 mb-4">
                <button onClick={prev} className="text-white/80 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                  </svg>
                </button>
                <button 
                  onClick={() => isPlaying ? pause() : play(currentTrack)}
                  className="bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    {isPlaying ? (
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                    ) : (
                      <path d="M8 5v14l11-7z"/>
                    )}
                  </svg>
                </button>
                <button onClick={next} className="text-white/80 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                  </svg>
                </button>
              </div>
              
              {/* Volume Control */}
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                </svg>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs text-white/70 w-8">{Math.round(volume * 100)}</span>
              </div>
            </div>
          )}
        </div>

        {charts && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Top Tracks */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">🎵 Top Tracks</h2>
              <div className="space-y-3">
                {charts.tracks?.data?.slice(0, 5).map((track, index) => (
                  <div key={track.id} className="flex items-center space-x-3 text-white/90 hover:text-white transition-colors group">
                    <span className="text-sm font-semibold w-6">{index + 1}</span>
                    <img src={track.album?.cover_small} alt={track.title} className="w-10 h-10 rounded" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{track.title}</p>
                      <p className="text-sm text-white/70 truncate">{track.artist?.name}</p>
                    </div>
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handlePlayTrack(track, charts.tracks?.data?.slice(0, 10) || [])}
                        className="p-2 rounded-full bg-purple-500 hover:bg-purple-600 text-white transition-colors"
                        title={currentTrack?.id === track.id && isPlaying ? 'Pause' : 'Play'}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          {currentTrack?.id === track.id && isPlaying ? (
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                          ) : (
                            <path d="M8 5v14l11-7z"/>
                          )}
                        </svg>
                      </button>
                      <button
                        onClick={() => handleFavoriteToggle(track)}
                        className={`p-2 rounded-full transition-colors ${
                          isFavorite(track.id) ? 'text-red-400 hover:text-red-300' : 'text-white/60 hover:text-white'
                        }`}
                        title={isFavorite(track.id) ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <svg className="w-4 h-4" fill={isFavorite(track.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Artists */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">🎤 Top Artists</h2>
              <div className="space-y-3">
                {charts.artists?.data?.slice(0, 5).map((artist, index) => (
                  <div key={artist.id} className="flex items-center space-x-3 text-white/90 hover:text-white transition-colors">
                    <span className="text-sm font-semibold w-6">{index + 1}</span>
                    <img src={artist.picture_small} alt={artist.name} className="w-10 h-10 rounded-full" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{artist.name}</p>
                      <p className="text-sm text-white/70">{artist.nb_fan?.toLocaleString()} fans</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Albums */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">💿 Top Albums</h2>
              <div className="space-y-3">
                {charts.albums?.data?.slice(0, 5).map((album, index) => (
                  <div key={album.id} className="flex items-center space-x-3 text-white/90 hover:text-white transition-colors">
                    <span className="text-sm font-semibold w-6">{index + 1}</span>
                    <img src={album.cover_small} alt={album.title} className="w-10 h-10 rounded" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{album.title}</p>
                      <p className="text-sm text-white/70 truncate">{album.artist?.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
