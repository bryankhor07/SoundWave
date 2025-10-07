import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGenres } from '../lib/deezer';
import GenreCard from './GenreCard';

export default function GenreGrid({ limit = 6, className = "" }) {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadGenres = async () => {
      try {
        setLoading(true);
        const genresData = await getGenres();
        // Filter out 'All' genre (id 0) and limit the results
        const filteredGenres = genresData.data?.filter(g => g.id !== 0).slice(0, limit) || [];
        setGenres(filteredGenres);
      } catch (err) {
        setError(err.message);
        console.error('Failed to load genres:', err);
      } finally {
        setLoading(false);
      }
    };

    loadGenres();
  }, [limit]);

  const handleGenreClick = (genre) => {
    navigate(`/genre/${genre.id}`, { state: { genreName: genre.name } });
  };

  if (loading) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
        <p className="text-white/70">Loading genres...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-red-300">Failed to load genres</p>
      </div>
    );
  }

  if (genres.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-white/70">No genres available</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 ${className}`}>
      {genres.map((genre) => (
        <GenreCard 
          key={genre.id} 
          genre={genre}
          onClick={handleGenreClick}
        />
      ))}
    </div>
  );
}
