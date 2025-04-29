const express = require('express');
const router = express.Router();
const controller = require('../controllers/vlanVrfController');

// Route untuk VLAN dan VRF
router.get('/', controller.getAllVLANs);  // Mengambil semua VLAN & VRF
router.post('/vlan', controller.createVLAN);  // Menambah VLAN
router.post('/vrf', controller.createVRF);  // Menambah VRF

module.exports = router;
