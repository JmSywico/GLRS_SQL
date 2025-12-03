import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Add game to user's library
router.post('/add', async (req, res) => {
  try {
    const { user_id, game_id, status } = req.body;

    console.log('Received status:', status); // Debug log

    // Check if already in library
    const existingEntry = await pool.query(`
      SELECT * FROM user_library 
      WHERE user_id = $1 AND game_id = $2
    `, [user_id, game_id]);

    if (existingEntry.rowCount > 0) {
      return res.status(400).json({ error: 'Game already in library' });
    }

    const result = await pool.query(`
      INSERT INTO user_library (user_id, game_id, ownership_status, date_added)
      VALUES ($1, $2, $3::ownership_status_t, NOW())
      RETURNING *
    `, [user_id, game_id, status]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error adding to library:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update library entry status
router.put('/update-status', async (req, res) => {
  try {
    const { user_id, game_id, status } = req.body;

    const result = await pool.query(`
      UPDATE user_library
      SET ownership_status = $1
      WHERE user_id = $2 AND game_id = $3
      RETURNING *
    `, [status, user_id, game_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Library entry not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: error.message });
  }
});

// Remove game from library
router.delete('/remove', async (req, res) => {
  try {
    const { user_id, game_id } = req.body;

    const result = await pool.query(`
      DELETE FROM user_library
      WHERE user_id = $1 AND game_id = $2
      RETURNING *
    `, [user_id, game_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Library entry not found' });
    }

    res.json({ message: 'Game removed from library', game: result.rows[0] });
  } catch (error) {
    console.error('Error removing from library:', error);
    res.status(500).json({ error: error.message });
  }
});

// Check if game is in user's library
router.get('/check/:userId/:gameId', async (req, res) => {
  try {
    const { userId, gameId } = req.params;

    const result = await pool.query(`
      SELECT ownership_status FROM user_library
      WHERE user_id = $1 AND game_id = $2
    `, [userId, gameId]);

    if (result.rowCount === 0) {
      return res.json({ inLibrary: false, status: null });
    }

    res.json({ inLibrary: true, status: result.rows[0].ownership_status });
  } catch (error) {
    console.error('Error checking library:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's library
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await pool.query(
      `SELECT 
        ul.game_id,
        g.title,
        ul.ownership_status,
        ul.date_added
      FROM user_library ul
      JOIN games g ON ul.game_id = g.game_id
      WHERE ul.user_id = $1
      ORDER BY ul.date_added DESC`,
      [userId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch library' });
  }
});

export default router;