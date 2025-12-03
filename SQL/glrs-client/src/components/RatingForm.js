import { useState } from 'react';

export default function RatingForm({ userId, gameId, existingRating, onSubmit, onCancel }) {
  const [rating, setRating] = useState(existingRating?.rating || 0);
  const [reviewText, setReviewText] = useState(existingRating?.review_text || '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('http://localhost:4000/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          game_id: gameId,
          rating: Number(rating), // Convert to number
          review_text: reviewText || null // Send null if empty
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to submit rating');
      }

      const data = await res.json();
      console.log('Rating submitted:', data);
      
      // Call the parent's onSubmit callback to refresh the ratings
      if (onSubmit) {
        onSubmit();
      }
    } catch (err) {
      console.error('Error submitting rating:', err);
      alert('Failed to submit rating: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      padding: '1.5rem',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      marginBottom: '1.5rem',
      border: '1px solid #ddd'
    }}>
      <h3 style={{ marginBottom: '1rem' }}>
        {existingRating ? 'Edit Your Review' : 'Write a Review'}
      </h3>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
          Rating: {rating}/5
        </label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)} // This sets as number
              style={{
                fontSize: '2rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: star <= rating ? '#ffa500' : '#ddd',
                padding: '0',
                transition: 'color 0.2s'
              }}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
          Review (Optional):
        </label>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Share your thoughts about this game..."
          rows="5"
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '5px',
            border: '1px solid #ddd',
            fontSize: '1rem',
            fontFamily: 'inherit',
            resize: 'vertical'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: submitting ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            opacity: submitting ? 0.6 : 1
          }}
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: submitting ? 'not-allowed' : 'pointer',
            fontSize: '1rem'
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
