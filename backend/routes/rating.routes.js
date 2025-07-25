const express = require('express');
const db = require('../db');
const { verifyToken, checkRole } = require('../middleware/auth.middleware');
const router = express.Router();

// Submit or update a rating (Normal User)
router.post('/', verifyToken, checkRole(['user']), async (req, res) => {
  const { store_id, rating } = req.body;
  const user_id = req.user.id;
  try {
    await db.execute(
      'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating = VALUES(rating)',
      [user_id, store_id, rating]
    );
    res.status(200).json({ message: 'Rating submitted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit rating' });
  }
});
// Get current user's ratings
router.get('/user', verifyToken, checkRole(['user']), async (req, res) => {
  const userId = req.user.id;
  try {
    const [ratings] = await db.execute(
      'SELECT store_id, rating FROM ratings WHERE user_id = ?',
      [userId]
    );
    res.json(ratings);
  } catch (err) {
    console.error('Failed to fetch user ratings:', err);
    res.status(500).json({ error: 'Failed to fetch user ratings' });
  }
});

// Get ratings by store owner
router.get('/store', verifyToken, checkRole(['store_owner']), async (req, res) => {
  try {
    const owner_id = req.user.id;
    const [ratings] = await db.execute(
      `SELECT u.name, r.rating, r.store_id
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       JOIN stores s ON s.id = r.store_id
       WHERE s.owner_id = ?`,
      [owner_id]
    );
    const [avg] = await db.execute(
      `SELECT AVG(r.rating) as averageRating
       FROM ratings r
       JOIN stores s ON r.store_id = s.id
       WHERE s.owner_id = ?`,
      [owner_id]
    );
    res.json({ ratings, averageRating: avg[0].averageRating });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch store ratings' });
  }
});

module.exports = router;
