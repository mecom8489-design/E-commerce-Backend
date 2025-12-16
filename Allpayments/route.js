const express = require("express");
const router = express.Router();
const paymentsController = require("./controller");

router.get("/all", paymentsController.getAllPayments);

module.exports = router;
