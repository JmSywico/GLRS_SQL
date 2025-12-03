import express from 'express';
import pool from '../db.js';
import { requireAdmin } from '../middleware/adminAuth.js';

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

// Admin: Add new game
router.post('/admin/add', requireAdmin, async (req, res) => {
  try {
    const { title, developer_id, release_year, description } = req.body;

    if (!title || !developer_id) {
      return res.status(400).json({ error: 'Title and developer are required' });
    }

    const result = await pool.query(
      `INSERT INTO games (title, developer_id, release_year, description)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, developer_id, release_year, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding game:', error);
    res.status(500).json({ error: 'Failed to add game' });
  }
});

// Admin: Update game
router.put('/admin/:gameId', requireAdmin, async (req, res) => {
  try {
    const { gameId } = req.params;
    const { title, developer_id, release_year, description } = req.body;

    const result = await pool.query(
      `UPDATE games 
       SET title = $1, developer_id = $2, release_year = $3, description = $4
       WHERE game_id = $5
       RETURNING *`,
      [title, developer_id, release_year, description, gameId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating game:', error);
    res.status(500).json({ error: 'Failed to update game' });
  }
});

// Admin: Delete game
router.delete('/admin/:gameId', requireAdmin, async (req, res) => {
  try {
    const { gameId } = req.params;

    console.log('Deleting game:', gameId);

    // Delete related data first (foreign key constraints)
    await pool.query('DELETE FROM ratings WHERE game_id = $1', [gameId]);
    await pool.query('DELETE FROM user_library WHERE game_id = $1', [gameId]);
    await pool.query('DELETE FROM play_sessions WHERE game_id = $1', [gameId]);
    await pool.query('DELETE FROM game_genres WHERE game_id = $1', [gameId]);
    await pool.query('DELETE FROM game_platforms WHERE game_id = $1', [gameId]);

    // Now delete the game
    const result = await pool.query(
      'DELETE FROM games WHERE game_id = $1 RETURNING *',
      [gameId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }

    console.log('Game deleted successfully:', result.rows[0]);
    res.json({ message: 'Game deleted successfully', game: result.rows[0] });
  } catch (error) {
    console.error('Error deleting game:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to delete game', details: error.message });
  }
});

export default router;
