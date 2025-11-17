const express = require("express");
const router = express.Router();
const Controller = require("./Controller");



router.post("/add", Controller.createOrder);

router.get("/all", Controller.getAllOrders);

module.exports = router;
