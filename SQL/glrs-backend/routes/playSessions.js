import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get all play sessions for a user's game
router.get('/user/:userId/game/:gameId', async (req, res) => {
  try {
    const { userId, gameId } = req.params;
    
    const result = await pool.query(`
      SELECT 
        ps.playtime_id,
        ps.play_start,
        ps.play_end,
        ps.total_minutes,
        COALESCE(ps.total_minutes / 60.0, 0) AS duration_hours,
        g.title AS game_title
      FROM play_sessions ps
      JOIN games g ON ps.game_id = g.game_id
      WHERE ps.user_id = $1 AND ps.game_id = $2
      ORDER BY ps.play_start DESC
    `, [userId, gameId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching play sessions:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get active session for a user's game
router.get('/user/:userId/game/:gameId/active', async (req, res) => {
  try {
    const { userId, gameId } = req.params;
    
    const result = await pool.query(`
      SELECT 
        playtime_id,
        play_start,
        game_id,
        user_id
      FROM play_sessions
      WHERE user_id = $1 AND game_id = $2 AND play_end IS NULL
      LIMIT 1
    `, [userId, gameId]);
    
    res.json(result.rows[0] || null);
  } catch (error) {
    console.error('Error fetching active session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start a new play session
router.post('/start', async (req, res) => {
  try {
    const { user_id, game_id } = req.body;
    
    // Check if there's already an active session
    const activeCheck = await pool.query(`
      SELECT playtime_id FROM play_sessions
      WHERE user_id = $1 AND game_id = $2 AND play_end IS NULL
    `, [user_id, game_id]);
    
    if (activeCheck.rowCount > 0) {
      return res.status(400).json({ error: 'Session already active for this game' });
    }
    
    // Generate playtime_id (PT + timestamp)
    const playtime_id = 'PT' + Date.now();
    
    const result = await pool.query(`
      INSERT INTO play_sessions (playtime_id, user_id, game_id, play_start)
      VALUES ($1, $2, $3, NOW())
      RETURNING playtime_id, play_start, user_id, game_id
    `, [playtime_id, user_id, game_id]);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error starting session:', error);
    res.status(500).json({ error: error.message });
  }
});

// End a play session
router.post('/end', async (req, res) => {
  try {
    const { playtime_id } = req.body;
    
    const result = await pool.query(`
      UPDATE play_sessions
      SET 
        play_end = NOW(),
        total_minutes = EXTRACT(EPOCH FROM (NOW() - play_start)) / 60
      WHERE playtime_id = $1 AND play_end IS NULL
      RETURNING 
        playtime_id,
        play_start,
        play_end,
        total_minutes,
        total_minutes / 60.0 AS duration_hours
    `, [playtime_id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Active session not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error ending session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get total play time for a user's game
router.get('/user/:userId/game/:gameId/total', async (req, res) => {
  try {
    const { userId, gameId } = req.params;
    
    const result = await pool.query(`
      SELECT 
        COALESCE(SUM(total_minutes) / 60.0, 0) AS total_hours,
        COUNT(*) AS session_count
      FROM play_sessions
      WHERE user_id = $1 AND game_id = $2 AND play_end IS NOT NULL
    `, [userId, gameId]);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching total play time:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;