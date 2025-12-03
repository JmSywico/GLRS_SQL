import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get recommendations for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user's favorite genres based on their library
    const favoriteGenres = await pool.query(
      `SELECT g.genre_name, COUNT(*) as count
       FROM user_library ul
       JOIN game_genres gg ON ul.game_id = gg.game_id
       JOIN genres g ON gg.genre_id = g.genre_id
       WHERE ul.user_id = $1 AND ul.ownership_status = 'owned'
       GROUP BY g.genre_id, g.genre_name
       ORDER BY count DESC
       LIMIT 3`,
      [userId]
    );

    let recommendedGames;
    let recommendationType;

    if (favoriteGenres.rows.length > 0) {
      // Genre-based recommendations
      const genreIds = await pool.query(
        `SELECT genre_id FROM genres WHERE genre_name = ANY($1)`,
        [favoriteGenres.rows.map(g => g.genre_name)]
      );

      recommendedGames = await pool.query(
        `SELECT DISTINCT g.game_id, g.title, g.release_year, d.developer_name,
                COALESCE(AVG(r.rating), 0) as avg_rating,
                COUNT(DISTINCT gg.genre_id) as genre_match_count
         FROM games g
         LEFT JOIN developers d ON g.developer_id = d.developer_id
         LEFT JOIN ratings r ON g.game_id = r.game_id
         JOIN game_genres gg ON g.game_id = gg.game_id
         WHERE gg.genre_id = ANY($1)
           AND g.game_id NOT IN (
             SELECT game_id FROM user_library WHERE user_id = $2
           )
         GROUP BY g.game_id, g.title, g.release_year, d.developer_name
         ORDER BY genre_match_count DESC, avg_rating DESC
         LIMIT 12`,
        [genreIds.rows.map(g => g.genre_id), userId]
      );

      recommendationType = 'genre_based';
    } else {
      // Popular games as fallback
      recommendedGames = await pool.query(
        `SELECT g.game_id, g.title, g.release_year, d.developer_name,
                COALESCE(AVG(r.rating), 0) as avg_rating,
                COUNT(r.rating_id) as rating_count
         FROM games g
         LEFT JOIN developers d ON g.developer_id = d.developer_id
         LEFT JOIN ratings r ON g.game_id = r.game_id
         WHERE g.game_id NOT IN (
           SELECT game_id FROM user_library WHERE user_id = $1
         )
         GROUP BY g.game_id, g.title, g.release_year, d.developer_name
         HAVING COUNT(r.rating_id) > 0
         ORDER BY avg_rating DESC, rating_count DESC
         LIMIT 12`,
        [userId]
      );

      recommendationType = 'popular';
    }

    res.json({
      recommendation_type: recommendationType,
      favorite_genres: favoriteGenres.rows.map(g => g.genre_name),
      games: recommendedGames.rows
    });

  } catch (err) {
    console.error('Error fetching recommendations:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;