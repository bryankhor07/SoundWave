# SoundWave 🎵

A modern music discovery platform built with React and the Deezer API.

## Project Goals

- **Search & Discovery**: Find tracks, albums, and artists instantly
- **Charts & Trending**: Explore top charts and editor's picks
- **Genre Discovery**: Browse music by genre with shuffle and "surprise me" features
- **Preview Playback**: Listen to 30-second previews with an inline player
- **Favorites & Playlists**: Save your favorite tracks locally
- **Now Playing Bar**: Persistent player with queue management

## Tech Stack

- **Frontend**: Vite + React (JavaScript)
- **Styling**: Tailwind CSS v3
- **Routing**: React Router v6
- **State Management**: React Context (or Zustand)
- **Audio**: Native HTML5 Audio API
- **API**: Deezer API (no key required)

## Deezer API Endpoints

Base URL: `https://api.deezer.com`

### Search
- **Search all**: `GET /search?q=<query>`
- **Search tracks**: `GET /search/track?q=<query>`
- **Search artists**: `GET /search/artist?q=<query>`
- **Search albums**: `GET /search/album?q=<query>`

### Lookup
- **Track by ID**: `GET /track/{id}` - Returns preview URL, title, artist, album, duration
- **Album by ID**: `GET /album/{id}`
- **Artist by ID**: `GET /artist/{id}`

### Charts & Discovery
- **Top charts**: `GET /chart` - Returns top tracks, albums, artists
- **Genres list**: `GET /genre`
- **Genre artists**: `GET /genre/{id}/artists`

### Notes
- Track preview URL: `track.preview` (HTTPS MP3, ~30 seconds)
- No authentication required
- Respect Deezer terms & provide attribution

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code (requires prettier)
npm run format
```

## Project Structure

```
SoundWave/
├─ src/
│  ├─ main.jsx
│  ├─ App.jsx
│  ├─ lib/
│  │   └─ deezer.js         # Deezer API wrapper
│  ├─ context/
│  │   ├─ FavoritesContext.jsx
│  │   └─ PlayerContext.jsx
│  ├─ pages/
│  │   ├─ Home.jsx
│  │   ├─ TrackDetails.jsx
│  │   ├─ Artist.jsx
│  │   └─ Album.jsx
│  ├─ components/
│  │   ├─ NavBar.jsx
│  │   ├─ SearchBar.jsx
│  │   ├─ TrackCard.jsx
│  │   ├─ NowPlayingBar.jsx
│  │   ├─ PlayerControls.jsx
│  │   └─ GenreGrid.jsx
│  └─ hooks/
│      └─ useDebounce.js
└─ tailwind.config.js, postcss.config.js, index.css, README.md
```

## Development Notes

- **Search debounce**: 250-400ms for optimal UX
- **Audio playback**: Single shared Audio instance, stops previous on new play
- **Queue**: Small array in PlayerContext for Next/Prev functionality
- **Persistence**: Use `localStorage` key `tunefind_favs` for favorites
- **CORS**: Add serverless proxy only if needed

## License

MIT
