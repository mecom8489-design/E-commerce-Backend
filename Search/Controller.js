const Product = require("./Model");

exports.liveSearchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.json({ success: true, products: [] });
    }

    const [rows] = await Product.liveSearch(query);

    res.json({
      success: true,
      total: rows.length,
      products: rows
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
