const express = require("express");
const router = express.Router();
const userController=require("../../Controllers/AdminControl/usersControllers");

router.get("/getallUsers", userController.getAllUsers);
router.delete("/deleteUsers/:id", userController.deleteUsers);
router.put("/updateUsers/:id", userController.updateUsers);

router.get("/getUser/:id", userController.getUserById);

module.exports = router;
