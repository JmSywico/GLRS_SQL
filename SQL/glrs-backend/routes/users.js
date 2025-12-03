import express from 'express';
import pool from '../db.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

// Hardcoded demo credentials - UPDATED to match database
const DEMO_USERS = {
  'AdminMaster': { password: 'admin123', user_id: 'U001', email: 'admin@glrs.com' },
  'ModRanger': { password: 'mod123', user_id: 'U002', email: 'moderator@glrs.com' },
  'AnalyticsGuy': { password: 'analytics123', user_id: 'U003', email: 'analytics@glrs.com' },
  'PlayerNova': { password: 'nova123', user_id: 'U004', email: 'nova@example.com' },
  'NightWolf': { password: 'wolf123', user_id: 'U005', email: 'wolf@example.com' },
  'PixelQueen': { password: 'queen123', user_id: 'U006', email: 'queen@example.com' },
  'RetroKid': { password: 'retro123', user_id: 'U007', email: 'retro@example.com' },
  'GamerJay': { password: 'jay123', user_id: 'U008', email: 'jay@example.com' },
  'LunaByte': { password: 'luna123', user_id: 'U009', email: 'luna@example.com' },
  'ShadowCore': { password: 'shadow123', user_id: 'U010', email: 'shadow@example.com' },
};

// Counter for generating new user IDs
let userCounter = 11;

// Login endpoint - Check database passwords
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check if it's a demo user with simple password
    const demoUser = DEMO_USERS[username];
    if (demoUser && demoUser.password === password) {
      // Query database for full user info
      const dbResult = await pool.query(
        `SELECT u.user_id, u.username, u.email, r.role_name
         FROM users u
         JOIN roles r ON u.role_id = r.role_id
         WHERE u.user_id = $1`,
        [demoUser.user_id]
      );

      if (dbResult.rows.length > 0) {
        return res.json(dbResult.rows[0]);
      }
    }

    // If not found in demo users, return error
    return res.status(401).json({ error: 'Invalid username or password' });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Registration endpoint - Simple in-memory storage (same as demo users)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // Check if username already exists
    if (DEMO_USERS[username]) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // Generate new user ID
    const newUserId = `U${String(userCounter).padStart(3, '0')}`;
    userCounter++;

    // Add to DEMO_USERS (same as hardcoded users)
    DEMO_USERS[username] = {
      password: password,
      user_id: newUserId,
      email: email
    };

    res.status(201).json({
      message: 'User created successfully',
      user: {
        user_id: newUserId,
        username: username,
        email: email,
        role_name: 'Player'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Get all users (for admin)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.user_id, u.username, u.email, r.role_name
       FROM users u
       JOIN roles r ON u.role_id = r.role_id
       ORDER BY u.user_id`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
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

// Admin: Delete user
router.delete('/admin/:userId', requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    console.log('Deleting user:', userId);

    // Delete related data first (foreign key constraints)
    await pool.query('DELETE FROM ratings WHERE user_id = $1', [userId]);
    await pool.query('DELETE FROM user_library WHERE user_id = $1', [userId]);
    await pool.query('DELETE FROM play_sessions WHERE user_id = $1', [userId]);

    // Now delete the user
    const result = await pool.query(
      'DELETE FROM users WHERE user_id = $1 RETURNING *',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User deleted successfully:', result.rows[0]);
    res.json({ message: 'User deleted successfully', user: result.rows[0] });
  } catch (error) {
    console.error('Error deleting user:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to delete user', details: error.message });
  }
});

export default router;



