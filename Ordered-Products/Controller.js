const Order = require("./Model");
const nodemailer = require("nodemailer");

const getFullImageUrl = (req, imagePath) => {
    if (!imagePath) return null;
    if (typeof imagePath !== 'string') imagePath = String(imagePath);
    return `${req.protocol}://${req.get('host')}/${imagePath.replace(/\\/g, '/')}`;
  };
// Configure your email transport

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
      user_email, // 👈 make sure frontend sends user email
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
    console.log(result)

    // ✅ Send confirmation email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mecom8489@gmail.com", // replace with your Gmail
        pass: "yvmo vjoo pqee utbg", // ⚠️ use App Password, not normal password
      },
    });

    const mailOptions = {
      from: '"Your Shop Name" <yourgmail@gmail.com>',
      to: user_email, // user email from frontend
      subject: "Order Confirmation - Thank you for your purchase!",
      html: `
          <h2>Hi ${shipping_name},</h2>
          <p>Thank you for your order!</p>
          <p><strong>Product:</strong> ${productname}</p>
          <p><strong>Total Price:</strong> ₹${total_price}</p>
          <p><strong>Shipping Address:</strong> ${shipping_address}</p>
          <p>We’ll notify you once your order has been shipped.</p>
          <br/>
          <p>Best regards,<br><strong>Your Shop Name</strong></p>
        `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      message: "Order placed successfully & email sent",
      order_id: result.insertId,
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
      const orders = await Order.getById(id);
  
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: "No orders found for this user" });
      }
  
      // ✅ Fix image path
      const productsWithUrl = orders.map(p => ({
        ...p,
        product_image: getFullImageUrl(req, p.product_image),
      }));
  
      return res.status(200).json(productsWithUrl);
    } catch (error) {
      console.error("Error fetching order:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  