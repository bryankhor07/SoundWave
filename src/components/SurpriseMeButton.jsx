import { useState } from 'react';
import { getRandomTrack } from '../lib/deezer';
import { usePlayer } from '../contexts/PlayerProvider';

export default function SurpriseMeButton({ className = "" }) {
  const [loading, setLoading] = useState(false);
  const { play } = usePlayer();

  const handleSurpriseMe = async () => {
    try {
      setLoading(true);
      const randomTrack = await getRandomTrack();
      
      if (randomTrack) {
        // Play the random track
        play(randomTrack, [randomTrack]);
      }
    } catch (error) {
      console.error('Failed to get random track:', error);
      alert('Failed to get a random track. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSurpriseMe}
      disabled={loading}
      className={`bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-full font-bold transition-all duration-200 flex items-center space-x-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          <span>Finding a surprise...</span>
        </>
      ) : (
        <>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" opacity="0.3"/>
          </svg>
          <span>🎲 Surprise Me!</span>
        </>
      )}
    </button>
  );
}
