import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const q = await pool.query(`SELECT game_id, title, release_year FROM games ORDER BY title`);
  res.json(q.rows);
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;

  const gameQ = await pool.query(`
    SELECT g.*, d.name AS developer
    FROM games g
    LEFT JOIN developers d ON g.developer_id = d.developer_id
    WHERE g.game_id = $1
  `, [id]);

  if (gameQ.rowCount === 0) 
    return res.status(404).json({ error: 'Game not found' });

  const genresQ = await pool.query(`
    SELECT ge.name FROM game_genres gg 
    JOIN genres ge ON ge.genre_id = gg.genre_id
    WHERE gg.game_id = $1
  `, [id]);

  const platformsQ = await pool.query(`
    SELECT p.name FROM game_platforms gp
    JOIN platforms p ON p.platform_id = gp.platform_id
    WHERE gp.game_id = $1
  `, [id]);

  res.json({
    ...gameQ.rows[0],
    genres: genresQ.rows.map(g => g.name),
    platforms: platformsQ.rows.map(p => p.name),
  });
});

// /games/search?query=...&genre=...&platform=...
router.get("/search/filter", async (req, res) => {
  const { query, genre, platform } = req.query;

  let sql = `
    SELECT DISTINCT g.game_id, g.title, g.release_year 
    FROM games g
    LEFT JOIN game_genres gg ON g.game_id = gg.game_id
    LEFT JOIN genres ge ON ge.genre_id = gg.genre_id
    LEFT JOIN game_platforms gp ON g.game_id = gp.game_id
    LEFT JOIN platforms p ON p.platform_id = gp.platform_id
    WHERE 1=1
  `;

  const params = [];
  
  if (query) {
    params.push(`%${query}%`);
    sql += ` AND g.title ILIKE $${params.length}`;
  }

  if (genre) {
    params.push(genre);
    sql += ` AND ge.name = $${params.length}`;
  }

  if (platform) {
    params.push(platform);
    sql += ` AND p.name = $${params.length}`;
  }

  const result = await pool.query(sql, params);
  res.json(result.rows);
});


export default router;
