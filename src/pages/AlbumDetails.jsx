import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAlbum } from '../lib/deezer';

export default function AlbumDetails() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading album...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500">
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
                  alt={album.title}
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
                {album.tracks.data.map((track, index) => (
                  <Link
                    key={track.id}
                    to={`/track/${track.id}`}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/10 transition-colors text-white/90 hover:text-white group"
                  >
                    <span className="text-sm font-semibold w-8 text-center text-white/60 group-hover:text-white/80">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{track.title}</p>
                      <p className="text-sm text-white/70 truncate">{track.artist?.name}</p>
                    </div>
                    <div className="text-sm text-white/60 group-hover:text-white/80">
                      {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                    </div>
                    {track.preview && (
                      <div className="text-white/60 group-hover:text-white/80">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
