// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/AuthRoutes/authRoutes");
const resetpassRoutes = require("./routes/AuthRoutes/resetpassRoutes");
const categoryRoutes = require("./routes/AdminRoutes/categoryRoutes");
const userRoutes = require("./routes/AdminRoutes/usersRoutes");
const adminstatus = require("./routes/AdminRoutes/mainDashboardRoutes");
const productRoutes = require("./routes/AdminRoutes/productRoutes");
const ordersRoutes= require("./routes/AdminRoutes/ordersRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads folder for static access
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", resetpassRoutes);
app.use("/api/admin", categoryRoutes);
app.use("/api/admin", userRoutes);
app.use("/api/admin", adminstatus);
app.use("/api/admin", productRoutes);
app.use("/api/admin", ordersRoutes);




// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


