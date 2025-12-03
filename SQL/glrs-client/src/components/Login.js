import { useState } from 'react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:4000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        onLogin(data.user_id);
      } else {
        setError(data.error || 'Invalid username or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '5rem auto',
      padding: '2rem',
      backgroundColor: 'var(--bg-card)',
      borderRadius: '8px',
      border: '1px solid var(--border-color)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
        Login to GLRS
      </h1>
      
      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{
            padding: '0.75rem',
            marginBottom: '1rem',
            backgroundColor: '#ff444420',
            border: '1px solid #ff4444',
            borderRadius: '4px',
            color: '#ff6666',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem',
            color: 'var(--text-secondary)',
            fontWeight: '500'
          }}>
            Username:
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              backgroundColor: '#1a1a1a',
              color: '#ffffff',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem',
            color: 'var(--text-secondary)',
            fontWeight: '500'
          }}>
            Password:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              backgroundColor: '#1a1a1a',
              color: '#ffffff',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !username || !password}
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            backgroundColor: (loading || !username || !password) ? '#444' : 'var(--primary-color)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: (loading || !username || !password) ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            transition: 'background-color 0.2s'
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#1a1a1a',
        borderRadius: '4px',
        border: '1px solid var(--border-color)'
      }}>
        <p style={{ 
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          marginBottom: '0.5rem',
          fontWeight: 'bold'
        }}>
          Demo Credentials:
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.25rem 0' }}>
          Username: <code style={{ color: '#4CAF50' }}>alice_wonder</code> | Password: <code style={{ color: '#4CAF50' }}>pass123</code>
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.25rem 0' }}>
          Username: <code style={{ color: '#4CAF50' }}>bob_builder</code> | Password: <code style={{ color: '#4CAF50' }}>pass456</code>
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.25rem 0' }}>
          Username: <code style={{ color: '#4CAF50' }}>charlie_dev</code> | Password: <code style={{ color: '#4CAF50' }}>pass789</code>
        </p>
      </div>
    </div>
  );
}