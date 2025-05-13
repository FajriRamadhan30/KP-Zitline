require("dotenv").config();
const express = require("express");
const cors = require("cors");

const ipRoutes = require("./routes/ipRoutes");
const subnetRoutes = require("./routes/subnetRoutes");
const vlanVrfRoutes = require('./routes/vlanVrfRoutes');
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const ipLogger = require("./middleware/ipLogger");
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(ipLogger);

// Routes
app.use("/api/ips", ipRoutes);
app.use("/api/subnets", subnetRoutes);
app.use('/api/vlanvrf', vlanVrfRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use('/api/users', userRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("🌐 IP Address Management API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
