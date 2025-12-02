import { useState } from "react";

export default function RatingForm({ gameId, userId, onSubmit }) {
  const [value, setValue] = useState(5);
  const [text, setText] = useState("");

  const submit = async () => {
    const payload = {
      rating_id: Date.now().toString(),
      user_id: userId,
      game_id: gameId,
      rating_value: value,
      rating_text: text
    };

    await fetch("http://localhost:4000/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    onSubmit(); // refresh parent
  };

  return (
    <div>
      <h4>Add a Review</h4>
      <select value={value} onChange={e => setValue(e.target.value)}>
        {[1,2,3,4,5].map(n => <option key={n}>{n}</option>)}
      </select>
      <br />
      <textarea
        placeholder="Write your review..."
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button onClick={submit}>Submit</button>
    </div>
  );
}
