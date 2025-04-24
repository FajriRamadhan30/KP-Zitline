require('dotenv').config();
const express = require('express');
const cors = require('cors');

const ipRoutes = require('./routes/ipRoutes');
const subnetRoutes = require('./routes/subnetRoutes');
const vlanVrfRoutes = require('./routes/vlanVrfRoutes');
const ipLogger = require('./middleware/ipLogger');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(ipLogger); // Mencatat IP pengakses dan waktu akses

// Routes
app.use('/api/ips', ipRoutes);         // Manajemen IP
app.use('/api/subnets', subnetRoutes); // Manajemen Subnet
app.use('/api/vlan-vrf', vlanVrfRoutes);   // Route VLAN & VRF management

// Default route
app.get('/', (req, res) => {
  res.send('🌐 IP Address Management API is running...');
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
