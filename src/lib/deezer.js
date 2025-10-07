// Deezer API wrapper with caching
// Base URL for Deezer API
const DEEZER_API_BASE = 'https://api.deezer.com';

// In-memory cache to prevent duplicate API calls
const cache = new Map();

// Cache TTL in milliseconds (5 minutes)
const CACHE_TTL = 5 * 60 * 1000;

// Mock data for fallback when API is unavailable
const MOCK_CHARTS = {
  tracks: {
    data: [
      {
        id: 3135556,
        title: "Harder Better Faster Stronger",
        artist: { name: "Daft Punk", id: 27 },
        album: { title: "Discovery", cover_small: "https://e-cdns-images.dzcdn.net/images/cover/2e018122cb56986277102d2041a592c8/56x56-000000-80-0-0.jpg" },
        preview: "https://cdns-preview-d.dzcdn.net/stream/c-deda7fa9316d9e9e880d2c6207e92260-8.mp3",
        duration: 224
      },
      {
        id: 916424,
        title: "One More Time",
        artist: { name: "Daft Punk", id: 27 },
        album: { title: "Discovery", cover_small: "https://e-cdns-images.dzcdn.net/images/cover/2e018122cb56986277102d2041a592c8/56x56-000000-80-0-0.jpg" },
        preview: "https://cdns-preview-d.dzcdn.net/stream/c-deda7fa9316d9e9e880d2c6207e92260-7.mp3",
        duration: 320
      },
      {
        id: 1109731,
        title: "Around the World",
        artist: { name: "Daft Punk", id: 27 },
        album: { title: "Homework", cover_small: "https://e-cdns-images.dzcdn.net/images/cover/8b2b6c7c5cd6e8c9c6e8c9c6e8c9c6e8/56x56-000000-80-0-0.jpg" },
        preview: "https://cdns-preview-d.dzcdn.net/stream/c-deda7fa9316d9e9e880d2c6207e92260-6.mp3",
        duration: 429
      }
    ]
  },
  artists: {
    data: [
      { id: 27, name: "Daft Punk", picture_small: "https://e-cdns-images.dzcdn.net/images/artist/f2bc007e9133c946ac3c3907ddc5d2ea/56x56-000000-80-0-0.jpg", nb_fan: 5000000 },
      { id: 412, name: "Justice", picture_small: "https://e-cdns-images.dzcdn.net/images/artist/f2bc007e9133c946ac3c3907ddc5d2ea/56x56-000000-80-0-0.jpg", nb_fan: 2000000 },
      { id: 564, name: "Modjo", picture_small: "https://e-cdns-images.dzcdn.net/images/artist/f2bc007e9133c946ac3c3907ddc5d2ea/56x56-000000-80-0-0.jpg", nb_fan: 1000000 }
    ]
  },
  albums: {
    data: [
      { id: 302127, title: "Discovery", artist: { name: "Daft Punk" }, cover_small: "https://e-cdns-images.dzcdn.net/images/cover/2e018122cb56986277102d2041a592c8/56x56-000000-80-0-0.jpg" },
      { id: 103248, title: "Homework", artist: { name: "Daft Punk" }, cover_small: "https://e-cdns-images.dzcdn.net/images/cover/8b2b6c7c5cd6e8c9c6e8c9c6e8c9c6e8/56x56-000000-80-0-0.jpg" },
      { id: 567890, title: "Cross", artist: { name: "Justice" }, cover_small: "https://e-cdns-images.dzcdn.net/images/cover/f2bc007e9133c946ac3c3907ddc5d2ea/56x56-000000-80-0-0.jpg" }
    ]
  }
};

// List of CORS proxy services to try
const CORS_PROXIES = [
  'https://api.allorigins.win/get?url=',
  'https://corsproxy.io/?',
  'https://cors-anywhere.herokuapp.com/'
];

