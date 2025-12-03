import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get active session for a user and game
router.get('/user/:userId/game/:gameId/active', async (req, res) => {
  try {
    const { userId, gameId } = req.params;
    const result = await pool.query(
      `SELECT * FROM play_sessions 
       WHERE user_id = $1 AND game_id = $2 AND session_end IS NULL`,
      [userId, gameId]
    );
    res.json(result.rows[0] || null);
  } catch (err) {
    console.error('Error fetching active session:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get all sessions for a user and game
router.get('/user/:userId/game/:gameId', async (req, res) => {
  try {
    const { userId, gameId } = req.params;
    const result = await pool.query(
      `SELECT *, 
        EXTRACT(EPOCH FROM (session_end - session_start))/3600 as duration_hours
       FROM play_sessions 
       WHERE user_id = $1 AND game_id = $2 
       ORDER BY session_start DESC`,
      [userId, gameId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching sessions:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get total stats for a user and game
router.get('/user/:userId/game/:gameId/total', async (req, res) => {
  try {
    const { userId, gameId } = req.params;
    const result = await pool.query(
      `SELECT 
        COALESCE(SUM(duration_minutes)/60, 0) as total_hours,
        COUNT(*) as session_count
       FROM play_sessions 
       WHERE user_id = $1 AND game_id = $2 AND session_end IS NOT NULL`,
      [userId, gameId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching total stats:', err);
    res.status(500).json({ error: err.message });
  }
});

// Start a new play session
router.post('/start', async (req, res) => {
  try {
    const { user_id, game_id } = req.body;
    
    // Check for existing active session
    const activeCheck = await pool.query(
      `SELECT * FROM play_sessions WHERE user_id = $1 AND game_id = $2 AND session_end IS NULL`,
      [user_id, game_id]
    );
    
    if (activeCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Active session already exists' });
    }
    
    // Generate new session_id
    const countResult = await pool.query('SELECT COUNT(*) FROM play_sessions');
    const newId = `P${String(parseInt(countResult.rows[0].count) + 1).padStart(3, '0')}`;
    
    const result = await pool.query(
      `INSERT INTO play_sessions (session_id, user_id, game_id, session_start) 
       VALUES ($1, $2, $3, NOW()) 
       RETURNING *`,
      [newId, user_id, game_id]
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error starting session:', err);
    res.status(500).json({ error: err.message });
  }
});

// End a play session
router.post('/end', async (req, res) => {
  try {
    const { session_id } = req.body;
    
    const result = await pool.query(
      `UPDATE play_sessions 
       SET session_end = NOW(),
           duration_minutes = EXTRACT(EPOCH FROM (NOW() - session_start))/60
       WHERE session_id = $1 AND session_end IS NULL 
       RETURNING *`,
      [session_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Active session not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error ending session:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;