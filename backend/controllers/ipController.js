const db = require('../config/db');

// ✅ Ambil Semua IP
exports.getAllIPs = (req, res) => {
  const sql = 'SELECT * FROM ip_addresses';
  db.query(sql, (err, results) => {
    if (err) res.status(500).json({ message: err.message });
    else res.json(results);
  });
};

// ✅ Buat IP Baru dengan Deteksi Konflik
exports.createIP = (req, res) => {
  const { ipAddress, subnet, assignedTo, description } = req.body;

  if (!ipAddress || !subnet) {
    return res.status(400).json({ message: 'IP Address dan Subnet wajib diisi' });
  }

  // 🔍 Cek apakah IP sudah ada
  const checkSql = 'SELECT * FROM ip_addresses WHERE ipAddress = ?';
  db.query(checkSql, [ipAddress], (checkErr, checkResults) => {
    if (checkErr) return res.status(500).json({ message: checkErr.message });

    if (checkResults.length > 0) {
      return res.status(409).json({ message: '⚠️ IP Address sudah digunakan!' });
    }

    // ✅ Lanjut insert jika tidak ada konflik
    const sql = `
      INSERT INTO ip_addresses 
      (ipAddress, subnet, assignedTo, description, status) 
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(sql, [ipAddress, subnet, assignedTo || 'Available', description, 'Available'], (err, result) => {
      if (err) res.status(400).json({ message: err.message });
      else res.status(201).json({ id: result.insertId });
    });
  });
};

// ✅ Update IP (dengan status)
exports.updateIP = (req, res) => {
  const { ipAddress, subnet, assignedTo, description, status } = req.body;
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'ID tidak ditemukan di URL' });
  }

  const sql = `
    UPDATE ip_addresses 
    SET 
      ipAddress = ?, 
      subnet = ?, 
      assignedTo = ?, 
      description = ?, 
      status = ?
    WHERE id = ?
  `;

  db.query(sql, [ipAddress, subnet, assignedTo, description, status, id], (err, result) => {
    if (err) res.status(500).json({ message: err.message });
    else if (result.affectedRows === 0) res.status(404).json({ message: '❌ Data tidak ditemukan' });
    else res.json({ message: '✅ IP Address berhasil diupdate' });
  });
};

// ✅ Hapus IP
exports.deleteIP = (req, res) => {
  const sql = 'DELETE FROM ip_addresses WHERE id = ?';
  db.query(sql, [req.params.id], (err) => {
    if (err) res.status(400).json({ message: err.message });
    else res.json({ message: '🗑️ IP Address berhasil dihapus' });
  });
};

// ✅ Ambil Log Akses IP
exports.getIPLogs = (req, res) => {
  const sql = 'SELECT * FROM access_logs ORDER BY timestamp DESC';
  db.query(sql, (err, results) => {
    if (err) res.status(500).json({ message: err.message });
    else res.json(results);
  });
};
