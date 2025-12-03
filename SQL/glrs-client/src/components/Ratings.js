import { useEffect, useState } from "react";

export default function Ratings({ gameId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:4000/ratings/${gameId}`)
      .then(res => res.json())
      .then(data => {
        setReviews(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [gameId]);

  if (loading) return <p style={{ color: 'var(--text-secondary)' }}>Loading reviews...</p>;

  return (
    <div style={{
      borderTop: '1px solid var(--border-color)',
      paddingTop: '1.5rem',
      marginTop: '1.5rem'
    }}>
      <h3 style={{ marginBottom: '1rem' }}>💬 User Reviews ({reviews.length})</h3>

      {reviews.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
          No reviews yet. Be the first to share your thoughts!
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reviews.map(r => (
            <div 
              key={r.rating_id} 
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '1rem'
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '0.75rem'
              }}>
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>{r.username}</strong>
                  <span style={{ 
                    marginLeft: '0.5rem',
                    color: 'var(--rating-star)',
                    fontSize: '1.1rem'
                  }}>
                    {'★'.repeat(Math.round(r.rating_value))}
                    {'☆'.repeat(5 - Math.round(r.rating_value))}
                  </span>
                  <span style={{ 
                    marginLeft: '0.5rem',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: 'var(--accent-primary)'
                  }}>
                    {Number(r.rating_value).toFixed(1)}
                  </span>
                </div>
                <span style={{ 
                  fontSize: '0.85rem', 
                  color: 'var(--text-muted)' 
                }}>
                  {new Date(r.rating_date).toLocaleDateString()}
                </span>
              </div>
              {r.rating_text && (
                <p style={{ 
                  color: 'var(--text-secondary)', 
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  {r.rating_text}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
