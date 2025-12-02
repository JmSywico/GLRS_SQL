export default function Filters({ onFilter }) {
  return (
    <div>
      <select onChange={e => onFilter("genre", e.target.value)}>
        <option value="">All Genres</option>
        <option value="RPG">RPG</option>
        <option value="Shooter">Shooter</option>
        <option value="Adventure">Adventure</option>
      </select>

      <select onChange={e => onFilter("platform", e.target.value)}>
        <option value="">All Platforms</option>
        <option value="PC">PC</option>
        <option value="PlayStation 5">PlayStation 5</option>
        <option value="Xbox Series X">Xbox</option>
      </select>
    </div>
  );
}
