import { useEffect, useState } from 'react';
import { searchTracks, getCharts } from '../lib/deezer';

export default function Home() {
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCharts = async () => {
      try {
        setLoading(true);
        const chartsData = await getCharts();
        setCharts(chartsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCharts();
  }, []);

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
        </div>

        {charts && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Top Tracks */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">🎵 Top Tracks</h2>
              <div className="space-y-3">
                {charts.tracks?.data?.slice(0, 5).map((track, index) => (
                  <div key={track.id} className="flex items-center space-x-3 text-white/90 hover:text-white transition-colors">
                    <span className="text-sm font-semibold w-6">{index + 1}</span>
                    <img src={track.album?.cover_small} alt={track.title} className="w-10 h-10 rounded" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{track.title}</p>
                      <p className="text-sm text-white/70 truncate">{track.artist?.name}</p>
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
