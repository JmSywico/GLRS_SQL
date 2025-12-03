import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

export default function UserLibrary({ id }) {
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'owned', 'wishlist'

  const fetchLibrary = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/users/${id}/library`);
      const data = await res.json();
      setLibrary(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchLibrary();
  }, [fetchLibrary]);

  const filteredLibrary = library.filter(game => {
    if (filter === 'owned') return game.ownership_status === 'owned';
    if (filter === 'wishlist') return game.ownership_status === 'wishlist';
    return true;
  });

  console.log('Library games:', filteredLibrary); // ADD THIS LINE

  const ownedCount = library.filter(g => g.ownership_status === 'owned').length;
  const wishlistCount = library.filter(g => g.ownership_status === 'wishlist').length;

  if (loading) {
    return <p style={{ textAlign: 'center', padding: '2rem' }}>Loading library...</p>;
  }

  return (
    <div>
      <h1>My Library</h1>

      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: filter === 'all' ? 'var(--primary-color)' : 'var(--bg-card)',
            color: filter === 'all' ? 'white' : 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          All ({library.length})
        </button>
        <button
          onClick={() => setFilter('owned')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: filter === 'owned' ? 'var(--primary-color)' : 'var(--bg-card)',
            color: filter === 'owned' ? 'white' : 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Owned ({ownedCount})
        </button>
        <button
          onClick={() => setFilter('wishlist')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: filter === 'wishlist' ? 'var(--primary-color)' : 'var(--bg-card)',
            color: filter === 'wishlist' ? 'white' : 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Wishlist ({wishlistCount})
        </button>
      </div>

      {loading && <p>Loading library...</p>}

      {!loading && filteredLibrary.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
          No games in your library yet.
        </p>
      )}

      <div className="games-grid">
        {filteredLibrary.map((game, index) => (
          <Link 
            to={`/games/${game.game_id}`} 
            key={game.game_id || index}
            style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}
            className="game-card"
          >
            <div className="game-cover">
              <div className="game-cover-placeholder">
                {game.title.charAt(0)}
              </div>
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                padding: '4px 8px',
                backgroundColor: game.ownership_status === 'owned' ? '#4CAF50' : '#FF9800',
                color: 'white',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }}>
                {game.ownership_status === 'owned' ? 'OWNED' : 'WISHLIST'}
              </div>
            </div>
            <div className="game-info">
              <h3 className="game-title">{game.title}</h3>
              <p className="game-meta">
                Added: {new Date(game.date_added).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
