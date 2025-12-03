import express from 'express';
import pool from '../db.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

// IMPORTANT: Specific routes MUST come BEFORE generic routes

// Get all ratings (for admin) - MUST be before /:gameId
router.get('/all', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.rating_id, r.user_id, r.game_id, r.rating, r.review_text,
              u.username, g.title as game_title
       FROM ratings r
       JOIN users u ON r.user_id = u.user_id
       JOIN games g ON r.game_id = g.game_id
       ORDER BY r.rating_id DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching all ratings:', error);
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
});

// Get all ratings for a specific game
router.get('/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const result = await pool.query(
      `SELECT r.*, u.username 
       FROM ratings r 
       JOIN users u ON r.user_id = u.user_id 
       WHERE r.game_id = $1 
       ORDER BY r.created_at DESC`,
      [gameId]
    );
    
    // Always return an array, even if empty
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching ratings:', err);
    // Return empty array on error instead of error object
    res.status(500).json([]);
  }
});

// Get a specific user's rating for a game
router.get('/:gameId/:userId', async (req, res) => {
  try {
    const { gameId, userId } = req.params;
    const result = await pool.query(
      `SELECT * FROM ratings 
       WHERE game_id = $1 AND user_id = $2`,
      [gameId, userId]
    );
    
    res.json(result.rows[0] || null);
  } catch (err) {
    console.error('Error fetching user rating:', err);
    res.status(500).json({ error: err.message });
  }
});

// Add or update a rating
router.post('/', async (req, res) => {
  try {
    const { user_id, game_id, rating, review_text } = req.body;
    
    // Check if rating already exists
    const existing = await pool.query(
      'SELECT rating_id FROM ratings WHERE user_id = $1 AND game_id = $2',
      [user_id, game_id]
    );
    
    let result;
    if (existing.rows.length > 0) {
      // Update existing rating
      result = await pool.query(
        `UPDATE ratings 
         SET rating = $1, review_text = $2, created_at = NOW()
         WHERE user_id = $3 AND game_id = $4
         RETURNING *`,
        [rating, review_text, user_id, game_id]
      );
    } else {
      // Generate new rating_id only for new ratings
      // Use a more robust method: find the max ID and increment
      const maxIdResult = await pool.query(
        `SELECT rating_id FROM ratings 
         WHERE rating_id ~ '^R[0-9]+$'
         ORDER BY CAST(SUBSTRING(rating_id FROM 2) AS INTEGER) DESC 
         LIMIT 1`
      );
      
      let newId;
      if (maxIdResult.rows.length > 0) {
        const maxId = maxIdResult.rows[0].rating_id;
        const numPart = parseInt(maxId.substring(1)) + 1;
        newId = `R${String(numPart).padStart(3, '0')}`;
      } else {
        newId = 'R001';
      }
      
      // Insert new rating
      result = await pool.query(
        `INSERT INTO ratings (rating_id, user_id, game_id, rating, review_text, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())
         RETURNING *`,
        [newId, user_id, game_id, rating, review_text]
      );
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error saving rating:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a rating
router.delete('/:ratingId', async (req, res) => {
  try {
    const { ratingId } = req.params;
    
    const result = await pool.query(
      'DELETE FROM ratings WHERE rating_id = $1 RETURNING *',
      [ratingId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Rating not found' });
    }
    
    res.json({ message: 'Rating deleted', rating: result.rows[0] });
  } catch (err) {
    console.error('Error deleting rating:', err);
    res.status(500).json({ error: err.message });
  }
});

// Admin: Delete rating
router.delete('/admin/:ratingId', requireAdmin, async (req, res) => {
  try {
    const { ratingId } = req.params;

    const result = await pool.query(
      'DELETE FROM ratings WHERE rating_id = $1 RETURNING *',
      [ratingId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Rating not found' });
    }

    res.json({ message: 'Rating deleted successfully' });
  } catch (error) {
    console.error('Error deleting rating:', error);
    res.status(500).json({ error: 'Failed to delete rating' });
  }
});

export default router;
