import { Link } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoritesProvider';

export default function Favorites() {
  const { favorites, removeFromFavorites } = useFavorites();

  const groupedFavorites = favorites.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {});

  const handleRemove = (id, type) => {
    removeFromFavorites(id, type);
  };

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">💔</div>
          <h1 className="text-3xl font-bold mb-4">No Favorites Yet</h1>
          <p className="text-xl text-white/80 mb-8">Start exploring music and add your favorites!</p>
          <Link 
            to="/" 
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
          >
            Discover Music
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">Your Favorites</h1>
            <p className="text-xl text-white/90">{favorites.length} items in your collection</p>
          </div>

          <div className="space-y-8">
            {/* Tracks */}
            {groupedFavorites.track && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="mr-2">🎵</span>
                  Favorite Tracks ({groupedFavorites.track.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedFavorites.track.map((track) => (
                    <div key={track.id} className="bg-white/10 rounded-lg p-4 group hover:bg-white/20 transition-colors">
                      <div className="flex items-start space-x-3">
                        <img 
                          src={track.album?.cover_small} 
                          alt={track.title}
                          className="w-12 h-12 rounded flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <Link 
                            to={`/track/${track.id}`}
                            className="font-medium text-white hover:text-purple-300 transition-colors block truncate"
                          >
                            {track.title}
                          </Link>
                          <Link 
                            to={`/artist/${track.artist?.id}`}
                            className="text-sm text-white/70 hover:text-white/90 transition-colors block truncate"
                          >
                            {track.artist?.name}
                          </Link>
                          <p className="text-xs text-white/50 mt-1">
                            Added {new Date(track.addedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemove(track.id, 'track')}
                          className="text-white/60 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                          title="Remove from favorites"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Artists */}
            {groupedFavorites.artist && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="mr-2">🎤</span>
                  Favorite Artists ({groupedFavorites.artist.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {groupedFavorites.artist.map((artist) => (
                    <div key={artist.id} className="bg-white/10 rounded-lg p-4 text-center group hover:bg-white/20 transition-colors">
                      <img 
                        src={artist.picture_medium} 
                        alt={artist.name}
                        className="w-16 h-16 rounded-full mx-auto mb-3"
                      />
                      <Link 
                        to={`/artist/${artist.id}`}
                        className="font-medium text-white hover:text-purple-300 transition-colors block truncate"
                      >
                        {artist.name}
                      </Link>
                      <p className="text-xs text-white/50 mt-1">
                        Added {new Date(artist.addedAt).toLocaleDateString()}
                      </p>
                      <button
                        onClick={() => handleRemove(artist.id, 'artist')}
                        className="mt-2 text-white/60 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove from favorites"
                      >
                        <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Albums */}
            {groupedFavorites.album && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="mr-2">💿</span>
                  Favorite Albums ({groupedFavorites.album.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedFavorites.album.map((album) => (
                    <div key={album.id} className="bg-white/10 rounded-lg p-4 group hover:bg-white/20 transition-colors">
                      <div className="flex items-start space-x-3">
                        <img 
                          src={album.cover_medium} 
                          alt={album.title}
                          className="w-12 h-12 rounded flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <Link 
                            to={`/album/${album.id}`}
                            className="font-medium text-white hover:text-purple-300 transition-colors block truncate"
                          >
                            {album.title}
                          </Link>
                          <Link 
                            to={`/artist/${album.artist?.id}`}
                            className="text-sm text-white/70 hover:text-white/90 transition-colors block truncate"
                          >
                            {album.artist?.name}
                          </Link>
                          <p className="text-xs text-white/50 mt-1">
                            Added {new Date(album.addedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemove(album.id, 'album')}
                          className="text-white/60 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                          title="Remove from favorites"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
