const db = require('../config/db');

const ipLogger = (req, res, next) => {
  const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'];
  const endpoint = req.originalUrl;

  const sql = 'INSERT INTO access_logs (ipAddress, userAgent, endpoint) VALUES (?, ?, ?)';
  db.query(sql, [ipAddress, userAgent, endpoint], (err) => {
    if (err) console.error('❌ Error logging IP:', err.message);
  });

  console.log(`🌐 IP Logged: ${ipAddress} - ${endpoint}`);
  next();
};

module.exports = ipLogger;
