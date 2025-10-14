const express = require("express");
const router = express.Router();
const ordersController =require("../../Controllers/AdminControl/ordersController")

router.get("/getAllOrders", ordersController.getAllOrders);

module.exports = router;
