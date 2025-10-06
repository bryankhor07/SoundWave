// Deezer API wrapper with caching
// Base URL for Deezer API
const DEEZER_API_BASE = 'https://api.deezer.com';

// In-memory cache to prevent duplicate API calls
const cache = new Map();

// Cache TTL in milliseconds (5 minutes)
const CACHE_TTL = 5 * 60 * 1000;

/**
 * JSONP helper function to bypass CORS
 * @param {string} url - The API endpoint URL
 * @returns {Promise<Object>} - Parsed JSON response
 */
function jsonp(url) {
  return new Promise((resolve, reject) => {
    const callbackName = `deezer_callback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const script = document.createElement('script');
    
    // Set up the callback
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
      reject(new Error('Network error: Unable to connect to Deezer API'));
    };
    
    // Make the request
    script.src = `${url}&callback=${callbackName}`;
    document.head.appendChild(script);
    
    // Timeout after 10 seconds
    setTimeout(() => {
      if (window[callbackName]) {
        document.head.removeChild(script);
        delete window[callbackName];
        reject(new Error('Request timeout: Deezer API did not respond'));
      }
    }, 10000);
  });
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
    return cached.data;
  }

  try {
    // Use JSONP for Deezer API to bypass CORS
    const data = await jsonp(url);
    
    // Handle Deezer API error responses
    if (data.error) {
      throw new Error(`Deezer API error: ${data.error.message || 'Unknown error'}`);
    }

    // Cache the successful response
    cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });

    return data;
  } catch (error) {
    throw error;
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
 * Get current charts (top tracks, albums, artists)
 * @returns {Promise<Object>} - Charts object containing tracks, albums, and artists
 */
export async function getCharts() {
  const url = `${DEEZER_API_BASE}/chart`;
  const cacheKey = 'charts';
  
  return await fetchWithCache(url, cacheKey);
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
