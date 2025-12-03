import { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ 
      marginBottom: '2rem',
      display: 'flex',
      gap: '0.75rem',
      maxWidth: '500px', // Shortened from 600px
      alignItems: 'center'
    }}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search games..."
        style={{
          flex: 1,
          padding: '0.75rem 1rem',
          fontSize: '1rem',
          backgroundColor: '#1a1a1a',
          color: '#ffffff',
          border: '1px solid var(--border-color)',
          borderRadius: '6px',
          outline: 'none',
          transition: 'border-color 0.2s ease'
        }}
        onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
        onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
      />
      
      <button
        type="submit"
        style={{
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          fontWeight: '600',
          backgroundColor: 'var(--primary-color)',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          whiteSpace: 'nowrap'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#0066cc';
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 4px 12px rgba(74, 158, 255, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'var(--primary-color)';
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = 'none';
        }}
      >
        Search
      </button>

      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          style={{
            padding: '0.75rem 1rem',
            fontSize: '1rem',
            fontWeight: '600',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'var(--bg-hover)';
            e.target.style.borderColor = 'var(--primary-color)';
            e.target.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'var(--bg-card)';
            e.target.style.borderColor = 'var(--border-color)';
            e.target.style.color = 'var(--text-secondary)';
          }}
        >
          Clear
        </button>
      )}
    </form>
  );
}
