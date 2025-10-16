 const supportUs =require("../../models/AdminModel/supportModel");

 exports.getAllDatas = async (req, res) => {
    try {
      const supportDatas = await supportUs.getall();
      return res.status(200).json(supportDatas);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error Admin Support" });
    }
  };


  exports.deleteSupport = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!id || isNaN(id)) {
        return res
          .status(400)
          .json({ message: "Valid user ID is required." });
      }
  
      const result = await supportUs.remove(id);
  
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "supporyData not found or already deleted." });
      }
  
      return res.status(200).json({ message: "supportData deleted successfully." });
    } catch (error) {
      console.error("Error deleting users:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  };
  