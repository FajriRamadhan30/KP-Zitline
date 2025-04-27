const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const router = express.Router();

// Admin login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query(
    'SELECT * FROM admin WHERE username = ?',
    [username],
    (err, results) => {
      if (err) {
        console.error('Login Error:', err);
        return res.status(500).json({ message: 'Server Error' });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: 'Username tidak ditemukan' });
      }

      const user = results[0];

      if (user.password !== password) {
        return res.status(401).json({ message: 'Password salah' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({ token, username: user.username });
    }
  );
});

module.exports = router;
