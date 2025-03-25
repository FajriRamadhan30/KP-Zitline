require('dotenv').config();
const express = require('express');
const cors = require('cors');
const ipRoutes = require('./routes/ipRoutes');
const ipLogger = require('./middleware/ipLogger');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(ipLogger); // Logger untuk mencatat IP

// Routes
app.use('/api/ips', ipRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
