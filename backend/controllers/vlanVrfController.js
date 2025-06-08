const db = require('../config/db');

// PERBAIKAN: Disederhanakan karena tidak ada relasi vrf_id
exports.createVLAN = (req, res) => {
  const { name, vlan_id, description } = req.body; 
  if (!name || !vlan_id) return res.status(400).json({ message: 'Nama dan VLAN ID wajib diisi' });

  const sql = 'INSERT INTO vlan (name, vlan_id, description) VALUES (?, ?, ?)';
  db.query(sql, [name, vlan_id, description], (err, result) => {
    if (err) return res.status(400).json({ message: err.message });
    res.status(201).json({ id: result.insertId, message: 'VLAN berhasil ditambahkan' });
  });
};

// PERBAIKAN: Disesuaikan dengan nama kolom 'route_distinguisher' dari database
exports.createVRF = (req, res) => {
  const { name, route_distinguisher, description } = req.body;
  if (!name || !route_distinguisher) return res.status(400).json({ message: 'Nama dan Route Distinguisher wajib diisi' });

  const sql = 'INSERT INTO vrf (name, route_distinguisher, description) VALUES (?, ?, ?)';
  db.query(sql, [name, route_distinguisher, description], (err, result) => {
    if (err) return res.status(400).json({ message: err.message });
    res.status(201).json({ id: result.insertId, message: 'VRF berhasil ditambahkan' });
  });
};

// PERBAIKAN: Menghapus query JOIN yang menyebabkan error
exports.getAllData = (req, res) => {
  const vlanQuery = 'SELECT * FROM vlan'; // Query VLAN tanpa JOIN
  const vrfQuery = 'SELECT * FROM vrf';

  db.query(vlanQuery, (err, vlanResults) => {
    if (err) return res.status(500).json({ message: err.message, source: 'vlanQuery' });

    db.query(vrfQuery, (err, vrfResults) => {
      if (err) return res.status(500).json({ message: err.message, source: 'vrfQuery' });
      
      res.json({ vlans: vlanResults, vrfs: vrfResults });
    });
  });
};