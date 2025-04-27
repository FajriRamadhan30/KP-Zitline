// backend/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const ipRoutes = require('./routes/ipRoutes');
const subnetRoutes = require('./routes/subnetRoutes');
const vlanVrfRoutes = require('./routes/vlanVrfRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const ipLogger = require('./middleware/ipLogger');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(ipLogger); // Mencatat IP pengakses dan waktu akses

// Routes
app.use('/api/ips', ipRoutes);            // Manajemen IP Address
app.use('/api/subnets', subnetRoutes);     // Manajemen Subnet
app.use('/api/vlan-vrf', vlanVrfRoutes);   // Manajemen VLAN & VRF
app.use('/api/admin', adminAuthRoutes);    // Login Admin

// Default route
app.get('/', (req, res) => {
  res.send('🌐 IP Address Management API is running...');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
