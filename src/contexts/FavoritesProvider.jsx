import { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

const STORAGE_KEY = 'soundwave_favs';

// Helper functions for localStorage
const loadFavorites = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const favorites = JSON.parse(stored);
    
    // Migration: Add 'type' property to old favorites that don't have it
    const migratedFavorites = favorites.map(fav => {
      if (!fav.type) {
        // If it has artist and album properties, it's a track
        if (fav.title && (fav.artist || fav.album)) {
          const migratedTrack = { ...fav, type: 'track' };
          
          // Convert string artist to object if needed
          if (typeof fav.artist === 'string') {
            migratedTrack.artist = { name: fav.artist, id: null };
          }
          
          // Convert string album to object if needed
          if (typeof fav.album === 'string') {
            migratedTrack.album = { 
              title: fav.album, 
              id: null,
              cover_small: fav.cover || null,
              cover_medium: fav.cover || null
            };
          }
          
          return migratedTrack;
        }
        // If it has name and picture_medium, it's an artist
        if (fav.name && fav.picture_medium) {
          return { ...fav, type: 'artist' };
        }
        // If it has title and cover_medium, it's an album
        if (fav.title && fav.cover_medium) {
          return { ...fav, type: 'album' };
        }
        // Default to track
        return { ...fav, type: 'track' };
      }
      return fav;
    });
    
    return migratedFavorites;
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

  const addFavorite = (item, itemType = 'track') => {
    setFavorites(prev => {
      if (prev.find(fav => fav.id === item.id && fav.type === itemType)) {
        return prev; // Already in favorites
      }
      
      let favoriteItem;
      
      if (itemType === 'track') {
        favoriteItem = {
          id: item.id,
          type: 'track',
          title: item.title,
          artist: item.artist,
          album: item.album,
          preview: item.preview,
          duration: item.duration,
          addedAt: Date.now()
        };
      } else if (itemType === 'artist') {
        favoriteItem = {
          id: item.id,
          type: 'artist',
          name: item.name,
          picture_medium: item.picture_medium || item.picture_small,
          nb_fan: item.nb_fan,
          addedAt: Date.now()
        };
      } else if (itemType === 'album') {
        favoriteItem = {
          id: item.id,
          type: 'album',
          title: item.title,
          artist: item.artist,
          cover_medium: item.cover_medium || item.cover_small,
          addedAt: Date.now()
        };
      }
      
      return [...prev, favoriteItem];
    });
  };

  const removeFavorite = (id, type) => {
    setFavorites(prev => prev.filter(fav => !(fav.id === id && (!type || fav.type === type))));
  };

  const isFavorite = (id, type) => {
    return favorites.some(fav => fav.id === id && (!type || fav.type === type));
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
    removeFromFavorites: (id, type) => removeFavorite(id, type)
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
