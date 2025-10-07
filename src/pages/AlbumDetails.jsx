import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAlbum } from '../lib/deezer';
import { usePlayer } from '../contexts/PlayerProvider';
import { useFavorites } from '../contexts/FavoritesProvider';
import { DetailPageSkeleton } from '../components/LoadingSkeleton';

export default function AlbumDetails() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { play, pause, currentTrack, isPlaying } = usePlayer();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const loadAlbum = async () => {
      try {
        setLoading(true);
        const albumData = await getAlbum(id);
        setAlbum(albumData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadAlbum();
    }
  }, [id]);

  if (loading) {
    return <DetailPageSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center" role="main">
        <div className="text-white text-center">
          <p className="text-red-300 mb-4" role="alert">Error: {error}</p>
          <Link to="/" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors inline-block" aria-label="Return to home page">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="mb-4">Album not found</p>
          <Link to="/" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors inline-block">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const totalDuration = album.tracks?.data?.reduce((total, track) => total + track.duration, 0) || 0;
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500" role="main">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link 
            to="/" 
            className="inline-flex items-center text-white/90 hover:text-white mb-8 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>

          {/* Album Header */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Album Art */}
              <div className="text-center">
                <img 
                  src={album.cover_xl || album.cover_big} 
                  alt={`Album cover for ${album.title} by ${album.artist?.name || 'Unknown Artist'}`}
                  className="w-full max-w-sm mx-auto rounded-lg shadow-2xl"
                />
              </div>

              {/* Album Info */}
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-2">{album.title}</h1>
                <Link 
                  to={`/artist/${album.artist?.id}`}
                  className="text-2xl text-white/90 hover:text-white transition-colors mb-4 inline-block"
                >
                  {album.artist?.name}
                </Link>
                
                <div className="space-y-2 text-white/80 mb-6">
                  <p><span className="font-semibold">Release Date:</span> {album.release_date}</p>
                  <p><span className="font-semibold">Tracks:</span> {album.nb_tracks}</p>
                  <p><span className="font-semibold">Duration:</span> {formatDuration(totalDuration)}</p>
                  {album.genre_id && <p><span className="font-semibold">Genre:</span> {album.genres?.data?.[0]?.name || 'Unknown'}</p>}
                  {album.fans && <p><span className="font-semibold">Fans:</span> {album.fans.toLocaleString()}</p>}
                </div>

                {album.link && (
                  <a 
                    href={album.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2"
                  >
                    <span>Listen on Deezer</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Track List */}
          {album.tracks?.data && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Tracks</h2>
              <div className="space-y-2">
                {album.tracks.data.map((track, index) => {
                  const isCurrentTrack = currentTrack?.id === track.id;
                  const trackIsFavorite = isFavorite(track.id);
                  
                  const handlePlayPause = (e) => {
                    e.preventDefault();
                    if (isCurrentTrack && isPlaying) {
                      pause();
                    } else {
                      play(track, album.tracks.data);
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
                  
                  return (
                    <div
                      key={track.id}
                      className={`flex items-center space-x-4 p-3 rounded-lg transition-colors text-white/90 group ${
                        isCurrentTrack ? 'bg-white/20' : 'hover:bg-white/10'
                      }`}
                    >
                      <span className="text-sm font-semibold w-8 text-center text-white/60 group-hover:text-white/80">
                        {index + 1}
                      </span>
                      
                      <button
                        onClick={handlePlayPause}
                        className="p-2 rounded-full hover:bg-white/20 transition-colors"
                        title={isCurrentTrack && isPlaying ? 'Pause' : 'Play'}
                      >
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          {isCurrentTrack && isPlaying ? (
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                          ) : (
                            <path d="M8 5v14l11-7z"/>
                          )}
                        </svg>
                      </button>
                      
                      <Link
                        to={`/track/${track.id}`}
                        className="flex-1 min-w-0 hover:text-white"
                      >
                        <p className="font-medium truncate">{track.title}</p>
                        <p className="text-sm text-white/70 truncate">{track.artist?.name}</p>
                      </Link>
                      
                      <div className="text-sm text-white/60 group-hover:text-white/80">
                        {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                      </div>
                      
                      <button
                        onClick={handleFavoriteToggle}
                        className={`p-2 rounded-full hover:bg-white/20 transition-colors ${
                          trackIsFavorite ? 'text-red-400' : 'text-white/60 hover:text-white'
                        }`}
                        title={trackIsFavorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <svg className="w-4 h-4" fill={trackIsFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
