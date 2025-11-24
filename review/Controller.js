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
    });

  } catch (error) {
    console.error("Error creating review:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
