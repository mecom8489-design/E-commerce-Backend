const Status = require("../../models/AdminModel/mainDashModel");

// const Status = require('../path/to/Status');

exports.getUserStatus = async (req, res) => {
  try {
    const data = await Status.getUserStatus();
    return res.status(200).json(data); // data is [{ users: 2, products: 10 }]
  } catch (error) {
    console.error("Error fetching user status:", error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

exports.getrecentOrders = async (req, res) => {
  try {
    const recentOrders = await Status.getRecentOrders();
    return res.status(200).json(recentOrders);
  } catch (error) {
    console.error("Error fetching recentOrders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
