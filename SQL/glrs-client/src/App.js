import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import GameList from './components/GameList';
import GameDetails from './components/GameDetails';
import UserLibrary from './components/UserLibrary';
import Recommendations from './components/Recommendations';
import Login from './components/Login';

function App() {
  const [currentUserId, setCurrentUserId] = useState(null);

  const handleLogin = (userId) => {
    setCurrentUserId(userId);
    localStorage.setItem('currentUserId', userId);
  };

  const handleLogout = () => {
    setCurrentUserId(null);
    localStorage.removeItem('currentUserId');
  };

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const savedUserId = localStorage.getItem('currentUserId');
    if (savedUserId) {
      setCurrentUserId(savedUserId);
    }
  }, []);

  if (!currentUserId) {
    return (
      <Router>
        <Login onLogin={handleLogin} />
      </Router>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <div className="nav-content">
            <h2 className="nav-logo">GLRS</h2>
            <div className="nav-links">
              <a href="/">All Games</a>
              <a href="/library">My Library</a>
              <a href="/recommendations">Recommendations</a>
              <button 
                onClick={handleLogout}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#ff4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginLeft: '1rem',
                  fontWeight: '500'
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<GameList currentUserId={currentUserId} />} />
            <Route path="/games/:id" element={<GameDetails currentUserId={currentUserId} />} />
            <Route path="/library" element={<UserLibrary id={currentUserId} />} />
            <Route path="/recommendations" element={<Recommendations userId={currentUserId} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
