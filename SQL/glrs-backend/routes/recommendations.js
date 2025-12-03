import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

// Get personalized game recommendations for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = req.query.limit || 10;

    // Get user's favorite genres based on their library and ratings
    const genresQuery = await pool.query(`
      SELECT ge.genre_id, ge.name, COUNT(*) as count, AVG(r.rating_value) as avg_rating
      FROM user_library ul
      JOIN game_genres gg ON ul.game_id = gg.game_id
      JOIN genres ge ON gg.genre_id = ge.genre_id
      LEFT JOIN ratings r ON ul.game_id = r.game_id AND r.user_id = ul.user_id
      WHERE ul.user_id = $1
      GROUP BY ge.genre_id, ge.name
      ORDER BY avg_rating DESC NULLS LAST, count DESC
      LIMIT 5
    `, [userId]);

    if (genresQuery.rows.length === 0) {
      // User has no library, recommend popular games
      const popularGames = await pool.query(`
        SELECT DISTINCT
          g.game_id,
          g.title,
          g.release_year,
          d.name AS developer_name,
          COALESCE(AVG(r.rating_value), 0) AS avg_rating,
          COUNT(DISTINCT ul.user_id) AS popularity
        FROM games g
        LEFT JOIN developers d ON g.developer_id = d.developer_id
        LEFT JOIN ratings r ON g.game_id = r.game_id
        LEFT JOIN user_library ul ON g.game_id = ul.game_id
        GROUP BY g.game_id, g.title, g.release_year, d.name
        ORDER BY popularity DESC, avg_rating DESC
        LIMIT $1
      `, [limit]);

      return res.json({
        recommendation_type: 'popular',
        favorite_genres: [],
        games: popularGames.rows
      });
    }

    const favoriteGenres = genresQuery.rows.map(g => g.genre_id);
    const genreNames = genresQuery.rows.map(g => g.name);

    // Get games in user's favorite genres that they don't own
    const recommendations = await pool.query(`
      SELECT DISTINCT
        g.game_id,
        g.title,
        g.release_year,
        d.name AS developer_name,
        COALESCE(AVG(r.rating_value), 0) AS avg_rating,
        COUNT(DISTINCT gg.genre_id) AS genre_match_count
      FROM games g
      LEFT JOIN developers d ON g.developer_id = d.developer_id
      LEFT JOIN game_genres gg ON g.game_id = gg.game_id
      LEFT JOIN ratings r ON g.game_id = r.game_id
      WHERE gg.genre_id = ANY($1)
        AND g.game_id NOT IN (
          SELECT game_id FROM user_library WHERE user_id = $2
        )
      GROUP BY g.game_id, g.title, g.release_year, d.name
      ORDER BY genre_match_count DESC, avg_rating DESC
      LIMIT $3
    `, [favoriteGenres, userId, limit]);

    res.json({
      recommendation_type: 'genre_based',
      favorite_genres: genreNames,
      games: recommendations.rows
    });

  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get similar users (users with similar taste)
router.get('/user/:userId/similar-users', async (req, res) => {
  try {
    const { userId } = req.params;

    const similarUsers = await pool.query(`
      WITH user_games AS (
        SELECT game_id FROM user_library WHERE user_id = $1
      ),
      other_users AS (
        SELECT 
          ul.user_id,
          u.username,
          COUNT(*) as shared_games,
          ARRAY_AGG(DISTINCT g.title) as shared_titles
        FROM user_library ul
        JOIN users u ON ul.user_id = u.user_id
        JOIN games g ON ul.game_id = g.game_id
        WHERE ul.game_id IN (SELECT game_id FROM user_games)
          AND ul.user_id != $1
        GROUP BY ul.user_id, u.username
        HAVING COUNT(*) >= 3
        ORDER BY shared_games DESC
        LIMIT 5
      )
      SELECT * FROM other_users
    `, [userId]);

    res.json(similarUsers.rows);
  } catch (error) {
    console.error('Error finding similar users:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;