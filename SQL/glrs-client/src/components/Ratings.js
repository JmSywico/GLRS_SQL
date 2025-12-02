import { useEffect, useState } from "react";

export default function Ratings({ gameId }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:4000/ratings/${gameId}`)
      .then(res => res.json())
      .then(setReviews);
  }, [gameId]);

  return (
    <div>
      <h3>Reviews</h3>

      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map(r => (
          <div key={r.rating_id} style={{ marginBottom: 20 }}>
            <strong>{r.username}</strong> — {r.rating_value}★
            <p>{r.rating_text}</p>
          </div>
        ))
      )}
    </div>
  );
}
