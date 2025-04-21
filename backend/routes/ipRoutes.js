const express = require('express');
const router = express.Router();
const { 
  getAllIPs, 
  createIP, 
  deleteIP, 
  updateIP,   // Tambahkan fungsi update baru
  getIPLogs 
} = require('../controllers/ipController');

// Endpoints
router.get('/', getAllIPs);               // Menampilkan semua IP
router.post('/', createIP);              // Menambahkan IP baru
router.put('/:id', updateIP);            // Mengupdate IP berdasarkan ID
router.delete('/:id', deleteIP);         // Menghapus IP berdasarkan ID
router.get('/logs', getIPLogs);          // Menampilkan log akses

module.exports = router;
