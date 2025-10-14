const Orders = require("../../models/AdminModel/ordersModel");

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Orders.getAll();
    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};