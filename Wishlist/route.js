const express = require("express");
const router = express.Router();
const addToWishlist  = require("./controller");

router.post("/addtowishlist/:user_id", addToWishlist.saveToWishlist);
router.post("/sync/:user_id", addToWishlist.saveToWishlist);
router.get("/getwishlist/:user_id", addToWishlist.getWishlist);
router.delete("/wishlistdelete/:user_id/:product_id", addToWishlist.deleteWishlist);

module.exports = router;