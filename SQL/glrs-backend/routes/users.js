import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

router.get('/:id/library', async (req, res) => {
  const id = req.params.id;

  const q = await pool.query(`
    SELECT g.title, ul.ownership_status, ul.date_added
    FROM user_library ul
    JOIN games g ON g.game_id = ul.game_id
    WHERE ul.user_id = $1
    ORDER BY ul.date_added DESC
  `, [id]);

  res.json(q.rows);
});

// GET playtime per game
router.get('/:id/playtime', async (req, res) => {
  const userId = req.params.id;

  try {
    const query = await pool.query(`
      SELECT 
        ps.game_id,
        g.title,
        SUM(ps.total_minutes) AS total_minutes
      FROM play_sessions ps
      JOIN games g ON g.game_id = ps.game_id
      WHERE ps.user_id = $1
      GROUP BY ps.game_id, g.title
      ORDER BY total_minutes DESC;
    `, [userId]);

    res.json(query.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;



