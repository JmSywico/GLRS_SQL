import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from "./SearchBar";
import Filters from "./Filters";

export default function GameList() {
  const [games, setGames] = useState([]);
  const [currentQuery, setCurrentQuery] = useState("");
  const [currentFilters, setCurrentFilters] = useState({});

  useEffect(() => {
    fetch("http://localhost:4000/games")
      .then(res => res.json())
      .then(setGames);
  }, []);

  const searchGames = async (query, filters = {}) => {
    const url = new URL("http://localhost:4000/games/search/filter");
    if (query) url.searchParams.append("query", query);
    if (filters.genre) url.searchParams.append("genre", filters.genre);
    if (filters.platform) url.searchParams.append("platform", filters.platform);

    const res = await fetch(url);
    const data = await res.json();
    setGames(data);
  };

  const onSearch = (query) => {
    setCurrentQuery(query);
    searchGames(query, currentFilters);
  };

  const onFilter = (key, value) => {
    const newFilters = { ...currentFilters, [key]: value };
    setCurrentFilters(newFilters);
    searchGames(currentQuery, newFilters);
  };

  return (
    <div>
      <h2>All Games</h2>
      <SearchBar onSearch={onSearch} />
      <Filters onFilter={onFilter} />

      <ul>
        {games.map(g => (
          <li key={g.game_id}>
            <Link to={`/games/${g.game_id}`}>
              {g.title} ({g.release_year})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
