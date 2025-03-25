const express = require('express');
const router = express.Router();
const { 
  getAllIPs, 
  createIP, 
  deleteIP, 
  getIPLogs 
} = require('../controllers/ipController');

// Endpoints
router.get('/', getAllIPs);
router.post('/', createIP);
router.delete('/:id', deleteIP);
router.get('/logs', getIPLogs);

module.exports = router;
