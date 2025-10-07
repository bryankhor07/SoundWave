import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTrack, getArtistTopTracks } from '../lib/deezer';
import { useFavorites } from '../contexts/FavoritesProvider';
import { usePlayer } from '../contexts/PlayerProvider';
import TrackCard from '../components/TrackCard';

export default function TrackDetails() {
  const { id } = useParams();
  const [track, setTrack] = useState(null);
  const [relatedTracks, setRelatedTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { play, pause, currentTrack, isPlaying } = usePlayer();

  const isCurrentTrack = currentTrack?.id === track?.id;
  const trackIsFavorite = track ? isFavorite(track.id) : false;

  useEffect(() => {
    const loadTrackAndRelated = async () => {
      try {
        setLoading(true);
        const trackData = await getTrack(id);
        setTrack(trackData);
        
        // Load related tracks from the same artist
        if (trackData.artist?.id) {
          try {
            const artistTracks = await getArtistTopTracks(trackData.artist.id, { limit: 9 });
            // Filter out the current track
            const related = artistTracks.data?.filter(t => t.id !== trackData.id).slice(0, 8) || [];
            setRelatedTracks(related);
          } catch (relatedErr) {
            console.warn('Failed to load related tracks:', relatedErr);
            setRelatedTracks([]);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadTrackAndRelated();
    }
  }, [id]);

  const handleFavoriteToggle = () => {
    if (trackIsFavorite) {
      removeFavorite(track.id);
    } else {
      addFavorite(track);
    }
  };

  const handlePlayPause = () => {
    if (isCurrentTrack && isPlaying) {
      pause();
    } else {
      play(track, [track, ...relatedTracks]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading track...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-red-300 mb-4">Error: {error}</p>
          <Link to="/" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors inline-block">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="mb-4">Track not found</p>
          <Link to="/" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors inline-block">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
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

          {/* Track Details */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Album Art */}
              <div className="text-center">
                <img 
                  src={track.album?.cover_xl || track.album?.cover_big} 
                  alt={track.title}
                  className="w-full max-w-sm mx-auto rounded-lg shadow-2xl"
                />
              </div>

              {/* Track Info */}
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-2">{track.title}</h1>
                <Link 
                  to={`/artist/${track.artist?.id}`}
                  className="text-2xl text-white/90 hover:text-white transition-colors mb-4 inline-block"
                >
                  {track.artist?.name}
                </Link>
                
                <Link 
                  to={`/album/${track.album?.id}`}
                  className="block text-lg text-white/80 hover:text-white transition-colors mb-6"
                >
                  From: {track.album?.title}
                </Link>

                {/* Action Buttons */}
                <div className="flex items-center space-x-4 mb-6">
                  <button
                    onClick={handlePlayPause}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                    disabled={!track.preview}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      {isCurrentTrack && isPlaying ? (
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                      ) : (
                        <path d="M8 5v14l11-7z"/>
                      )}
                    </svg>
                    <span>{isCurrentTrack && isPlaying ? 'Pause' : 'Play'}</span>
                  </button>

                  <button
                    onClick={handleFavoriteToggle}
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2 ${
                      trackIsFavorite 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-white/20 hover:bg-white/30 text-white'
                    }`}
                  >
                    <svg className="w-5 h-5" fill={trackIsFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>{trackIsFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
                  </button>
                </div>

                {/* Track Details */}
                <div className="space-y-2 text-white/80">
                  <p><span className="font-semibold">Duration:</span> {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}</p>
                  <p><span className="font-semibold">Release Date:</span> {track.release_date}</p>
                  {track.bpm && <p><span className="font-semibold">BPM:</span> {track.bpm}</p>}
                  {track.rank && <p><span className="font-semibold">Popularity:</span> {track.rank.toLocaleString()}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Related Tracks Section */}
          {relatedTracks.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                More from {track.artist?.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {relatedTracks.map((relatedTrack) => (
                  <TrackCard 
                    key={relatedTrack.id} 
                    track={relatedTrack}
                    currentList={[track, ...relatedTracks]}
                    showAlbum={true}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
