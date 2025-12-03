import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET all ratings for a game
router.get('/:gameId', async (req, res) => {
  try {
    const query = await pool.query(`
      SELECT r.*, u.username
      FROM ratings r
      LEFT JOIN users u ON u.user_id = r.user_id
      WHERE r.game_id = $1
      ORDER BY r.rating_date DESC
    `, [req.params.gameId]);

    res.json(query.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new rating
router.post('/', async (req, res) => {
  const { rating_id, user_id, game_id, rating_value, rating_text } = req.body;

  try {
    const result = await pool.query(`
      INSERT INTO ratings (rating_id, user_id, game_id, rating_value, rating_text)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [rating_id, user_id, game_id, rating_value, rating_text]);

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
