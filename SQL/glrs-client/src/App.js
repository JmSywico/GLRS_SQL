import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import GameList from './components/GameList';
import GameDetails from './components/GameDetails';
import UserLibrary from './components/UserLibrary';
import Recommendations from './components/Recommendations';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import AddGame from './components/AddGame';
import EditGame from './components/EditGame';

function App() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = (userData) => {
    // Extract user_id if userData is an object, otherwise use it directly
    const userId = userData?.user_id || userData;
    setCurrentUserId(userId);
    localStorage.setItem('currentUserId', userId);
    
    // Check if user is admin (U001 is AdminMaster)
    setIsAdmin(userId === 'U001');
  };

  const handleLogout = () => {
    setCurrentUserId(null);
    setIsAdmin(false);
    localStorage.removeItem('currentUserId');
  };

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const savedUserId = localStorage.getItem('currentUserId');
    if (savedUserId) {
      setCurrentUserId(savedUserId);
      setIsAdmin(savedUserId === 'U001');
    }
  }, []);

  if (!currentUserId) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <div className="nav-content">
            <h2 className="nav-logo">Q.U.E.S.T</h2>
            <div className="nav-links">
              <a href="/">All Games</a>
              <a href="/library">My Library</a>
              <a href="/recommendations">Recommendations</a>
              {isAdmin && <a href="/admin">Admin Panel</a>}
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
            {isAdmin && <Route path="/admin" element={<AdminDashboard userId={currentUserId} />} />}
            {isAdmin && <Route path="/admin/add-game" element={<AddGame userId={currentUserId} />} />}
            {isAdmin && <Route path="/admin/edit-game/:gameId" element={<EditGame userId={currentUserId} />} />}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
