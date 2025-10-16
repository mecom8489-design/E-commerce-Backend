const express=require("express");
const router = express.Router();
const supportController= require("../../Controllers/AdminControl/supportController")


router.get("/getSupportDatas", supportController.getAllDatas);
router.delete("/removeSupportDatas/:id", supportController.deleteSupport);



module.exports = router;
