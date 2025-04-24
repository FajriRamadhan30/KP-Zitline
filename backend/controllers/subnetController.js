const db = require('../config/db');

// Buat Subnet
exports.createSubnet = (req, res) => {
  const { subnet, type, description, vlan_id, vrf_id } = req.body;
  if (!subnet || !type) {
    return res.status(400).json({ message: 'Subnet dan Tipe wajib diisi' });
  }

  const sql = `
    INSERT INTO subnets (subnet, type, description, vlan_id, vrf_id) 
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(sql, [subnet, type, description || null, vlan_id || null, vrf_id || null], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.status(201).json({ id: result.insertId });
  });
};

// Ambil Semua Subnet
exports.getAllSubnets = (req, res) => {
  const sql = `
    SELECT s.*, v.name AS vlan_name, vr.name AS vrf_name
    FROM subnets s
    LEFT JOIN vlan v ON s.vlan_id = v.id
    LEFT JOIN vrf vr ON s.vrf_id = vr.id
    ORDER BY s.id DESC
  `;
  db.query(sql, (err, results) => {
    if (err) res.status(500).json({ message: err.message });
    else res.json(results);
  });
};

// Update Subnet
exports.updateSubnet = (req, res) => {
  const { id } = req.params;
  const { subnet, type, description, vlan_id, vrf_id } = req.body;

  if (!subnet || !type) {
    return res.status(400).json({ message: 'Subnet dan Tipe wajib diisi' });
  }

  const sql = `
    UPDATE subnets 
    SET subnet = ?, type = ?, description = ?, vlan_id = ?, vrf_id = ?
    WHERE id = ?
  `;
  db.query(sql, [subnet, type, description || null, vlan_id || null, vrf_id || null, id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Subnet tidak ditemukan' });
    res.json({ message: 'Subnet berhasil diupdate' });
  });
};

// Hapus Subnet
exports.deleteSubnet = (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM subnets WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Subnet tidak ditemukan' });
    res.json({ message: 'Subnet berhasil dihapus' });
  });
};
