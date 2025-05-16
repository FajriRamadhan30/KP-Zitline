// controllers/dashboardController.js
const db = require('../config/db');

exports.getDashboardStats = (req, res) => {
  const stats = {};

  const queries = {
    totalIPs: 'SELECT COUNT(*) AS count FROM ip_addresses',
    usedIPs: 'SELECT COUNT(*) AS count FROM users WHERE id_ip IS NOT NULL',
    totalSubnets: 'SELECT COUNT(DISTINCT subnet) AS count FROM ip_addresses',
    userDistribution: 'SELECT location AS name, COUNT(*) AS count FROM users GROUP BY location',
    osDistribution: 'SELECT os AS name, COUNT(*) AS count FROM users GROUP BY os'
  };

  let completed = 0;
  const totalQueries = Object.keys(queries).length;

  for (const key in queries) {
    db.query(queries[key], (err, result) => {
      if (err) {
        console.error(`Query error at ${key}:`, err);
        return res.status(500).json({ message: 'Gagal mengambil data dashboard', error: err });
      }

      stats[key] = result;
      completed++;

      if (completed === totalQueries) {
        // Hitung available IPs
        stats.availableIPs = [{ count: stats.totalIPs[0].count - stats.usedIPs[0].count }];
        res.json(stats);
      }
    });
  }
};
