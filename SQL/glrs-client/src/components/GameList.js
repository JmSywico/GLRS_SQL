import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import LibraryButton from './LibraryButton'; // ADD THIS

export default function GameList() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const currentUserId = 'U004'; // ADD THIS

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        
        if (searchTerm) {
          params.append('search', searchTerm);
        }

        const url = `http://localhost:4000/games${params.toString() ? '?' + params.toString() : ''}`;
        
        const res = await fetch(url);
        const data = await res.json();
        setGames(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchGames();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  if (loading) {
    return <p style={{ textAlign: 'center', padding: '2rem' }}>Loading games...</p>;
  }

  return (
    <div>
      <h1>All Games</h1>
      
      <SearchBar onSearch={setSearchTerm} />

      {games.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '8px',
          border: '1px solid var(--border-color)'
        }}>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
            No games found
          </p>
        </div>
      ) : (
        <>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Showing {games.length} game{games.length !== 1 ? 's' : ''}
          </p>
          <div className="games-grid">
            {games.map((game) => (
              <Link to={`/games/${game.game_id}`} key={game.game_id} className="game-card">
                <div className="game-cover">
                  <div className="game-cover-placeholder">
                    {game.title.charAt(0)}
                  </div>
                </div>
                <div className="game-info">
                  <h3 className="game-title">{game.title}</h3>
                  <p className="game-developer">{game.developer_name || 'Unknown'}</p>
                  <div className="game-footer">
                    <span className="game-year">{game.release_year || 'N/A'}</span>
                    <span className="rating-stars">
                      ★ {game.avg_rating ? Number(game.avg_rating).toFixed(1) : 'N/A'}
                    </span>
                  </div>
                  {/* ADD LibraryButton HERE */}
                  <LibraryButton 
                    gameId={game.game_id} 
                    userId={currentUserId}
                  />
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
