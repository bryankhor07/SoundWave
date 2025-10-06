import { useEffect } from 'react'
import * as deezer from './lib/deezer.js'

function App() {
  // Expose Deezer API functions to window for console testing
  useEffect(() => {
    window.deezer = deezer;
    console.log('Deezer API functions available on window.deezer:', Object.keys(deezer));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">SoundWave</h1>
        <p className="text-xl text-white/90 mb-8">Music Discovery Platform</p>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
          <p className="text-sm">✓ Vite + React</p>
          <p className="text-sm">✓ Tailwind CSS v3</p>
          <p className="text-sm">✓ Deezer API Integration</p>
          <p className="text-sm text-green-400">✓ Open console to test: window.deezer</p>
        </div>
      </div>
    </div>
  )
}

export default App
