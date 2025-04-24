const express = require('express');
const router = express.Router();
const controller = require('../controllers/subnetController');

// Endpoint
router.post('/', controller.createSubnet);
router.get('/', controller.getAllSubnets);
router.put('/:id', controller.updateSubnet);
router.delete('/:id', controller.deleteSubnet);

module.exports = router;
