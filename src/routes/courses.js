const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM programs');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:program_code', async (req, res) => {
  const { program_code } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM programs WHERE program_code = $1',
      [program_code]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Program not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
