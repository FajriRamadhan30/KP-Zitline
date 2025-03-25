const db = require('../config/db');

// Ambil Semua IP
exports.getAllIPs = (req, res) => {
  const sql = 'SELECT * FROM ip_addresses';
  db.query(sql, (err, results) => {
    if (err) res.status(500).json({ message: err.message });
    else res.json(results);
  });
};

// Buat IP Baru
exports.createIP = (req, res) => {
  const { ipAddress, subnet, assignedTo, description } = req.body;
  if (!ipAddress || !subnet) {
    return res.status(400).json({ message: 'IP Address dan Subnet wajib diisi' });
  }
  
  const sql = 'INSERT INTO ip_addresses (ipAddress, subnet, assignedTo, description, status) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [ipAddress, subnet, assignedTo || 'Available', description, 'Available'], (err, result) => {
    if (err) res.status(400).json({ message: err.message });
    else res.status(201).json({ id: result.insertId });
  });
};

// Hapus IP
exports.deleteIP = (req, res) => {
  const sql = 'DELETE FROM ip_addresses WHERE id = ?';
  db.query(sql, [req.params.id], (err) => {
    if (err) res.status(400).json({ message: err.message });
    else res.json({ message: 'IP deleted' });
  });
};

// Ambil Log IP
exports.getIPLogs = (req, res) => {
  const sql = 'SELECT * FROM access_logs ORDER BY timestamp DESC';
  db.query(sql, (err, results) => {
    if (err) res.status(500).json({ message: err.message });
    else res.json(results);
  });
};
