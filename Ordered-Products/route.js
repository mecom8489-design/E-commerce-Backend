const express = require("express");
const router = express.Router();
const orderController = require("./Controller");

router.post("/create", orderController.createOrder);
router.get("/all", orderController.getAllOrders);
router.get("/:id", orderController.getOrderById);
router.put("/cancel/:order_id", orderController.cancelOrder);
router.put("/update-delivery/:order_id", orderController.updateDeliveryDate);


module.exports = router;
