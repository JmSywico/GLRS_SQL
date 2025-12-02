import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Ratings from "./Ratings";
import RatingForm from "./RatingForm";


export default function GameDetails() {
  const { id } = useParams();
  const [game, setGame] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:4000/games/${id}`)
      .then(res => res.json())
      .then(setGame);
  }, [id]);

  if (!game) return <div>Loading...</div>;

  return (
    <div>
      <h2>{game.title}</h2>
      <p><strong>Developer:</strong> {game.developer}</p>
      <p><strong>Genres:</strong> {game.genres.join(', ')}</p>
      <p><strong>Platforms:</strong> {game.platforms.join(', ')}</p>
      <p><strong>Release Year:</strong> {game.release_year}</p>
      <Ratings gameId={id} />
      <RatingForm userId="U004" gameId={id} onSubmit={() => window.location.reload()} />
    </div>
  );
}
