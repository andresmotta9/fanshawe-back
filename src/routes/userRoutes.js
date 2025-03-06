const express = require('express');
const db = require('../config/db');

const router = express.Router();

// GET all users (Temporary, including password hashes)
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, username, password_hash FROM admin_users;'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error retrieving users' });
  }
});

module.exports = router;
