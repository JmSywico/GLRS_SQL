import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get all developers
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT developer_id, developer_name as name FROM developers ORDER BY developer_name'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching developers:', error);
    res.status(500).json({ error: 'Failed to fetch developers' });
  }
});

export default router;