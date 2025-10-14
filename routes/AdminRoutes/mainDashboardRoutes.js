const express = require("express");
const router = express.Router();
const statusController = require("../../Controllers/AdminControl/mainDashboard");

router.get("/adminsts", statusController.getUserStatus);
router.get("/recentOrders", statusController.getrecentOrders);


module.exports = router;
