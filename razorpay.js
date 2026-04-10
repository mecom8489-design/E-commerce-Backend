require("dotenv").config();
const Razorpay = require("razorpay");

console.log("Loaded RAZORPAY KEY ID:", process.env.RAZORPAY_KEY_ID); // Debug

const razor = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = razor;
