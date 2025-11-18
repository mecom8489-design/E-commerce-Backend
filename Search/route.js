const express = require("express");
const router = express.Router();
const searchController = require("../Search/Controller");

router.get("/live-search", searchController.liveSearchProducts);

module.exports = router;
