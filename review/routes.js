const express = require("express");
const router = express.Router();
const reviewController = require("../review/Controller");

router.post("/add", reviewController.createReview);
router.get("/reviews", reviewController.getAllReviews);
module.exports = router;
