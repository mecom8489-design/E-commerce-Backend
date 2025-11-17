const express = require("express");
const router = express.Router();
const Controller = require("./Controller");
const upload = require('../multerConfig');


router.post("/add",upload.single('image'), Controller.createOrder);

router.get("/all", Controller.getAllOrders);

module.exports = router;
