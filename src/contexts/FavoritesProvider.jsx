import { createContext, useContext, useState } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  const addToFavorites = (item) => {
    setFavorites(prev => {
      if (prev.find(fav => fav.id === item.id && fav.type === item.type)) {
        return prev; // Already in favorites
      }
      return [...prev, { ...item, addedAt: Date.now() }];
    });
  };

  const removeFromFavorites = (id, type) => {
    setFavorites(prev => prev.filter(fav => !(fav.id === id && fav.type === type)));
  };

  const isFavorite = (id, type) => {
    return favorites.some(fav => fav.id === id && fav.type === type);
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite
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