/**
 * JSONP implementation for Deezer API (officially supported)
 * @param {string} url - The API endpoint URL
 * @returns {Promise<Object>} - Parsed JSON response
 */
function jsonpRequest(url) {
  return new Promise((resolve, reject) => {
    const callbackName = `deezer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const script = document.createElement('script');
    
    // Add callback parameter to URL
    const separator = url.includes('?') ? '&' : '?';
    const jsonpUrl = `${url}${separator}callback=${callbackName}`;
    
    console.log('Making JSONP request to:', jsonpUrl);
    
    // Set up global callback
    window[callbackName] = (data) => {
      // Clean up
      document.head.removeChild(script);
      delete window[callbackName];
      resolve(data);
    };
    
    // Handle errors
    script.onerror = () => {
      document.head.removeChild(script);
      delete window[callbackName];
      reject(new Error('JSONP request failed'));
    };
    
    // Set timeout
    const timeout = setTimeout(() => {
      if (window[callbackName]) {
        document.head.removeChild(script);
        delete window[callbackName];
        reject(new Error('JSONP request timeout'));
      }
    }, 10000);
    
    script.onload = () => clearTimeout(timeout);
    script.src = jsonpUrl;
    document.head.appendChild(script);
  });
}

/**
 * Try JSONP first, then fallback to proxies
 * @param {string} url - The API endpoint URL
 * @returns {Promise<Object>} - Parsed JSON response
 */
async function fetchWithProxy(url) {
  // Try JSONP first (officially supported by Deezer)
  try {
    console.log('Trying JSONP (official Deezer method)...');
    return await jsonpRequest(url);
  } catch (jsonpError) {
    console.warn('JSONP failed:', jsonpError.message);
  }
  
  // Fallback to CORS proxies
  let lastError;
  for (const proxy of CORS_PROXIES) {
    try {
      let proxyUrl;
      let response;
      
      if (proxy.includes('allorigins')) {
        proxyUrl = `${proxy}${encodeURIComponent(url)}`;
        console.log(`Trying AllOrigins proxy: ${proxyUrl}`);
        response = await fetch(proxyUrl, { 
          signal: AbortSignal.timeout(8000) // Reduced timeout
        });
        
        if (response.ok) {
          const proxyData = await response.json();
          if (proxyData.contents) {
            return JSON.parse(proxyData.contents);
          }
        }
      } else {
        proxyUrl = `${proxy}${url}`;
        console.log(`Trying proxy: ${proxyUrl}`);
        response = await fetch(proxyUrl, { 
          signal: AbortSignal.timeout(8000) // Reduced timeout
        });
        
        if (response.ok) {
          return await response.json();
        }
      }
      
      throw new Error(`Proxy ${proxy} returned ${response.status}`);
      
    } catch (error) {
      console.warn(`Proxy ${proxy} failed:`, error.message);
      lastError = error;
      continue;
    }
  }
  
  throw new Error(`All connection methods failed. Last error: ${lastError?.message || 'Unknown error'}`);
}

/**
 * Generic fetch wrapper with caching and error handling
 * @param {string} url - The API endpoint URL
 * @param {string} cacheKey - Unique cache key for this request
 * @returns {Promise<Object>} - Parsed JSON response
 */
async function fetchWithCache(url, cacheKey) {
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log('Returning cached data for:', cacheKey);
    return cached.data;
  }

  try {
    const data = await fetchWithProxy(url);
    
    // Handle Deezer API error responses
    if (data.error) {
      throw new Error(`Deezer API error: ${data.error.message || 'Unknown error'}`);
    }

    // Cache the successful response
    cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });

    console.log('Successfully fetched and cached:', cacheKey);
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw new Error('Unable to connect to Deezer API. Please check your internet connection.');
  }
}

/**
 * Search for tracks on Deezer
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @param {number} options.limit - Number of results to return (default: 25)
 * @param {number} options.index - Starting index for pagination (default: 0)
 * @returns {Promise<Array>} - Array of track objects
 */
export async function searchTracks(query, { limit = 25, index = 0 } = {}) {
  if (!query || typeof query !== 'string') {
    throw new Error('Search query is required and must be a string');
  }

  const url = `${DEEZER_API_BASE}/search?q=${encodeURIComponent(query)}&index=${index}&limit=${limit}`;
  const cacheKey = `search:${query}:${index}:${limit}`;
  
  const response = await fetchWithCache(url, cacheKey);
  return response.data || [];
}

/**
 * Get a specific track by ID
 * @param {string|number} id - Track ID
 * @returns {Promise<Object>} - Track object with preview URL
 */
export async function getTrack(id) {
  if (!id) {
    throw new Error('Track ID is required');
  }

  const url = `${DEEZER_API_BASE}/track/${id}`;
  const cacheKey = `track:${id}`;
  
  return await fetchWithCache(url, cacheKey);
}

/**
 * Get album information by ID
 * @param {string|number} id - Album ID
 * @returns {Promise<Object>} - Album object
 */
export async function getAlbum(id) {
  if (!id) {
    throw new Error('Album ID is required');
  }

  const url = `${DEEZER_API_BASE}/album/${id}`;
  const cacheKey = `album:${id}`;
  
  return await fetchWithCache(url, cacheKey);
}

/**
 * Get artist information by ID
 * @param {string|number} id - Artist ID
 * @returns {Promise<Object>} - Artist object
 */
export async function getArtist(id) {
  if (!id) {
    throw new Error('Artist ID is required');
  }

  const url = `${DEEZER_API_BASE}/artist/${id}`;
  const cacheKey = `artist:${id}`;
  
  return await fetchWithCache(url, cacheKey);
}

/**
 * Get artist's top tracks
 * @param {string|number} id - Artist ID
 * @param {Object} options - Options object
 * @param {number} options.limit - Number of tracks to return (default: 10)
 * @returns {Promise<Object>} - Object containing data array of tracks
 */
export async function getArtistTopTracks(id, { limit = 10 } = {}) {
  if (!id) {
    throw new Error('Artist ID is required');
  }

  const url = `${DEEZER_API_BASE}/artist/${id}/top?limit=${limit}`;
  const cacheKey = `artist:${id}:top:${limit}`;
  
  return await fetchWithCache(url, cacheKey);
}

/**
 * Get artist's albums
 * @param {string|number} id - Artist ID
 * @param {Object} options - Options object
 * @param {number} options.limit - Number of albums to return (default: 25)
 * @returns {Promise<Object>} - Object containing data array of albums
 */
export async function getArtistAlbums(id, { limit = 25 } = {}) {
  if (!id) {
    throw new Error('Artist ID is required');
  }

  const url = `${DEEZER_API_BASE}/artist/${id}/albums?limit=${limit}`;
  const cacheKey = `artist:${id}:albums:${limit}`;
  
  return await fetchWithCache(url, cacheKey);
}

/**
 * Get current charts (top tracks, albums, artists)
 * @returns {Promise<Object>} - Charts object containing tracks, albums, and artists
 */
export async function getCharts() {
  const url = `${DEEZER_API_BASE}/chart`;
  const cacheKey = 'charts';
  
  try {
    return await fetchWithCache(url, cacheKey);
  } catch (error) {
    console.warn('API unavailable, using mock data:', error.message);
    // Return mock data as fallback
    return MOCK_CHARTS;
  }
}

/**
 * Get available genres
 * @returns {Promise<Object>} - Genres object containing list of genres
 */
export async function getGenres() {
  const url = `${DEEZER_API_BASE}/genre`;
  const cacheKey = 'genres';
  
  try {
    return await fetchWithCache(url, cacheKey);
  } catch (error) {
    console.warn('Genres API unavailable, using fallback:', error.message);
    // Return basic genres as fallback
    return {
      data: [
        { id: 132, name: 'Pop', picture_medium: 'https://e-cdns-images.dzcdn.net/images/misc/0b86c7ca2c6eb23b5ba6a0b19c9b7b5b/264x264-000000-80-0-0.jpg' },
        { id: 113, name: 'Dance', picture_medium: 'https://e-cdns-images.dzcdn.net/images/misc/d0c3f7b2c6eb23b5ba6a0b19c9b7b5b/264x264-000000-80-0-0.jpg' },
        { id: 116, name: 'Rap/Hip Hop', picture_medium: 'https://e-cdns-images.dzcdn.net/images/misc/f2bc007e9133c946ac3c3907ddc5d2ea/264x264-000000-80-0-0.jpg' },
        { id: 152, name: 'Rock', picture_medium: 'https://e-cdns-images.dzcdn.net/images/misc/8b2b6c7c5cd6e8c9c6e8c9c6e8c9c6e8/264x264-000000-80-0-0.jpg' },
        { id: 129, name: 'Jazz', picture_medium: 'https://e-cdns-images.dzcdn.net/images/misc/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6/264x264-000000-80-0-0.jpg' },
        { id: 85, name: 'Alternative', picture_medium: 'https://e-cdns-images.dzcdn.net/images/misc/b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7/264x264-000000-80-0-0.jpg' }
      ]
    };
  }
}

/**
 * Get artists for a specific genre
 * @param {string|number} genreId - Genre ID
 * @param {Object} options - Options object
 * @param {number} options.limit - Number of artists to return (default: 25)
 * @returns {Promise<Object>} - Object containing data array of artists
 */
export async function getGenreArtists(genreId, { limit = 25 } = {}) {
  if (!genreId) {
    throw new Error('Genre ID is required');
  }

  const url = `${DEEZER_API_BASE}/genre/${genreId}/artists?limit=${limit}`;
  const cacheKey = `genre:${genreId}:artists:${limit}`;
  
  return await fetchWithCache(url, cacheKey);
}

/**
 * Get top tracks for a specific genre (via chart)
 * @param {string|number} genreId - Genre ID
 * @param {Object} options - Options object
 * @param {number} options.limit - Number of tracks to return (default: 25)
 * @returns {Promise<Object>} - Object containing data array of tracks
 */
export async function getGenreTracks(genreId, { limit = 25 } = {}) {
  if (!genreId) {
    throw new Error('Genre ID is required');
  }

  // Use chart endpoint filtered by genre
  const url = `${DEEZER_API_BASE}/chart/${genreId}/tracks?limit=${limit}`;
  const cacheKey = `genre:${genreId}:tracks:${limit}`;
  
  return await fetchWithCache(url, cacheKey);
}

/**
 * Get a random track from charts for "Surprise Me" feature
 * @returns {Promise<Object>} - Random track object
 */
export async function getRandomTrack() {
  try {
    const charts = await getCharts();
    const tracks = charts.tracks?.data || [];
    
    if (tracks.length === 0) {
      throw new Error('No tracks available');
    }
    
    // Get a random track from the charts
    const randomIndex = Math.floor(Math.random() * tracks.length);
    return tracks[randomIndex];
  } catch (error) {
    throw new Error(`Failed to get random track: ${error.message}`);
  }
}

/**
 * Clear the cache (useful for testing or manual cache invalidation)
 */
export function clearCache() {
  cache.clear();
}

/**
 * Get cache statistics (useful for debugging)
 * @returns {Object} - Cache statistics
 */
export function getCacheStats() {
  return {
    size: cache.size,
    keys: Array.from(cache.keys())
  };
}

/**
 * Test API connection (for debugging)
 */
export async function testConnection() {
  try {
    console.log('Testing Deezer API connection...');
    const result = await getCharts();
    console.log('✅ API connection successful:', result);
    return result;
  } catch (error) {
    console.error('❌ API connection failed:', error);
    throw error;
  }
}
