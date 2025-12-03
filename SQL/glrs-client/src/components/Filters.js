import { useState, useEffect } from 'react';

export default function Filters({ onFilterChange }) {
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [showGenres, setShowGenres] = useState(false);
  const [showPlatforms, setShowPlatforms] = useState(false);

  console.log('Filters render - selectedGenres:', selectedGenres, 'selectedPlatforms:', selectedPlatforms);

  useEffect(() => {
    console.log('Fetching genres and platforms');
    fetch('http://localhost:4000/games/genres')
      .then(res => res.json())
      .then(data => {
        console.log('Genres fetched:', data);
        setGenres(data);
      })
      .catch(err => console.error('Error fetching genres:', err));

    fetch('http://localhost:4000/games/platforms')
      .then(res => res.json())
      .then(data => {
        console.log('Platforms fetched:', data);
        setPlatforms(data);
      })
      .catch(err => console.error('Error fetching platforms:', err));
  }, []);

  useEffect(() => {
    console.log('Filters changed, calling onFilterChange with:', { genres: selectedGenres, platforms: selectedPlatforms });
    onFilterChange({
      genres: selectedGenres,
      platforms: selectedPlatforms
    });
  }, [selectedGenres, selectedPlatforms, onFilterChange]);

  const toggleGenre = (genreId) => {
    console.log('Toggling genre:', genreId);
    setSelectedGenres(prev => 
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };

  const togglePlatform = (platformId) => {
    console.log('Toggling platform:', platformId);
    setSelectedPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const clearFilters = () => {
    console.log('Clearing all filters');
    setSelectedGenres([]);
    setSelectedPlatforms([]);
  };

  const hasActiveFilters = selectedGenres.length > 0 || selectedPlatforms.length > 0;

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: '8px',
      padding: '1.5rem',
      marginBottom: '2rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h3 style={{ margin: 0 }}>🔍 Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            style={{
              padding: '0.4rem 0.8rem',
              backgroundColor: 'transparent',
              color: 'var(--accent-primary)',
              border: '1px solid var(--accent-primary)',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            Clear All
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Genre Filter */}
        <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
          <button
            onClick={() => setShowGenres(!showGenres)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>
              🎮 Genres {selectedGenres.length > 0 && `(${selectedGenres.length})`}
            </span>
            <span>{showGenres ? '▲' : '▼'}</span>
          </button>

          {showGenres && (
            <>
              <div 
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 99
                }}
                onClick={() => setShowGenres(false)}
              />
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '0.5rem',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                zIndex: 100,
                maxHeight: '300px',
                overflowY: 'auto'
              }}>
                {genres.map(genre => (
                  <label
                    key={genre.genre_id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem 1rem',
                      cursor: 'pointer',
                      borderBottom: '1px solid var(--border-color)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <input
                      type="checkbox"
                      checked={selectedGenres.includes(genre.genre_id)}
                      onChange={() => toggleGenre(genre.genre_id)}
                      style={{ marginRight: '0.75rem', cursor: 'pointer' }}
                    />
                    <span style={{ color: 'var(--text-primary)' }}>{genre.name}</span>
                  </label>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Platform Filter */}
        <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
          <button
            onClick={() => setShowPlatforms(!showPlatforms)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>
              💻 Platforms {selectedPlatforms.length > 0 && `(${selectedPlatforms.length})`}
            </span>
            <span>{showPlatforms ? '▲' : '▼'}</span>
          </button>

          {showPlatforms && (
            <>
              <div 
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 99
                }}
                onClick={() => setShowPlatforms(false)}
              />
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '0.5rem',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                zIndex: 100,
                maxHeight: '300px',
                overflowY: 'auto'
              }}>
                {platforms.map(platform => (
                  <label
                    key={platform.platform_id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem 1rem',
                      cursor: 'pointer',
                      borderBottom: '1px solid var(--border-color)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <input
                      type="checkbox"
                      checked={selectedPlatforms.includes(platform.platform_id)}
                      onChange={() => togglePlatform(platform.platform_id)}
                      style={{ marginRight: '0.75rem', cursor: 'pointer' }}
                    />
                    <span style={{ color: 'var(--text-primary)' }}>{platform.name}</span>
                  </label>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {selectedGenres.map(genreId => {
            const genre = genres.find(g => g.genre_id === genreId);
            return genre ? (
              <span
                key={genreId}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.25rem 0.75rem',
                  backgroundColor: 'var(--accent-primary)',
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '0.85rem'
                }}
              >
                {genre.name}
                <button
                  onClick={() => toggleGenre(genreId)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    padding: 0,
                    fontSize: '1rem'
                  }}
                >
                  ×
                </button>
              </span>
            ) : null;
          })}
          {selectedPlatforms.map(platformId => {
            const platform = platforms.find(p => p.platform_id === platformId);
            return platform ? (
              <span
                key={platformId}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.25rem 0.75rem',
                  backgroundColor: 'var(--warning)',
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '0.85rem'
                }}
              >
                {platform.name}
                <button
                  onClick={() => togglePlatform(platformId)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    padding: 0,
                    fontSize: '1rem'
                  }}
                >
                  ×
                </button>
              </span>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}
