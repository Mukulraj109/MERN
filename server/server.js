require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const materialRoutes = require("./routes/materialRoutes");
const workstationRoutes = require("./routes/workstationRoutes");


const app = express();
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/workstation",workstationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
