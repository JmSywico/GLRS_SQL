import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PlayTime from './PlayTime';
import RatingForm from './RatingForm';
import Ratings from './Ratings';
import LibraryButton from './LibraryButton';

export default function GameDetails({ currentUserId }) {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshRatings, setRefreshRatings] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:4000/games/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch game details');
        return res.json();
      })
      .then(data => {
        setGame(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p style={{ textAlign: 'center', padding: '2rem' }}>Loading...</p>;
  if (error) return <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--danger)' }}>Error: {error}</p>;
  if (!game) return <p style={{ textAlign: 'center', padding: '2rem' }}>Game not found</p>;

  return (
    <div style={{ maxWidth: '900px' }}>
      <Link to="/" className="btn btn-secondary" style={{ display: 'inline-block', marginBottom: '1.5rem' }}>
        ← Back to Games
      </Link>

      <div style={{ 
        backgroundColor: 'var(--bg-card)', 
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '2rem'
      }}>
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div style={{ 
            width: '200px',
            aspectRatio: '3/4',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <div style={{ 
              fontSize: '5rem', 
              fontWeight: '700', 
              color: 'white', 
              opacity: '0.9' 
            }}>
              {game.title.charAt(0)}
            </div>
          </div>

          <div style={{ flex: 1, minWidth: '300px' }}>
            <h1 style={{ marginBottom: '0.5rem' }}>{game.title}</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              {game.developer_name} • {game.release_year}
            </p>
            
            {game.avg_rating && (
              <div style={{ marginBottom: '1rem' }}>
                <span className="rating-stars" style={{ fontSize: '1.2rem' }}>
                  ★ {Number(game.avg_rating).toFixed(1)}
                </span>
              </div>
            )}

            {/* Library Button */}
            <div style={{ marginBottom: '1rem' }}>
              <LibraryButton 
                userId={currentUserId?.user_id || currentUserId} 
                gameId={id} 
              />
            </div>

            {game.genres && game.genres.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Genres: </strong>
                <div>
                  {game.genres.map((g, i) => (
                    <span key={i} style={{ 
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '4px',
                      marginRight: '0.5rem',
                      marginTop: '0.5rem',
                      fontSize: '0.85rem'
                    }}>
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {game.platforms && game.platforms.length > 0 && (
              <div>
                <strong style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Platforms: </strong>
                <div>
                  {game.platforms.map((p, i) => (
                    <span key={i} style={{ 
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '4px',
                      marginRight: '0.5rem',
                      marginTop: '0.5rem',
                      fontSize: '0.85rem'
                    }}>
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {game.description && (
          <div style={{ 
            borderTop: '1px solid var(--border-color)', 
            paddingTop: '1.5rem',
            marginTop: '1.5rem'
          }}>
            <h3 style={{ marginBottom: '1rem' }}>Description</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              {game.description}
            </p>
          </div>
        )}

        <RatingForm 
          gameId={id} 
          userId={currentUserId?.user_id || currentUserId} 
          onSubmit={() => setRefreshRatings(prev => prev + 1)}
        />

        <Ratings key={refreshRatings} gameId={id} />
      </div>

      <PlayTime 
        userId={currentUserId?.user_id || currentUserId} 
        gameId={id} 
        gameName={game.title}
      />
    </div>
  );
}
