const express = require('express');
const router = express.Router();

// Example route (temporary)
router.get('/test', (req, res) => {
  res.json({ message: 'Auth route working!' });
});

module.exports = router;
