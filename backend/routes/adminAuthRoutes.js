// adminAuthRoutes.js (VERSI YANG DIKOREKSI DAN AMAN)
const express = require('express');

const router = express.Router();
const adminController = require('../controllers/authAdminController'); // Import controller yang aman

// Admin login
router.post('/login', adminController.loginAdmin);


// Rute untuk profil
router.get('/profile', adminController.getAdminProfile); // Asumsi getAdminProfile ada di authAdminController
router.put('/profile', adminController.updateAdminProfile); // Asumsi updateAdminProfile ada di authAdminController

module.exports = router;