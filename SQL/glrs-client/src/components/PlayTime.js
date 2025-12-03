import { useState, useEffect, useCallback } from 'react';

export default function PlayTime({ userId, gameId, gameName }) {
  const [activeSession, setActiveSession] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [totalStats, setTotalStats] = useState({ total_hours: 0, session_count: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const fetchActiveSession = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:4000/play-sessions/user/${userId}/game/${gameId}/active`);
      if (!res.ok) throw new Error('Failed to fetch active session');
      const data = await res.json();
      setActiveSession(data);
    } catch (err) {
      console.error('Error fetching active session:', err);
    }
  }, [userId, gameId]);

  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:4000/play-sessions/user/${userId}/game/${gameId}`);
      if (!res.ok) throw new Error('Failed to fetch sessions');
      const data = await res.json();
      setSessions(Array.isArray(data) ? data : []);
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError(err.message);
      setSessions([]);
      setLoading(false);
    }
  }, [userId, gameId]);

  const fetchTotalStats = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:4000/play-sessions/user/${userId}/game/${gameId}/total`);
      if (!res.ok) throw new Error('Failed to fetch stats');
      const data = await res.json();
      setTotalStats(data || { total_hours: 0, session_count: 0 });
    } catch (err) {
      console.error('Error fetching total stats:', err);
      setTotalStats({ total_hours: 0, session_count: 0 });
    }
  }, [userId, gameId]);

  useEffect(() => {
    fetchActiveSession();
    fetchSessions();
    fetchTotalStats();
  }, [fetchActiveSession, fetchSessions, fetchTotalStats]);

  useEffect(() => {
    let interval;
    if (activeSession) {
      interval = setInterval(() => {
        const start = new Date(activeSession.play_start);
        const now = new Date();
        const diff = (now - start) / 1000 / 60 / 60;
        setElapsedTime(diff);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeSession]);

  const startSession = async () => {
    try {
      const res = await fetch('http://localhost:4000/play-sessions/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, game_id: gameId })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to start session');
      }
      
      const data = await res.json();
      setActiveSession(data);
      setElapsedTime(0);
    } catch (err) {
      console.error('Error starting session:', err);
      alert(err.message);
    }
  };

  const endSession = async () => {
    try {
      const res = await fetch('http://localhost:4000/play-sessions/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playtime_id: activeSession.playtime_id })
      });
      
      if (!res.ok) throw new Error('Failed to end session');
      
      setActiveSession(null);
      setElapsedTime(0);
      fetchSessions();
      fetchTotalStats();
    } catch (err) {
      console.error('Error ending session:', err);
      alert('Failed to end session');
    }
  };

  const formatTime = (hours) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    const s = Math.floor(((hours - h) * 60 - m) * 60);
    return `${h}h ${m}m ${s}s`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: '8px',
      padding: '1.5rem',
      marginTop: '1.5rem'
    }}>
      <h2 style={{ marginBottom: '1rem' }}>⏱️ Play Time Tracking</h2>

      {error && (
        <div style={{ 
          padding: '1rem', 
          backgroundColor: 'var(--danger)', 
          color: 'white', 
          borderRadius: '6px',
          marginBottom: '1rem'
        }}>
          Error: {error}
        </div>
      )}

      {/* Stats Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem',
        padding: '1rem',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '6px'
      }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Time</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--accent-primary)' }}>
            {Number(totalStats.total_hours || 0).toFixed(1)}h
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Sessions</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--accent-primary)' }}>
            {totalStats.session_count || 0}
          </div>
        </div>
        {activeSession && (
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Current Session</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--success)' }}>
              {formatTime(elapsedTime)}
            </div>
          </div>
        )}
      </div>

      {/* Start/Stop Button */}
      <div style={{ marginBottom: '1.5rem' }}>
        {activeSession ? (
          <button 
            onClick={endSession}
            className="btn btn-secondary"
            style={{ 
              backgroundColor: 'var(--danger)',
              color: 'white',
              border: 'none'
            }}
          >
            ⏹️ Stop Playing
          </button>
        ) : (
          <button 
            onClick={startSession}
            className="btn btn-primary"
          >
            ▶️ Start Playing
          </button>
        )}
      </div>

      {/* Session History */}
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Session History</h3>
        {loading ? (
          <p style={{ color: 'var(--text-secondary)' }}>Loading sessions...</p>
        ) : sessions.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No play sessions yet. Start playing to track your time!</p>
        ) : (
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {sessions.map((session) => (
              <div 
                key={session.playtime_id}
                style={{
                  padding: '0.75rem',
                  marginBottom: '0.5rem',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    {formatDate(session.play_start)}
                  </div>
                  {session.play_end && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      to {formatDate(session.play_end)}
                    </div>
                  )}
                </div>
                <div style={{ 
                  fontSize: '1rem', 
                  fontWeight: '600',
                  color: 'var(--accent-primary)'
                }}>
                  {session.duration_hours ? `${Number(session.duration_hours).toFixed(2)}h` : 'In Progress'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}