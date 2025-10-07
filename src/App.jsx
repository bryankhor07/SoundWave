import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FavoritesProvider } from './contexts/FavoritesProvider';
import { PlayerProvider } from './contexts/PlayerProvider';
import NavBar from './components/NavBar';
import NowPlayingBar from './components/NowPlayingBar';
import Home from './pages/Home';
import TrackDetails from './pages/TrackDetails';
import ArtistDetails from './pages/ArtistDetails';
import AlbumDetails from './pages/AlbumDetails';
import GenreTracks from './pages/GenreTracks';
import Favorites from './pages/Favorites';
import * as deezerAPI from './lib/deezer.js'

function App() {
  // Expose Deezer API functions to window for console testing
  useEffect(() => {
    window.deezer = deezerAPI;
    console.log('Deezer API functions available on window.deezer:', Object.keys(deezerAPI));
  }, []);

  return (
    <FavoritesProvider>
      <PlayerProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500">
            <NavBar />
            <div className="pb-20">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/track/:id" element={<TrackDetails />} />
                <Route path="/artist/:id" element={<ArtistDetails />} />
                <Route path="/album/:id" element={<AlbumDetails />} />
                <Route path="/genre/:id" element={<GenreTracks />} />
                <Route path="/favorites" element={<Favorites />} />
              </Routes>
            </div>
            <NowPlayingBar />
          </div>
        </Router>
      </PlayerProvider>
    </FavoritesProvider>
  )
}

export default App
