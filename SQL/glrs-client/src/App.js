import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import GameList from './components/GameList';
import GameDetails from './components/GameDetails';
import UserLibrary from './components/UserLibrary';
import Recommendations from './components/Recommendations';
import './App.css';

function App() {
  const currentUserId = 'U004'; // Hardcoded for now

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>🎮 GLRS - Game Library System</h1>
          <nav>
            <Link to="/">All Games</Link>
            <Link to="/library">My Library</Link>
            <Link to="/recommendations">Recommendations</Link>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<GameList />} />
            <Route path="/games/:id" element={<GameDetails />} />
            <Route path="/library" element={<UserLibrary id={currentUserId} />} />
            <Route path="/recommendations" element={<Recommendations userId={currentUserId} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
