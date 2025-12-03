import express from 'express';
import pool from '../db.js';

const router = express.Router();

// IMPORTANT: Specific routes MUST come BEFORE generic routes

// Get all genres (MUST be before '/:id')
router.get('/genres', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT genre_id, genre_name 
       FROM genres 
       ORDER BY genre_name`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching genres:', error);
    res.status(500).json({ error: 'Failed to fetch genres' });
  }
});

// Get all platforms (MUST be before '/:id')
router.get('/platforms', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT platform_id, platform_name 
       FROM platforms 
       ORDER BY platform_name`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching platforms:', error);
    res.status(500).json({ error: 'Failed to fetch platforms' });
  }
});

// Get all games with optional filtering
router.get('/', async (req, res) => {
  try {
    const { search, genre, platform } = req.query;
    
    let query = `
      SELECT DISTINCT
        g.game_id,
        g.title,
        g.developer_id,
        g.release_year,
        d.developer_name,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(DISTINCT r.rating_id) as rating_count
      FROM games g
      LEFT JOIN developers d ON g.developer_id = d.developer_id
      LEFT JOIN ratings r ON g.game_id = r.game_id
    `;
    
    const conditions = [];
    const params = [];
    let paramCount = 1;

    // Add genre filter
    if (genre) {
      query += `
        INNER JOIN game_genres gg ON g.game_id = gg.game_id
        INNER JOIN genres gen ON gg.genre_id = gen.genre_id
      `;
      conditions.push(`gen.genre_name = $${paramCount}`);
      params.push(genre);
      paramCount++;
    }

    // Add platform filter
    if (platform) {
      query += `
        INNER JOIN game_platforms gp ON g.game_id = gp.game_id
        INNER JOIN platforms p ON gp.platform_id = p.platform_id
      `;
      conditions.push(`p.platform_name = $${paramCount}`);
      params.push(platform);
      paramCount++;
    }

    // Add search filter
    if (search) {
      conditions.push(`(LOWER(g.title) LIKE $${paramCount} OR LOWER(d.developer_name) LIKE $${paramCount})`);
      params.push(`%${search.toLowerCase()}%`);
      paramCount++;
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += `
      GROUP BY g.game_id, g.title, g.developer_id, g.release_year, d.developer_name
      ORDER BY g.title
    `;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

// Get a single game by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const gameResult = await pool.query(
      `SELECT 
        g.game_id,
        g.title,
        g.developer_id,
        g.description,
        g.release_year,
        g.created_at,
        d.developer_name,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(DISTINCT r.rating_id) as rating_count
      FROM games g
      LEFT JOIN developers d ON g.developer_id = d.developer_id
      LEFT JOIN ratings r ON g.game_id = r.game_id
      WHERE g.game_id = $1
      GROUP BY g.game_id, g.title, g.developer_id, g.description, g.release_year, g.created_at, d.developer_name`,
      [id]
    );
    
    if (gameResult.rows.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    const game = gameResult.rows[0];
    
    const genresResult = await pool.query(
      `SELECT gen.genre_name
       FROM game_genres gg
       JOIN genres gen ON gg.genre_id = gen.genre_id
       WHERE gg.game_id = $1`,
      [id]
    );
    
    const platformsResult = await pool.query(
      `SELECT p.platform_name
       FROM game_platforms gp
       JOIN platforms p ON gp.platform_id = p.platform_id
       WHERE gp.game_id = $1`,
      [id]
    );
    
    game.genres = genresResult.rows.map(row => row.genre_name);
    game.platforms = platformsResult.rows.map(row => row.platform_name);
    
    res.json(game);
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({ error: 'Failed to fetch game details' });
  }
});

export default router;
