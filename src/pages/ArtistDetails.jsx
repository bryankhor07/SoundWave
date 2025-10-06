import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArtist } from '../lib/deezer';

export default function ArtistDetails() {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadArtist = async () => {
      try {
        setLoading(true);
        const artistData = await getArtist(id);
        setArtist(artistData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadArtist();
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

            {/* Placeholder for future features */}
            <div className="mt-8 text-center text-white/70">
              <p className="mb-4">More artist details coming soon...</p>
              <div className="space-y-2">
                <p>• Top tracks</p>
                <p>• Albums discography</p>
                <p>• Related artists</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
