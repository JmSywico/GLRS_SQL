import pool from '../db.js';

export async function requireAdmin(req, res, next) {
  try {
    // Get user_id from query params, body, or params
    const userId = req.query.user_id || req.body.user_id || req.params.userId;
    
    console.log('Admin check for user:', userId); // Debug log
    
    if (!userId) {
      return res.status(401).json({ error: 'User ID required' });
    }

    const result = await pool.query(
      `SELECT r.role_name 
       FROM users u
       JOIN roles r ON u.role_id = r.role_id
       WHERE u.user_id = $1`,
      [userId]
    );

    console.log('User role:', result.rows); // Debug log

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (result.rows[0].role_name !== 'Admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(500).json({ error: 'Authorization failed' });
  }
}