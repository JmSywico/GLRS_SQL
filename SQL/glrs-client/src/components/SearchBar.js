import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const search = () => onSearch(query);

  return (
    <div>
      <input 
        placeholder="Search games..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <button onClick={search}>Search</button>
    </div>
  );
}
