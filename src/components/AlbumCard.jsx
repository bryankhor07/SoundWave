import { Link } from 'react-router-dom';

export default function AlbumCard({ album, className = "" }) {
  return (
    <Link 
      to={`/album/${album.id}`}
      className={`bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all duration-200 group block ${className}`}
    >
      <div className="relative">
        {/* Album Cover */}
        <div className="relative aspect-square mb-3 overflow-hidden rounded-lg">
          <img 
            src={album.cover_medium || album.cover_small || '/placeholder-album.jpg'} 
            alt={album.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
              View Album
            </div>
          </div>
        </div>

        {/* Album Info */}
        <div className="space-y-1">
          <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors truncate" title={album.title}>
            {album.title}
          </h3>
          
          {album.artist && (
            <p className="text-sm text-white/80 group-hover:text-white transition-colors truncate" title={album.artist.name}>
              {album.artist.name}
            </p>
          )}
          
          {album.release_date && (
            <p className="text-xs text-white/60">
              {new Date(album.release_date).getFullYear()}
            </p>
          )}
          
          {album.nb_tracks && (
            <p className="text-xs text-white/60">
              {album.nb_tracks} track{album.nb_tracks !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
