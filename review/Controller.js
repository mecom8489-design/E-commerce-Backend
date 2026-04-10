const Review = require("../review/Model");

exports.createReview = async (req, res) => {
  try {
    const { user_id, product_id, rating, review_text } = req.body;

    // Required fields check
    if (!user_id || !product_id || !rating) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const reviewData = {
      user_id,
      product_id,
      rating,
      review_text,
    };

    // Save to DB
    const result = await Review.create(reviewData);
    return res.status(201).json({
      message: "Review added successfully",
      review_id: result.insertId,
      user_id: user_id,
      product_id: product_id,
      rating: rating,
      review_text: review_text
    });
    
  } catch (error) {
    console.error("Error creating review:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



exports.getReviewsByProductId = async (req, res) => {
  try {
    const product_id = req.params.product_id;

    if (!product_id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const offset = (page - 1) * limit;

    const results = await Review.getReviewsByProduct(product_id, offset, limit);

    // If no reviews found
    if (!results || results.length === 0) {
      return res.status(200).json({
        product_id,
        page,
        limit,
        count: 0,
        reviews: [],
        message: "No reviews available"
      });
    }

    // If reviews exist
    res.status(200).json({
      product_id,
      page,
      limit,
      count: results.length,
      reviews: results,
    });

  } catch (err) {
    console.error("Review fetch error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


