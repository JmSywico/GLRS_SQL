import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard({ userId }) {
  const [games, setGames] = useState([]);
  const [users, setUsers] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [gamesRes, usersRes, ratingsRes] = await Promise.all([
        fetch('http://localhost:4000/games'),
        fetch('http://localhost:4000/users'),
        fetch('http://localhost:4000/ratings/all')
      ]);

      const gamesData = await gamesRes.json();
      const usersData = await usersRes.json();
      const ratingsData = await ratingsRes.json();

      setGames(gamesData);
      setUsers(usersData);
      setRatings(ratingsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const deleteGame = async (gameId) => {
    if (!window.confirm('Are you sure you want to delete this game?')) return;

    console.log('Deleting game:', gameId, 'User:', userId); // Debug log

    try {
      const res = await fetch(`http://localhost:4000/games/admin/${gameId}?user_id=${userId}`, {
        method: 'DELETE'
      });

      const data = await res.json();
      console.log('Delete response:', data); // Debug log

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete game');
      }

      alert('Game deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting game:', error);
      alert('Failed to delete game: ' + error.message);
    }
  };

  const deleteUser = async (targetUserId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const res = await fetch(`http://localhost:4000/users/admin/${targetUserId}?user_id=${userId}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Failed to delete user');

      alert('User deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const deleteRating = async (ratingId) => {
    if (!window.confirm('Are you sure you want to delete this rating?')) return;

    try {
      const res = await fetch(`http://localhost:4000/ratings/admin/${ratingId}?user_id=${userId}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Failed to delete rating');

      alert('Rating deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting rating:', error);
      alert('Failed to delete rating');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Admin Dashboard</h1>

      {/* Games Section */}
      <div style={{ 
        backgroundColor: 'var(--bg-card)', 
        padding: '1.5rem', 
        borderRadius: '8px',
        marginBottom: '2rem' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Manage Games</h2>
          <Link to="/admin/add-game" className="btn btn-primary">+ Add New Game</Link>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Title</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Year</th>
              <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {games.map(game => (
              <tr key={game.game_id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem' }}>{game.title}</td>
                <td style={{ padding: '0.75rem' }}>{game.release_year}</td>
                <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                  <Link 
                    to={`/admin/edit-game/${game.game_id}`} 
                    className="btn btn-secondary" 
                    style={{ marginRight: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={() => deleteGame(game.game_id)}
                    className="btn"
                    style={{ 
                      padding: '0.4rem 0.8rem', 
                      fontSize: '0.85rem',
                      backgroundColor: 'var(--danger)',
                      color: 'white',
                      border: 'none'
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Users Section */}
      <div style={{ 
        backgroundColor: 'var(--bg-card)', 
        padding: '1.5rem', 
        borderRadius: '8px',
        marginBottom: '2rem' 
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Manage Users</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Username</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.user_id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem' }}>{user.username}</td>
                <td style={{ padding: '0.75rem' }}>{user.email}</td>
                <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                  <button 
                    onClick={() => deleteUser(user.user_id)}
                    className="btn"
                    style={{ 
                      padding: '0.4rem 0.8rem', 
                      fontSize: '0.85rem',
                      backgroundColor: 'var(--danger)',
                      color: 'white',
                      border: 'none'
                    }}
                    disabled={user.user_id === userId}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ratings Section */}
      <div style={{ 
        backgroundColor: 'var(--bg-card)', 
        padding: '1.5rem', 
        borderRadius: '8px' 
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Manage Ratings</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>User</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Game</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Rating</th>
              <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ratings.map(rating => (
              <tr key={rating.rating_id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem' }}>{rating.username}</td>
                <td style={{ padding: '0.75rem' }}>{rating.game_title}</td>
                <td style={{ padding: '0.75rem' }}>★ {rating.rating}</td>
                <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                  <button 
                    onClick={() => deleteRating(rating.rating_id)}
                    className="btn"
                    style={{ 
                      padding: '0.4rem 0.8rem', 
                      fontSize: '0.85rem',
                      backgroundColor: 'var(--danger)',
                      color: 'white',
                      border: 'none'
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}