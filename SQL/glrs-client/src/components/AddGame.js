import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddGame({ userId }) {
  const navigate = useNavigate();
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    developer_id: '',
    release_year: '',
    description: ''
  });

  useEffect(() => {
    // Fetch developers for dropdown
    fetch('http://localhost:4000/developers')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch developers');
        return res.json();
      })
      .then(data => {
        setDevelopers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching developers:', err);
        setDevelopers([]);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Submitting game data:', formData); // Debug log

    try {
      const res = await fetch(`http://localhost:4000/games/admin/add?user_id=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      console.log('Server response:', data); // Debug log

      if (!res.ok) {
        throw new Error(data.error || 'Failed to add game');
      }

      alert('Game added successfully!');
      navigate('/admin');
    } catch (error) {
      console.error('Error adding game:', error);
      alert(error.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1>Add New Game</h1>
      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'var(--bg-card)',
        padding: '2rem',
        borderRadius: '8px',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Developer *</label>
          <select
            value={formData.developer_id}
            onChange={(e) => setFormData({ ...formData, developer_id: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)'
            }}
          >
            <option value="">Select Developer</option>
            {developers.map(dev => (
              <option key={dev.developer_id} value={dev.developer_id}>
                {dev.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Release Year</label>
          <input
            type="number"
            value={formData.release_year}
            onChange={(e) => setFormData({ ...formData, release_year: e.target.value })}
            min="1970"
            max="2030"
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)'
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows="4"
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" className="btn btn-primary">Add Game</button>
          <button 
            type="button" 
            onClick={() => navigate('/admin')} 
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}