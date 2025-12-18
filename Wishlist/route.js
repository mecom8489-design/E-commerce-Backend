const express = require("express");
const router = express.Router();
const addToWishlist  = require("./controller");

router.post("/addtowishlist", addToWishlist.saveToWishlist);
router.get("/getwishlist/:user_id", addToWishlist.getWishlist);
router.delete("/delete/:user_id/:product_id", addToWishlist.deleteWishlist);

module.exports = router;