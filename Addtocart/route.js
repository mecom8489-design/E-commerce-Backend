const express = require("express");
const router = express.Router();
const addtocart  = require("./controller");

router.post("/:user_id", addtocart.saveToaddtocart);
router.post("/sync/:user_id", addtocart.saveToaddtocart);
router.get("/:user_id", addtocart.getaddtocart);
router.delete("/:user_id/:product_id", addtocart.deleteaddtocart);

module.exports = router;