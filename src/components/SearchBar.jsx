import { useState, useEffect, useCallback } from 'react';

export default function SearchBar({ onSearch, placeholder = "Search for tracks, artists, albums...", className = "" }) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchQuery) => {
      if (searchQuery.trim()) {
        setIsSearching(true);
        onSearch(searchQuery.trim()).finally(() => {
          setIsSearching(false);
        });
      } else {
        onSearch(''); // Clear search results
      }
    }, 300),
    [onSearch]
  );

  // Effect to trigger debounced search when query changes
  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsSearching(true);
      onSearch(query.trim()).finally(() => {
        setIsSearching(false);
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full bg-white/20 border border-white/30 rounded-lg pl-10 pr-12 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center">
          {isSearching && (
            <div className="mr-3">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white/70"></div>
            </div>
          )}
          
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="mr-3 text-white/70 hover:text-white transition-colors"
              title="Clear search"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
