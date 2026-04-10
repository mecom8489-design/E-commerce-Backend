const express = require("express");
const router = express.Router();
const paymentsController = require("./controller");

router.get("/allpayments", paymentsController.getAllPayments);

module.exports = router;
