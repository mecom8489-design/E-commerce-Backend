const Order = require("./Model");
const nodemailer = require("nodemailer");

const db = require("../config/db"); // ✅ Correct path

const getFullImageUrl = (req, imagePath) => {
  if (!imagePath) return null;

  imagePath = imagePath.trim().replace(/^\/+/, "");

  // If Cloudinary or any full URL
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Local uploads
  return `${req.protocol}://${req.get("host")}/${imagePath.replace(
    /\\/g,
    "/"
  )}`;
};

// -----------------------------------------------------
// ✅ CREATE ORDER (+ stock reduce)
// -----------------------------------------------------

// Setup nodemailer transporter (example with Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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
      order_status,
      user_email,
      productname,
    } = req.body;

    if (
      !user_id ||
      !product_id ||
      !shipping_name ||
      !shipping_phone ||
      !shipping_address
    ) {
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
      order_status,
    };

    const result = await Order.create(orderData);

    // ⭐ Reduce product stock
    await db.query("UPDATE products SET stock = stock - ? WHERE id = ?", [
      quantity,
      product_id,
    ]);

    // ------------------------------
    // 📩 EMAIL TO CUSTOMER
    // ------------------------------
    const customerMailOptions = {
      from: process.env.EMAIL_USER,
      to: user_email,
      subject: "Order Confirmation - Thank You for Your Purchase!",
      html: `
        <h2>Hi ${shipping_name},</h2>
        <p>Thank you for your order!</p>

        <p><strong>Product:</strong> ${productname}</p>
        <p><strong>Total Price:</strong> ₹${total_price}</p>
        <p><strong>Quantity:</strong> ${quantity}</p>

        <h3>Shipping Details:</h3>
        <p><strong>Name:</strong> ${shipping_name}</p>
        <p><strong>Phone:</strong> ${shipping_phone}</p>
        <p><strong>Address:</strong> ${shipping_address}</p>

        <p>We’ll notify you once your order has been shipped.</p>
        <br/>
        <p>Best Regards,<br><strong>Your Shop</strong></p>
      `,
    };

    // ------------------------------
    // 📩 EMAIL TO ADMIN
    // ------------------------------
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: "aahasolutionsocialmedia@gmail.com",
      subject: "New Order Received",
      html: `
        <h2>New Order Alert 🚀</h2>

        <h3>Customer Details:</h3>
        <p><strong>Name:</strong> ${shipping_name}</p>
        <p><strong>Phone:</strong> ${shipping_phone}</p>
        <p><strong>Email:</strong> ${user_email}</p>
        <p><strong>Address:</strong> ${shipping_address}</p>

        <h3>Order Details:</h3>
        <p><strong>Product:</strong> ${productname}</p>
        <p><strong>Quantity:</strong> ${quantity}</p>
        <p><strong>Price Per Unit:</strong> ₹${price_per_unit}</p>
        <p><strong>Total Price:</strong> ₹${total_price}</p>
        <p><strong>Payment Method:</strong> ${payment_method}</p>
        <p><strong>Payment Status:</strong> ${payment_status}</p>
        <p><strong>Order Status:</strong> ${order_status}</p>

        <h3>Order ID:</h3>
        <p>${result.insertId}</p>

        <br/>
        <p>Regards,<br><strong>Your Shop (System Notification)</strong></p>
      `,
    };

    // SEND BOTH EMAILS
    try {
      await transporter.sendMail(customerMailOptions);
      console.log("Customer Email Sent");

      await transporter.sendMail(adminMailOptions);
      console.log("Admin Email Sent");

    } catch (error) {
      console.error("Email Error:", error);
    }

    return res.status(201).json({
      message: "Order placed successfully & emails sent",
      order_id: result.insertId,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};


// -----------------------------------------------------
// 📦 Get all orders
// -----------------------------------------------------
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.getAll();
    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// -----------------------------------------------------
// 🔍 Get order by user id
// -----------------------------------------------------
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const orders = await Order.getById(id);

    if (!orders || orders.length === 0) {
      return res.status(200).json({ message: "No orders found for this user" });
    }

    const productsWithUrl = orders.map((p) => ({
      ...p,
      product_image: getFullImageUrl(req, p.product_image),
    }));

    return res.status(200).json(productsWithUrl);
  } catch (error) {
    console.error("Error fetching order:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// hello
exports.cancelOrder = async (req, res) => {
  try {
    const { order_id } = req.params;

    const { reason } = req.body;

    // Get order
    const [[order]] = await db.query(
      "SELECT product_id, quantity, cancelled FROM orders WHERE order_id = ?",
      [order_id]
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.cancelled === 1)
      return res.status(400).json({ message: "Order already cancelled" });

    // Mark as cancelled
    await db.query(
      "UPDATE orders SET cancelled = 1, reason = ? WHERE order_id = ?",
      [reason, order_id]
    );

    // ⭐ Restore stock
    await db.query("UPDATE products SET stock = stock + ? WHERE id = ?", [
      order.quantity,
      order.product_id,
    ]);

    return res.status(200).json({
      message: "Order cancelled successfully & stock restored",
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
exports.updateDeliveryDate = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { delivery_date } = req.body;

    if (!delivery_date) {
      return res.status(400).json({ message: "delivery_date is required" });
    }

    const [result] = await db.query(
      "UPDATE orders SET delivery_date = ? WHERE order_id = ?",
      [delivery_date, order_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    return res.status(200).json({
      message: "Delivery date updated successfully",
      order_id,
      delivery_date,
    });

  } catch (error) {
    console.error("Update delivery date error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
