import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Recommendations({ userId }) {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:4000/recommendations/user/${userId}?limit=12`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch recommendations');
        return res.json();
      })
      .then(data => {
        setRecommendations(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return (
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '2rem',
        marginTop: '2rem',
        textAlign: 'center'
      }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading recommendations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '2rem',
        marginTop: '2rem'
      }}>
        <p style={{ color: 'var(--danger)' }}>Error: {error}</p>
      </div>
    );
  }

  if (!recommendations || recommendations.games.length === 0) {
    return (
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '2rem',
        marginTop: '2rem',
        textAlign: 'center'
      }}>
        <p style={{ color: 'var(--text-secondary)' }}>
          No recommendations available. Add some games to your library first!
        </p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: '8px',
      padding: '2rem',
      marginTop: '2rem'
    }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>🎯 Recommended For You</h2>
        {recommendations.recommendation_type === 'genre_based' ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Based on your interest in: {' '}
            <strong style={{ color: 'var(--accent-primary)' }}>
              {recommendations.favorite_genres.join(', ')}
            </strong>
          </p>
        ) : (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Popular games you might enjoy
          </p>
        )}
      </div>

      <div className="games-grid">
        {recommendations.games.map((game) => (
          <Link 
            to={`/games/${game.game_id}`} 
            key={game.game_id} 
            className="game-card"
            style={{ textDecoration: 'none' }}
          >
            <div className="game-cover">
              <div className="game-cover-placeholder">
                {game.title.charAt(0)}
              </div>
              {recommendations.recommendation_type === 'genre_based' && game.genre_match_count > 1 && (
                <div style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  padding: '0.25rem 0.5rem',
                  backgroundColor: 'var(--accent-primary)',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  color: 'white'
                }}>
                  {game.genre_match_count} Matches
                </div>
              )}
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
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}