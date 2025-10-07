import { useState, useEffect } from 'react';
import { getCharts } from '../lib/deezer';
import TrackCard from './TrackCard';

export default function TrackCardDemo() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTracks = async () => {
      try {
        const charts = await getCharts();
        setTracks(charts.tracks?.data?.slice(0, 3) || []);
      } catch (error) {
        console.error('Failed to load tracks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTracks();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-white">Loading demo tracks...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-white mb-6">TrackCard Demo</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
        {tracks.map((track) => (
          <TrackCard 
            key={track.id} 
            track={track} 
            currentList={tracks}
          />
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-white/10 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-2">Test Instructions:</h3>
        <ul className="text-white/80 space-y-1 text-sm">
          <li>• Click play button to start audio preview</li>
          <li>• Click heart to add/remove from favorites</li>
          <li>• Use Tab to navigate between buttons</li>
          <li>• Press Enter or Space to activate buttons</li>
          <li>• Check browser console for audio loading status</li>
        </ul>
      </div>
    </div>
  );
}
