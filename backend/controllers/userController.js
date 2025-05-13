const db = require('../config/db');

// Fungsi untuk mengecek apakah IP sudah digunakan user lain
function isIpInUse(id_ip, excludeId = null) {
  return new Promise((resolve, reject) => {
    const sql = excludeId
      ? "SELECT * FROM users WHERE id_ip = ? AND id != ?"
      : "SELECT * FROM users WHERE id_ip = ?";
    const params = excludeId ? [id_ip, excludeId] : [id_ip];

    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results.length > 0); // true jika IP sudah dipakai
    });
  });
}

// Ambil semua user dan IP
exports.getAllUsers = (req, res) => {
    const sql = `
      SELECT u.id, u.name, u.location, u.os, ip.ipAddress, u.id_ip
      FROM users u
      LEFT JOIN ip_addresses ip ON u.id_ip = ip.id
    `;
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json({ message: 'Gagal ambil data' });
      res.json(results);
    });
  };
  

// Tambah user dengan validasi IP unik
exports.createUser = async (req, res) => {
  const { name, location, os, id_ip } = req.body;

  try {
    const ipUsed = await isIpInUse(id_ip);
    if (ipUsed) {
      return res.status(400).json({ message: "IP sudah digunakan oleh user lain." });
    }

    const sql = "INSERT INTO users (name, location, os, id_ip) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, location, os, id_ip], (err, result) => {
      if (err) return res.status(500).json({ message: "Gagal tambah user" });
      res.status(201).json({ message: "Berhasil" });
    });
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan saat memeriksa IP." });
  }
};

// Update user dengan validasi IP tidak dipakai user lain
exports.updateUser = async (req, res) => {
  const { name, location, os, id_ip } = req.body;
  const id = req.params.id;

  try {
    const ipUsed = await isIpInUse(id_ip, id);
    if (ipUsed) {
      return res.status(400).json({ message: "IP sudah digunakan oleh user lain." });
    }

    const sql = "UPDATE users SET name=?, location=?, os=?, id_ip=? WHERE id=?";
    db.query(sql, [name, location, os, id_ip, id], (err) => {
      if (err) return res.status(500).json({ message: "Gagal update user" });
      res.json({ message: "Berhasil" });
    });
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan saat memeriksa IP." });
  }
};

// Hapus user
exports.deleteUser = (req, res) => {
  const sql = "DELETE FROM users WHERE id=?";
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: "Gagal hapus user" });
    res.json({ message: "Berhasil" });
  });
};
