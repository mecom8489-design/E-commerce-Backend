const wishlist = require("./model");



exports.saveToWishlist = async (req, res) => {
    try {
        const { user_id, product_id } = req.body;
        const result = await wishlist.create(user_id, product_id);
        return res.status(201).json(result);
    } catch (error) {
        console.error("Error saving to wishlist:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


exports.getWishlist = async (req, res) => {
    try {
      const { user_id } = req.params;
  
      // 1️⃣ Validate user_id
      if (!user_id) {
        return res.status(400).json({
          message: "user_id is required"
        });
      }
  
      const result = await wishlist.getWishlist(user_id);
  
      // 2️⃣ Handle empty wishlist
      if (!result || result.length === 0) {
        return res.status(404).json({
          message: "Wishlist is empty",
          data: []
        });
      }
  
      // 3️⃣ Success
      return res.status(200).json({
        message: "Wishlist fetched successfully",
        data: result
      });
  
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      return res.status(500).json({
        message: "Internal server error"
      });
    }
  };
  

exports.deleteWishlist = async (req, res) => {
    try {
        const { user_id , product_id } = req.params;
        const result = await wishlist.deleteWishlist(user_id, product_id);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error deleting from wishlist:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

