const PaymentsModel = require("./model");

exports.getAllPayments = async (req, res) => {
  try {
    const orders = await PaymentsModel.getAll();
    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
