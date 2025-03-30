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
const coursesRoutes = require('./routes/courses');
const questionsRoutes = require('./routes/questions');

// Use the routers correctly
app.use('/api/auth', authRoutes);
app.use('/api/diplomas', diplomaRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/fields', questionsRoutes);
// Test database connection route

// Start the server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
