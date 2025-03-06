const express = require('express');
const cors = require('cors');
const { PORT } = require('./config/env');
const db = require('./config/db');

const app = express();
app.use(express.json());
app.use(cors());

// Import routes (Ensure these files exist and are correctly exporting `router`)
const authRoutes = require('./routes/authRoutes');
const diplomaRoutes = require('./routes/diplomaRoutes');
const userRoutes = require('./routes/userRoutes');

// Use the routers correctly
app.use('/api/auth', authRoutes);
app.use('/api/diplomas', diplomaRoutes);
app.use('/api/users', userRoutes);
// Test database connection route
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW() as current_time;');
    res.json({
      message: 'Database connected!',
      time: result.rows[0].current_time,
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ message: 'Failed to connect to the database' });
  }
});

// Start the server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
