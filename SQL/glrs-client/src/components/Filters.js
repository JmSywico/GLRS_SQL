import { useState, useEffect, useRef } from 'react';

export default function Filters({ onFilterChange }) {
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [loading, setLoading] = useState(true);
  const isFirstRender = useRef(true);

  // Fetch genres and platforms only once on mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [genresRes, platformsRes] = await Promise.all([
          fetch('http://localhost:4000/games/genres'),
          fetch('http://localhost:4000/games/platforms')
        ]);
        
        const genresData = await genresRes.json();
        const platformsData = await platformsRes.json();
        
        // Ensure we always set arrays, even if fetch fails
        setGenres(Array.isArray(genresData) ? genresData : []);
        setPlatforms(Array.isArray(platformsData) ? platformsData : []);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch filters:', err);
        setGenres([]);
        setPlatforms([]);
        setLoading(false);
      }
    };

    fetchFilters();
  }, []);

  // Update parent component when filters change (but NOT on first render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!loading) {
      onFilterChange({
        genre: selectedGenre,
        platform: selectedPlatform
      });
    }
  }, [selectedGenre, selectedPlatform]);

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
  };

  const handlePlatformChange = (e) => {
    setSelectedPlatform(e.target.value);
  };

  const handleClearFilters = () => {
    setSelectedGenre('');
    setSelectedPlatform('');
  };

  if (loading) {
    return <div style={{ color: 'var(--text-secondary)' }}>Loading filters...</div>;
  }

  return (
    <div style={{
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
      flexWrap: 'wrap',
      alignItems: 'center'
    }}>
      <div>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          fontWeight: '500'
        }}>
          Genre:
        </label>
        <select
          value={selectedGenre}
          onChange={handleGenreChange}
          style={{
            padding: '0.6rem 1rem',
            fontSize: '1rem',
            backgroundColor: '#1a1a1a',
            color: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            cursor: 'pointer',
            outline: 'none',
            minWidth: '150px'
          }}
        >
          <option value="">All Genres</option>
          {genres.map(genre => (
            <option key={genre.genre_id} value={genre.genre_name}>
              {genre.genre_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          fontWeight: '500'
        }}>
          Platform:
        </label>
        <select
          value={selectedPlatform}
          onChange={handlePlatformChange}
          style={{
            padding: '0.6rem 1rem',
            fontSize: '1rem',
            backgroundColor: '#1a1a1a',
            color: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            cursor: 'pointer',
            outline: 'none',
            minWidth: '150px'
          }}
        >
          <option value="">All Platforms</option>
          {platforms.map(platform => (
            <option key={platform.platform_id} value={platform.platform_name}>
              {platform.platform_name}
            </option>
          ))}
        </select>
      </div>

      {(selectedGenre || selectedPlatform) && (
        <button
          onClick={handleClearFilters}
          style={{
            padding: '0.6rem 1.2rem',
            fontSize: '0.95rem',
            fontWeight: '600',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            cursor: 'pointer',
            marginTop: '1.5rem',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = 'var(--primary-color)';
            e.target.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = 'var(--border-color)';
            e.target.style.color = 'var(--text-secondary)';
          }}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
