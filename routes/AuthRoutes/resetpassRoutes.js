const express = require("express");
const router = express.Router();
const resetpassController = require("../../Controllers/authControl/resetpassController");

router.post("/get-otp", resetpassController.requestOtp);
router.post("/verify-otp", resetpassController.verifyOtp);
router.post("/reset-password", resetpassController.resetPassword);

module.exports = router;
