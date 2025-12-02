import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import GameList from './components/GameList';
import GameDetails from './components/GameDetails';
import UserLibrary from './components/UserLibrary';

function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: 20 }}>
        <h1>GLRS Demo App</h1>

        <nav style={{ marginBottom: 20 }}>
          <Link to="/">Games</Link> |{" "}
          <Link to="/user/U004/library">My Library</Link>
        </nav>

        <Routes>
          <Route path="/" element={<GameList />} />
          <Route path="/games/:id" element={<GameDetails />} />
          <Route path="/user/:id/library" element={<UserLibrary />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
