import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Hardcoded demo credentials
const DEMO_USERS = {
  'alice_wonder': { password: 'pass123', user_id: 'U001' },
  'bob_builder': { password: 'pass456', user_id: 'U002' },
  'charlie_dev': { password: 'pass789', user_id: 'U003' },
  'diana_designer': { password: 'pass101', user_id: 'U004' },
  'eve_explorer': { password: 'pass202', user_id: 'U005' },
  'frank_fortress': { password: 'pass303', user_id: 'U006' },
  'grace_gamer': { password: 'pass404', user_id: 'U007' },
  'hank_hero': { password: 'pass505', user_id: 'U008' },
  'ivy_innovator': { password: 'pass606', user_id: 'U009' },
  'jack_jumper': { password: 'pass707', user_id: 'U010' },
  'karen_knight': { password: 'pass808', user_id: 'U011' },
  'leo_legend': { password: 'pass909', user_id: 'U012' },
};

// Login endpoint - Simple string match
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check hardcoded credentials
    const user = DEMO_USERS[username];
    
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Get user details from database
    const result = await pool.query(
      `SELECT u.user_id, u.username, u.email, r.role_name
       FROM users u
       JOIN roles r ON u.role_id = r.role_id
       WHERE u.user_id = $1`,
      [user.user_id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found in database' });
    }

    const userDetails = result.rows[0];
    res.json({
      user_id: userDetails.user_id,
      username: userDetails.username,
      email: userDetails.email,
      role_name: userDetails.role_name
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get all users (for admin purposes, optional)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.user_id, u.username, u.email, r.role_name
       FROM users u
       JOIN roles r ON u.role_id = r.role_id
       ORDER BY u.username`
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT u.user_id, u.username, u.email, u.bio, u.created_at, r.role_name
       FROM users u
       JOIN roles r ON u.role_id = r.role_id
       WHERE u.user_id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;



