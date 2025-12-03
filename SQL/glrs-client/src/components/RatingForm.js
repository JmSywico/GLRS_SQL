import { useState } from "react";

export default function RatingForm({ gameId, userId, onSubmit }) {
  const [value, setValue] = useState(5);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!text.trim()) {
      alert("Please write a review");
      return;
    }

    setSubmitting(true);
    const payload = {
      rating_id: 'R' + Date.now(),
      user_id: userId,
      game_id: gameId,
      rating_value: value,
      rating_text: text
    };

    try {
      await fetch("http://localhost:4000/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      setText("");
      setValue(5);
      onSubmit();
    } catch (err) {
      console.error(err);
      alert("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      borderTop: '1px solid var(--border-color)',
      paddingTop: '1.5rem',
      marginTop: '1.5rem'
    }}>
      <h4 style={{ marginBottom: '1rem' }}>✍️ Write a Review</h4>
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '0.5rem',
          color: 'var(--text-secondary)',
          fontSize: '0.9rem'
        }}>
          Your Rating
        </label>
        <select 
          value={value} 
          onChange={e => setValue(Number(e.target.value))}
          style={{
            padding: '0.5rem',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          {[5, 4, 3, 2, 1].map(n => (
            <option key={n} value={n}>
              {'★'.repeat(n) + '☆'.repeat(5-n)} ({n}.0)
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '0.5rem',
          color: 'var(--text-secondary)',
          fontSize: '0.9rem'
        }}>
          Your Review
        </label>
        <textarea
          placeholder="Share your thoughts about this game..."
          value={text}
          onChange={e => setText(e.target.value)}
          rows={4}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            fontSize: '0.95rem',
            lineHeight: '1.5',
            resize: 'vertical',
            fontFamily: 'inherit'
          }}
        />
      </div>

      <button 
        onClick={submit}
        disabled={submitting}
        className="btn btn-primary"
        style={{
          opacity: submitting ? 0.6 : 1,
          cursor: submitting ? 'not-allowed' : 'pointer'
        }}
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </div>
  );
}
