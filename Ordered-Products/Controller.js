const Order = require("./Model");

// 🧾 Create a new order
exports.createOrder = async (req, res) => {
  try {
    const {
      user_id,
      product_id,
      quantity,
      price_per_unit,
      total_price,
      shipping_name,
      shipping_phone,
      shipping_address,
      payment_method,
      payment_status,
      order_status
    } = req.body;

    if (!user_id || !product_id || !shipping_name || !shipping_phone || !shipping_address) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const orderData = {
      user_id,
      product_id,
      quantity,
      price_per_unit,
      total_price,
      shipping_name,
      shipping_phone,
      shipping_address,
      payment_method,
      payment_status,
      order_status
    };

    const result = await Order.create(orderData);
    return res.status(201).json({
      message: "Order placed successfully",
      order_id: result.insertId
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 📦 Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.getAll();
    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 🔍 Get single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.getById(id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    return res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
