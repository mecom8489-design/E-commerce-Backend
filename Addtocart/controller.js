const addtocart = require("./model");

exports.saveToaddtocart = async (req, res) => {
    try {
      const { user_id } = req.params;
  
      // Normalize input to array
      let products = [];
  
      if (req.body.product) {
        products = [req.body.product]; // single product
      } else if (Array.isArray(req.body.products)) {
        products = req.body.products; // multiple products
      } else {
        return res.status(400).json({ message: "Invalid request format" });
      }
  
      let added = 0;
  
      for (const product of products) {
        if (!product.id) continue;
  
        const result = await addtocart.create(user_id, product.id);
        if (result.affectedRows === 1) added++;
      }
  
      return res.status(201).json({
        message: "addtocart updated successfully",
        totalReceived: products.length,
        totalAdded: added
      });
  
    } catch (error) {
      console.error("Error saving to addtocart:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };



  
exports.getaddtocart = async (req, res) => {
    try {
      const { user_id } = req.params;
  
      if (!user_id) {
        return res.status(400).json({ message: "user_id is required" });
      }
  
      const result = await addtocart.getaddtocart(user_id);
  
      if (!result || result.length === 0) {
        return res.status(404).json({
          message: "addtocart is empty",
          data: [],
          totalPrice: 0
        });
      }
  
      let totalPrice = 0;
  
      const updatedResult = result.map(item => {
        const price = Number(item.price) || 0;
        const discount = Number(item.discount) || 0;
  
        const finalPrice = price - (price * discount / 100);
        totalPrice += finalPrice;
  
        return {
          ...item,
          finalPrice: Number(finalPrice.toFixed(2))
        };
      });
  
      return res.status(200).json({
        message: "addtocart fetched successfully",
        totalPrice: Number(totalPrice.toFixed(2)),
        data: updatedResult
      });
  
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      return res.status(500).json({
        message: "Internal server error"
      });
    }
  };
  
  exports.deleteaddtocart = async (req, res) => {
    try {
        const { user_id , product_id } = req.params;
        const result = await addtocart.deleteaddtocart(user_id, product_id);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error deleting from addtocart:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
