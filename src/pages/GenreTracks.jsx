import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { getGenreArtists, getGenreTracks } from '../lib/deezer';
import TrackCard from '../components/TrackCard';
import { TrackCardSkeleton, ArtistCardSkeleton } from '../components/LoadingSkeleton';

export default function GenreTracks() {
  const { id } = useParams();
  const location = useLocation();
  const genreName = location.state?.genreName || 'Genre';
  
  const [tracks, setTracks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [activeTab, setActiveTab] = useState('tracks'); // 'tracks' or 'artists'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGenreData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load both tracks and artists in parallel
        const [tracksResult, artistsResult] = await Promise.allSettled([
          getGenreTracks(id, { limit: 24 }),
          getGenreArtists(id, { limit: 24 })
        ]);
        
        if (tracksResult.status === 'fulfilled') {
          setTracks(tracksResult.value.data || []);
        } else {
          console.warn('Failed to load genre tracks:', tracksResult.reason);
        }
        
        if (artistsResult.status === 'fulfilled') {
          setArtists(artistsResult.value.data || []);
        } else {
          console.warn('Failed to load genre artists:', artistsResult.reason);
        }
        
        // If both failed, show error
        if (tracksResult.status === 'rejected' && artistsResult.status === 'rejected') {
          setError('Failed to load genre content');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadGenreData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500" role="main" aria-busy="true" aria-label="Loading genre content">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="h-6 bg-white/20 rounded w-32 mb-8 animate-pulse"></div>
            <div className="h-10 bg-white/20 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-6 bg-white/20 rounded w-64 mb-8 animate-pulse"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <TrackCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && tracks.length === 0 && artists.length === 0) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500" role="main">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
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

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">{genreName}</h1>
            <p className="text-white/80">Discover top tracks and artists</p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('tracks')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === 'tracks'
                  ? 'bg-white text-purple-600'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Top Tracks {tracks.length > 0 && `(${tracks.length})`}
            </button>
            <button
              onClick={() => setActiveTab('artists')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === 'artists'
                  ? 'bg-white text-purple-600'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Top Artists {artists.length > 0 && `(${artists.length})`}
            </button>
          </div>

          {/* Content */}
          {activeTab === 'tracks' && (
            <div>
              {tracks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {tracks.map((track) => (
                    <TrackCard 
                      key={track.id} 
                      track={track}
                      currentList={tracks}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-white/70">
                  <p>No tracks available for this genre</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'artists' && (
            <div>
              {artists.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {artists.map((artist) => (
                    <Link
                      key={artist.id}
                      to={`/artist/${artist.id}`}
                      className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all duration-200 group"
                    >
                      <div className="relative">
                        <div className="relative aspect-square mb-3 overflow-hidden rounded-full">
                          <img 
                            src={artist.picture_medium || artist.picture_small} 
                            alt={`Photo of ${artist.name}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                        <h3 className="font-semibold text-white text-center truncate group-hover:text-purple-300 transition-colors">
                          {artist.name}
                        </h3>
                        {artist.nb_fan && (
                          <p className="text-xs text-white/60 text-center mt-1">
                            {artist.nb_fan.toLocaleString()} fans
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-white/70">
                  <p>No artists available for this genre</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
