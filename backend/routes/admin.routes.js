const express = require('express');
const db = require('../db');
const { verifyToken, checkRole } = require('../middleware/auth.middleware');
const router = express.Router();

// Admin Dashboard: Get total counts
router.get('/dashboard', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const [[users]] = await db.execute('SELECT COUNT(*) AS totalUsers FROM users');
    const [[stores]] = await db.execute('SELECT COUNT(*) AS totalStores FROM stores');
    const [[ratings]] = await db.execute('SELECT COUNT(*) AS totalRatings FROM ratings');

    res.json({
      totalUsers: users.totalUsers,
      totalStores: stores.totalStores,
      totalRatings: ratings.totalRatings,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
});

// Admin: Add a new user (normal/store_owner/admin)
router.post('/add-user', verifyToken, checkRole(['admin']), async (req, res) => {
  const { name, email, password, address, role } = req.body;

  if (!name || !email || !password || !role || !address) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if email already exists
    const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, address, role]
    );

    res.status(201).json({ message: 'User added successfully' });
  } catch (err) {
    console.error('Admin add user error:', err);
    res.status(500).json({ error: 'Failed to add user' });
  }
});

// Admin: List users with optional filters + sorting
router.get('/users', verifyToken, checkRole(['admin']), async (req, res) => {
  const {
    name = '',
    email = '',
    address = '',
    role = '',
    sortBy = 'name',
    order = 'asc',
  } = req.query;

  const allowedSorts = ['name', 'email', 'role'];
  const allowedOrder = ['asc', 'desc'];

  const sortColumn = allowedSorts.includes(sortBy) ? sortBy : 'name';
  const sortDirection = allowedOrder.includes(order.toLowerCase()) ? order.toUpperCase() : 'ASC';

  try {
    const [users] = await db.execute(
      `SELECT 
         u.id,
         u.name,
         u.email,
         u.address,
         u.role,
         ROUND(AVG(r.rating), 2) AS averageRating
       FROM users u
       LEFT JOIN stores s ON s.owner_id = u.id
       LEFT JOIN ratings r ON r.store_id = s.id
       WHERE u.name LIKE ? AND u.email LIKE ? AND u.address LIKE ? AND u.role LIKE ?
       GROUP BY u.id
       ORDER BY u.${sortColumn} ${sortDirection}`,
      [`%${name}%`, `%${email}%`, `%${address}%`, `%${role}%`]
    );
    res.json(users);
  } catch (err) {
    console.error('Failed to fetch users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});



// Admin: List stores with ratings + sorting
router.get('/stores', verifyToken, checkRole(['admin']), async (req, res) => {
  const { sortBy = 'name', order = 'asc' } = req.query;

  const allowedSorts = ['name', 'email', 'rating'];
  const allowedOrder = ['asc', 'desc'];

  const sortColumn = allowedSorts.includes(sortBy) ? sortBy : 'name';
  const sortDirection = allowedOrder.includes(order.toLowerCase()) ? order.toUpperCase() : 'ASC';

  try {
    const [stores] = await db.execute(
      `SELECT s.id, s.name, s.email, s.address,
              COALESCE(ROUND(AVG(r.rating), 2), 0) AS rating
       FROM stores s
       LEFT JOIN ratings r ON s.id = r.store_id
       GROUP BY s.id
       ORDER BY ${sortColumn === 'rating' ? 'rating' : 's.' + sortColumn} ${sortDirection}`
    );

    res.json(stores);
  } catch (err) {
    console.error('Admin fetch stores error:', err);
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
});

module.exports = router;