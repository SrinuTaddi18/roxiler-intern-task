const express = require('express');
const db = require('../db');
const { verifyToken, checkRole } = require('../middleware/auth.middleware');
const router = express.Router();

// Add a store (Admin only)
router.post('/', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;
    await db.execute(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email, address, owner_id]
    );
    res.status(201).json({ message: 'Store added' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add store' });
  }
});

// Get all stores (Any logged-in user)
router.get('/', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM stores');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
});

module.exports = router;