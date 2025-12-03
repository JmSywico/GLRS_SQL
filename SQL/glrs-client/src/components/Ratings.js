import { useState, useEffect, useCallback } from 'react';
import RatingForm from './RatingForm';

export default function Ratings({ gameId, userId }) {
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:4000/ratings/${gameId}`);
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setReviews([]);
    }
  }, [gameId]);

  const fetchUserRating = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(`http://localhost:4000/ratings/${gameId}/${userId}`);
      const data = await res.json();
      setUserRating(data);
    } catch (err) {
      console.error('Error fetching user rating:', err);
    }
  }, [gameId, userId]);

  useEffect(() => {
    fetchReviews();
    fetchUserRating();
  }, [fetchReviews, fetchUserRating]);

  const handleRatingSubmit = () => {
    setShowForm(false);
    fetchReviews();
    fetchUserRating();
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 'N/A';

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Ratings & Reviews</h2>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ffa500' }}>{averageRating}</span>
          <span style={{ fontSize: '1.2rem', color: '#666' }}>/ 5.0</span>
          <span style={{ fontSize: '0.9rem', color: '#888' }}>({reviews.length} reviews)</span>
        </div>

        {userId && (
          <button 
            style={{ padding: '0.75rem 1.5rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem' }}
            onClick={() => setShowForm(!showForm)}
          >
            {userRating ? 'Edit Your Review' : 'Write a Review'}
          </button>
        )}
      </div>

      {showForm && (
        <RatingForm
          userId={userId}
          gameId={gameId}
          existingRating={userRating}
          onSubmit={handleRatingSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {reviews.map((review) => (
          <div key={review.rating_id} style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 'bold', color: '#333' }}>{review.username}</span>
              <span style={{ color: '#ffa500', fontWeight: 'bold' }}>⭐ {review.rating}/5</span>
            </div>
            {review.review_text && (
              <p style={{ margin: '0.75rem 0', color: '#555', lineHeight: '1.6' }}>{review.review_text}</p>
            )}
            <span style={{ fontSize: '0.85rem', color: '#888' }}>
              {new Date(review.created_at).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <p style={{ textAlign: 'center', color: '#999', padding: '2rem', fontStyle: 'italic' }}>
          No reviews yet. Be the first to review this game!
        </p>
      )}
    </div>
  );
}
