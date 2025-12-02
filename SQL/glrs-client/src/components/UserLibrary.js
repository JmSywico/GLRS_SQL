import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function UserLibrary() {
  const { id } = useParams();
  const [library, setLibrary] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:4000/users/${id}/library`)
      .then(res => res.json())
      .then(setLibrary);
  }, [id]);

  return (
    <div>
      <h2>User Library: {id}</h2>
      <ul>
        {library.map((item, index) => (
          <li key={index}>
            {item.title} — {item.ownership_status}
          </li>
        ))}
      </ul>
      {/* Render Playtime component */}
      <Playtime userId={id} />
    </div>
  );
}

// Named export for Playtime
export function Playtime({ userId }) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:4000/users/${userId}/playtime`)
      .then(res => res.json())
      .then(setRows);
  }, [userId]);

  return (
    <div>
      <h3>Playtime</h3>
      <ul>
        {rows.map(row => (
          <li key={row.game_id}>
            {row.title}: {Math.floor(row.total_minutes / 60)} hours
          </li>
        ))}
      </ul>
    </div>
  );
}
