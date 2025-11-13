const express = require("express");
const router = express.Router();
const orderController = require("./Controller");

router.post("/create", orderController.createOrder);
router.get("/all", orderController.getAllOrders);
router.get("/:id", orderController.getOrderById);

module.exports = router;
