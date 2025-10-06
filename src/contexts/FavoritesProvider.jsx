import { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

const STORAGE_KEY = 'tunefind_favs';

// Helper functions for localStorage
const loadFavorites = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading favorites from localStorage:', error);
    return [];
  }
};

const saveFavorites = (favorites) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
  }
};

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(loadFavorites);

  // Save to localStorage whenever favorites change
  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  const addFavorite = (track) => {
    setFavorites(prev => {
      if (prev.find(fav => fav.id === track.id)) {
        return prev; // Already in favorites
      }
      const favoriteTrack = {
        id: track.id,
        title: track.title,
        artist: track.artist?.name || 'Unknown Artist',
        album: track.album?.title || 'Unknown Album',
        cover: track.album?.cover_medium || track.album?.cover_small,
        preview: track.preview,
        duration: track.duration,
        addedAt: Date.now()
      };
      return [...prev, favoriteTrack];
    });
  };

  const removeFavorite = (id) => {
    setFavorites(prev => prev.filter(fav => fav.id !== id));
  };

  const isFavorite = (id) => {
    return favorites.some(fav => fav.id === id);
  };

  const favoritesList = favorites;

  const value = {
    favorites: favoritesList,
    favoritesList,
    addFavorite,
    removeFavorite,
    isFavorite,
    // Keep backward compatibility
    addToFavorites: addFavorite,
    removeFromFavorites: (id) => removeFavorite(id)
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
