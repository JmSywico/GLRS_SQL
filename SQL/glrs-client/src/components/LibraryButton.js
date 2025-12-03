import { useState, useEffect, useCallback } from 'react';

export default function LibraryButton({ userId, gameId, size = 'normal', onUpdate }) {
  const [libraryStatus, setLibraryStatus] = useState({ inLibrary: false, status: null });
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  const checkLibraryStatus = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:4000/library/check/${userId}/${gameId}`);
      
      if (!res.ok) {
        const text = await res.text();
        console.error('Server response:', text);
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setLibraryStatus(data);
      setLoading(false);
    } catch (err) {
      console.error('Error checking library status:', err);
      setLoading(false);
    }
  }, [userId, gameId]);

  useEffect(() => {
    checkLibraryStatus();
  }, [checkLibraryStatus]);

  const addToLibrary = async (status) => {
    try {
      console.log('Adding to library:', { user_id: userId, game_id: gameId, status }); // Debug log
      
      const res = await fetch('http://localhost:4000/library/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, game_id: gameId, status })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }

      setLibraryStatus({ inLibrary: true, status });
      setShowMenu(false);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Error adding to library:', err);
      alert(err.message);
    }
  };

  const updateStatus = async (status) => {
    try {
      const res = await fetch('http://localhost:4000/library/update-status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, game_id: gameId, status })
      });

      if (!res.ok) throw new Error('Failed to update status');

      setLibraryStatus({ inLibrary: true, status });
      setShowMenu(false);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    }
  };

  const removeFromLibrary = async () => {
    const statusText = libraryStatus.status === 'owned' ? 'library' : 'wishlist';
    
    if (!window.confirm(`Remove this game from your ${statusText}?`)) return;

    try {
      const res = await fetch('http://localhost:4000/library/remove', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, game_id: gameId })
      });

      if (!res.ok) throw new Error('Failed to remove from library');

      setLibraryStatus({ inLibrary: false, status: null });
      setShowMenu(false);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Error removing from library:', err);
      alert('Failed to remove from library');
    }
  };

  if (loading) {
    return (
      <button 
        className={`btn ${size === 'small' ? 'btn-small' : ''}`}
        disabled
        style={{ opacity: 0.5 }}
      >
        ...
      </button>
    );
  }

  const buttonStyle = size === 'small' ? {
    padding: '0.4rem 0.8rem',
    fontSize: '0.85rem'
  } : {};

  if (!libraryStatus.inLibrary) {
    return (
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <button 
          className="btn btn-primary"
          onClick={() => setShowMenu(!showMenu)}
          style={buttonStyle}
        >
          + Add to Library
        </button>

        {showMenu && (
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
              onClick={() => setShowMenu(false)}
            />
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: '0.5rem',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
              zIndex: 100,
              minWidth: '150px'
            }}>
              <button
                onClick={() => addToLibrary('owned')}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderBottom: '1px solid var(--border-color)'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-hover)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Mark as Owned
              </button>
              <button
                onClick={() => addToLibrary('wishlist')}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-hover)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Add to Wishlist
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button 
        className="btn btn-secondary"
        onClick={() => setShowMenu(!showMenu)}
        style={{
          ...buttonStyle,
          backgroundColor: libraryStatus.status === 'owned' ? 'var(--success)' : 'var(--warning)',
          color: 'white',
          border: 'none'
        }}
      >
        {libraryStatus.status === 'owned' ? '✓ Owned' : '⭐ Wishlist'}
      </button>

      {showMenu && (
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
            onClick={() => setShowMenu(false)}
          />
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '0.5rem',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
            zIndex: 100,
            minWidth: '150px'
          }}>
            {libraryStatus.status === 'wishlist' && (
              <button
                onClick={() => updateStatus('owned')}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderBottom: '1px solid var(--border-color)'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-hover)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                ✓ Mark as Owned
              </button>
            )}
            {libraryStatus.status === 'owned' && (
              <button
                onClick={() => updateStatus('wishlist')}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderBottom: '1px solid var(--border-color)'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-hover)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                ⭐ Move to Wishlist
              </button>
            )}
            <button
              onClick={removeFromLibrary}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: 'transparent',
                border: 'none',
                color: 'var(--danger)',
                textAlign: 'left',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-hover)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              ✕ Remove from {libraryStatus.status === 'owned' ? 'Library' : 'Wishlist'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}