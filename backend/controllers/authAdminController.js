//====================================//
const db = require('../config/db');
//===================================//

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.loginAdmin = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan password wajib diisi' });
  }

  db.query('SELECT * FROM admin_users WHERE username = ?', [username], async (err, results) => {
    if (err) {
      console.error('❌ Database error:', err);
      return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: 'Username tidak ditemukan' });
    }

    const admin = results[0];

    // Cek akun aktif
    if (admin.is_active !== 1) {
      return res.status(403).json({ message: 'Akun tidak aktif. Hubungi administrator.' });
    }

    // Cek password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Password salah' });
    }

    // Generate token
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Update last_login
    db.query('UPDATE admin_users SET last_login = NOW() WHERE id = ?', [admin.id]);

    res.json({
      message: 'Login berhasil',
      token,
      username: admin.username,
    });
  });
};


//==================================//
//GET PROFIL ADMIN//
//==================================//

exports.getAdminProfile = (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token tidak diberikan' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminId = decoded.id;

    db.query('SELECT id, username, email FROM admin WHERE id = ?', [adminId], (err, results) => {
      if (err) {
        console.error('❌ Database error:', err);
        return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Admin tidak ditemukan' });
      }

      const adminProfile = results[0];
      res.json(adminProfile);
    });
  } catch (error) {
    console.error('❌ Token error:', error);
    return res.status(401).json({ message: 'Token tidak valid' });
  }
};

//===============================================//
//EDIT PROFILE//
//===============================================//

exports.updateAdminProfile = (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token tidak diberikan' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminId = decoded.id;
    const { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({ message: 'Username dan email wajib diisi' });
    }

    db.query(
      'UPDATE admin SET username = ?, email = ? WHERE id = ?',
      [username, email, adminId],
      (err, result) => {
        if (err) {
          console.error('❌ Database error:', err);
          return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
        }

        res.json({ message: 'Profil berhasil diperbarui' });
      }
    );
  } catch (error) {
    console.error('❌ Token error:', error);
    return res.status(401).json({ message: 'Token tidak valid' });
  }
};
