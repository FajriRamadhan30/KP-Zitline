// backend/routes/adminAuth.js

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Cari user
    const [rows] = await db.execute('SELECT * FROM admin_users WHERE username = ?', [username]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Username atau password salah" });
    }

    const admin = rows[0];

    // Check password (plain text)
    if (password !== admin.password) {
      return res.status(401).json({ error: "Username atau password salah" });
    }

    // Check aktif
    if (admin.is_active !== 1) {
      return res.status(403).json({ error: "Akun belum aktif, hubungi admin" });
    }

    // Generate token
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      'your_secret_key', // Ganti secret key di .env nanti
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: "Login berhasil",
      user: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
      },
      token,
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
