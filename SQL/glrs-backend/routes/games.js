import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

// Get all genres
router.get('/genres', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT genre_id, name 
      FROM genres 
      ORDER BY name
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching genres:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all platforms
router.get('/platforms', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT platform_id, name 
      FROM platforms 
      ORDER BY name
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching platforms:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all games with optional filtering
router.get('/', async (req, res) => {
  try {
    const { search, genres, platforms } = req.query;
    
    let query = `
      SELECT DISTINCT
        g.game_id,
        g.title,
        g.release_year,
        d.name AS developer_name,
        COALESCE(AVG(r.rating_value), 0) AS avg_rating
      FROM games g
      LEFT JOIN developers d ON g.developer_id = d.developer_id
      LEFT JOIN ratings r ON g.game_id = r.game_id
    `;

    const params = [];
    const conditions = [];
    let paramCount = 1;

    // Genre filter - add JOIN only if filtering by genre
    if (genres) {
      const genreIds = genres.split(',').map(id => parseInt(id.trim()));
      query += `
        INNER JOIN game_genres gg ON g.game_id = gg.game_id
      `;
      conditions.push(`gg.genre_id = ANY($${paramCount})`);
      params.push(genreIds);
      paramCount++;
    }

    // Platform filter - add JOIN only if filtering by platform
    if (platforms) {
      const platformIds = platforms.split(',').map(id => parseInt(id.trim()));
      query += `
        INNER JOIN game_platforms gp ON g.game_id = gp.game_id
      `;
      conditions.push(`gp.platform_id = ANY($${paramCount})`);
      params.push(platformIds);
      paramCount++;
    }

    // Search filter
    if (search) {
      conditions.push(`(LOWER(g.title) LIKE LOWER($${paramCount}) OR LOWER(d.name) LIKE LOWER($${paramCount}))`);
      params.push(`%${search}%`);
      paramCount++;
    }

    // Add WHERE clause if there are conditions
    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(' AND ');
    }

    query += `
      GROUP BY g.game_id, g.title, g.release_year, d.name
      ORDER BY g.title
    `;

    console.log('Executing query:', query);
    console.log('With params:', params);

    const result = await pool.query(query, params);
    
    console.log(`Found ${result.rows.length} games`);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get a single game by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const gameResult = await pool.query(`
      SELECT 
        g.*,
        d.name AS developer_name,
        COALESCE(AVG(r.rating_value), 0) AS avg_rating,
        COUNT(r.rating_id) AS rating_count
      FROM games g
      LEFT JOIN developers d ON g.developer_id = d.developer_id
      LEFT JOIN ratings r ON g.game_id = r.game_id
      WHERE g.game_id = $1
      GROUP BY g.game_id, d.name
    `, [id]);

    if (gameResult.rows.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const game = gameResult.rows[0];

    // Get genres
    const genresResult = await pool.query(`
      SELECT ge.name
      FROM game_genres gg
      JOIN genres ge ON gg.genre_id = ge.genre_id
      WHERE gg.game_id = $1
    `, [id]);
    game.genres = genresResult.rows.map(row => row.name);

    // Get platforms
    const platformsResult = await pool.query(`
      SELECT p.name
      FROM game_platforms gp
      JOIN platforms p ON gp.platform_id = p.platform_id
      WHERE gp.game_id = $1
    `, [id]);
    game.platforms = platformsResult.rows.map(row => row.name);

    res.json(game);
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
