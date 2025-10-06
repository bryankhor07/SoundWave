export default function GenreCard({ genre, onClick, className = "" }) {
  const handleClick = () => {
    if (onClick) {
      onClick(genre);
    }
  };

  return (
    <button 
      onClick={handleClick}
      className={`bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all duration-200 group w-full text-left ${className}`}
    >
      <div className="relative">
        {/* Genre Image */}
        <div className="relative aspect-square mb-3 overflow-hidden rounded-lg">
          <img 
            src={genre.picture_medium || genre.picture_small || '/placeholder-genre.jpg'} 
            alt={genre.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          {/* Genre Name Overlay */}
          <div className="absolute bottom-2 left-2 right-2">
            <h3 className="font-bold text-white text-sm group-hover:text-purple-300 transition-colors truncate">
              {genre.name}
            </h3>
          </div>
        </div>
      </div>
    </button>
  );
}
