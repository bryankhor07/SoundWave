import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArtist, getArtistTopTracks, getArtistAlbums } from '../lib/deezer';
import TrackCard from '../components/TrackCard';
import AlbumCard from '../components/AlbumCard';

export default function ArtistDetails() {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadArtistData = async () => {
      try {
        setLoading(true);
        const artistData = await getArtist(id);
        setArtist(artistData);
        
        // Load top tracks and albums in parallel
        const [tracksData, albumsData] = await Promise.allSettled([
          getArtistTopTracks(id, { limit: 8 }),
          getArtistAlbums(id, { limit: 8 })
        ]);
        
        if (tracksData.status === 'fulfilled') {
          setTopTracks(tracksData.value.data || []);
        } else {
          console.warn('Failed to load top tracks:', tracksData.reason);
        }
        
        if (albumsData.status === 'fulfilled') {
          setAlbums(albumsData.value.data || []);
        } else {
          console.warn('Failed to load albums:', albumsData.reason);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadArtistData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading artist...</p>
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

  if (!artist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="mb-4">Artist not found</p>
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

          {/* Artist Details */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
            <div className="text-center mb-8">
              <img 
                src={artist.picture_xl || artist.picture_big} 
                alt={artist.name}
                className="w-48 h-48 mx-auto rounded-full shadow-2xl mb-6"
              />
              <h1 className="text-5xl font-bold text-white mb-4">{artist.name}</h1>
              <p className="text-xl text-white/80 mb-2">{artist.nb_fan?.toLocaleString()} fans</p>
              {artist.nb_album && (
                <p className="text-lg text-white/70">{artist.nb_album} albums</p>
              )}
            </div>

            {/* Artist Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-white">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold">{artist.nb_fan?.toLocaleString() || 'N/A'}</div>
                <div className="text-white/70">Fans</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold">{artist.nb_album || 'N/A'}</div>
                <div className="text-white/70">Albums</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold">
                  {artist.link ? (
                    <a 
                      href={artist.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-300 hover:text-purple-200 transition-colors"
                    >
                      Deezer ↗
                    </a>
                  ) : 'N/A'}
                </div>
                <div className="text-white/70">Profile</div>
              </div>
            </div>

          </div>

          {/* Top Tracks Section */}
          {topTracks.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-6">Top Tracks</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {topTracks.map((track) => (
                  <TrackCard 
                    key={track.id} 
                    track={track}
                    currentList={topTracks}
                    showArtist={false}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Albums Section */}
          {albums.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-6">Albums</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {albums.map((album) => (
                  <AlbumCard 
                    key={album.id} 
                    album={album}
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
