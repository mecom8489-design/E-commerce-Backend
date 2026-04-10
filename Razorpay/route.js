const express = require("express");
const router = express.Router();
const Controller = require("./controller");

router.post("/RazorpayOrderRoute", Controller.creatRazor);

router.post("/verifypayment", Controller.verifypayment);

module.exports = router;