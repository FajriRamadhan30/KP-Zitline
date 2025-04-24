const db = require('../config/db');

// Buat VLAN
exports.createVLAN = (req, res) => {
  const { name, vlan_id, description } = req.body;
  if (!name || !vlan_id) return res.status(400).json({ message: 'Nama dan VLAN ID wajib diisi' });

  const sql = 'INSERT INTO vlan (name, vlan_id, description) VALUES (?, ?, ?)';
  db.query(sql, [name, vlan_id, description], (err, result) => {
    if (err) res.status(400).json({ message: err.message });
    else res.status(201).json({ id: result.insertId });
  });
};

// Ambil Semua VLAN
exports.getAllVLANs = (req, res) => {
  db.query('SELECT * FROM vlan', (err, results) => {
    if (err) res.status(500).json({ message: err.message });
    else res.json(results);
  });
};

// Buat VRF
exports.createVRF = (req, res) => {
  const { name, route_distinguisher, description } = req.body;
  if (!name || !route_distinguisher) return res.status(400).json({ message: 'Nama dan Route Distinguisher wajib diisi' });

  const sql = 'INSERT INTO vrf (name, route_distinguisher, description) VALUES (?, ?, ?)';
  db.query(sql, [name, route_distinguisher, description], (err, result) => {
    if (err) res.status(400).json({ message: err.message });
    else res.status(201).json({ id: result.insertId });
  });
};

// Ambil Semua VRF
exports.getAllVRFs = (req, res) => {
  db.query('SELECT * FROM vrf', (err, results) => {
    if (err) res.status(500).json({ message: err.message });
    else res.json(results);
  });
};
