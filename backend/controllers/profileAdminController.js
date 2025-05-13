const db = require('../config/db');
const jwt = require('jsonwebtoken');

// ===============================
// GET ADMIN PROFILE
// ===============================
exports.getProfile = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token tidak diberikan' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminId = decoded.id;

    db.query('SELECT id, username FROM admin WHERE id = ?', [adminId], (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      if (results.length === 0) return res.status(404).json({ message: 'Admin tidak ditemukan' });
      res.json(results[0]);
    });
  } catch (error) {
    return res.status(401).json({ message: 'Token tidak valid' });
  }
};

// ===============================
// UPDATE ADMIN PROFILE
// ===============================
exports.updateProfile = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token tidak diberikan' });
  }

  const token = authHeader.split(' ')[1];
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan password wajib diisi' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminId = decoded.id;

    db.query(
      'UPDATE admin SET username = ?, password = ? WHERE id = ?',
      [username, password, adminId],
      (err, result) => {
        if (err) return res.status(500).json({ message: 'Gagal update profil' });
        res.json({ message: 'Profil berhasil diperbarui' });
      }
    );
  } catch (error) {
    return res.status(401).json({ message: 'Token tidak valid' });
  }
};
