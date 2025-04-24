const express = require('express');
const router = express.Router();
const controller = require('../controllers/vlanVrfController');

router.post('/vlans', controller.createVLAN);
router.get('/vlans', controller.getAllVLANs);
router.post('/vrfs', controller.createVRF);
router.get('/vrfs', controller.getAllVRFs);

module.exports = router;
