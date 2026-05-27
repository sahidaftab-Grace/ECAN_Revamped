const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../db');
const { authenticate } = require('../middleware/auth');

// GET all users (only ID and username)
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, created_at FROM users ORDER BY username ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create user
router.post('/', authenticate, async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username, created_at',
      [username, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Username already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

// PUT update user (password only or username)
router.put('/:id', authenticate, async (req, res) => {
  const { username, password } = req.body;
  
  try {
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query(
        'UPDATE users SET username = COALESCE($1, username), password = $2 WHERE id = $3',
        [username, hashedPassword, req.params.id]
      );
    } else {
      await pool.query(
        'UPDATE users SET username = COALESCE($1, username) WHERE id = $2',
        [username, req.params.id]
      );
    }
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE user
router.delete('/:id', authenticate, async (req, res) => {
  try {
    // Prevent deleting self? (optional but good)
    if (req.user.id === req.params.id) {
        return res.status(400).json({ error: 'You cannot delete your own account' });
    }

    const result = await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'User not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
