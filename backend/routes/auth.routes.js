const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { verifyToken } = require('../middleware/auth.middleware');
const { createUser, findUserByEmail } = require('../models/user.model');
const router = express.Router();

// User Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, address } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser({ name, email, password: hashedPassword, address });
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(500).json({ error: 'Signup failed' });
  }
});

// User Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
});

// View Profile
router.get('/profile', verifyToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const [[user]] = await db.execute('SELECT id, name, email, address, role FROM users WHERE id = ?', [userId]);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update Profile
router.put('/profile', verifyToken, async (req, res) => {
  const { name, address } = req.body;
  const userId = req.user.id;

  if (!name || name.length < 3 || name.length > 60 || !address || address.length > 400) {
    return res.status(400).json({ error: 'Invalid name or address' });
  }

  try {
    await db.execute('UPDATE users SET name = ?, address = ? WHERE id = ?', [name, address, userId]);
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Update Password
router.put('/password', verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const [[user]] = await db.execute('SELECT password FROM users WHERE id = ?', [userId]);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await db.execute('UPDATE users SET password = ? WHERE id = ?', [hashed, userId]);

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete Account
router.delete('/profile', verifyToken, async (req, res) => {
  const userId = req.user.id;
  try {
    await db.execute('DELETE FROM ratings WHERE user_id = ?', [userId]);
    await db.execute('DELETE FROM users WHERE id = ?', [userId]);
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete account' });
  }
});

module.exports = router;