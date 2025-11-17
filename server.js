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
const contactusRoutes= require("./routes/userRoutes/contactusRoutes");
const supportRoutes= require("./routes/AdminRoutes/supportRoutes");
const OrderedProducts = require("./Ordered-Products/route");
const ExclusivelyAvailable = require("./Exclusively-Available/route")
const app = express();

// Middleware
app.use(cors({ origin: '*', credentials: true }));
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
app.use("/api/admin", supportRoutes);
app.use("/api/admin", ExclusivelyAvailable);


//Rotes user
app.use("/api/user", contactusRoutes);
app.use("/api/ordered", OrderedProducts);



// Start server
const PORT = process.env.PORT || 5001;
const DOMAIN ="e-commerce-backend-production-6fa0.up.railway.app";

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Server ready");
  if (DOMAIN) {
    console.log(`Public URL → https://${DOMAIN}`);
  }
});




//  const PORT = 3000;

// app.listen(PORT, "localhost", () => {
//   console.log("🚀 Server ready");
//   console.log(`Public URL → http://localhost:${PORT}`);
// });
