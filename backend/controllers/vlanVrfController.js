const db = require('../config/db');

// Buat VLAN
exports.createVLAN = (req, res) => {
  const { name, vlan_id, description } = req.body;
  if (!name || !vlan_id) return res.status(400).json({ message: 'Nama dan VLAN ID wajib diisi' });

  const sql = 'INSERT INTO vlan (name, vlan_id, description) VALUES (?, ?, ?)';
  db.query(sql, [name, vlan_id, description], (err, result) => {
    if (err) return res.status(400).json({ message: err.message });
    res.status(201).json({ id: result.insertId, message: 'VLAN berhasil ditambahkan' });
  });
};

// Ambil Semua VLAN
exports.getAllVLANs = (req, res) => {
  db.query('SELECT * FROM vlan', (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ vlans: results });
  });
};

// Buat VRF
exports.createVRF = (req, res) => {
  const { name, route_distinguisher, description } = req.body;
  if (!name || !route_distinguisher) return res.status(400).json({ message: 'Nama dan Route Distinguisher wajib diisi' });

  const sql = 'INSERT INTO vrf (name, route_distinguisher, description) VALUES (?, ?, ?)';
  db.query(sql, [name, route_distinguisher, description], (err, result) => {
    if (err) return res.status(400).json({ message: err.message });
    res.status(201).json({ id: result.insertId, message: 'VRF berhasil ditambahkan' });
  });
};

// Ambil Semua VRF
exports.getAllVRFs = (req, res) => {
  db.query('SELECT * FROM vrf', (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ vrfs: results });
  });
};
