const Exclusively = require("./Model");
const fs = require('fs');

const getFullImageUrl = (req, imagePath) => {
    if (!imagePath) return null;
    if (typeof imagePath !== 'string') imagePath = String(imagePath);
    return `${req.protocol}://${req.get('host')}/${imagePath.replace(/\\/g, '/')}`;
  };


// 📦 Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const data = await Exclusively.getAll();

        const dataWithUrl = data.map(item => ({
            ...item,
            image: `${req.protocol}://${req.get('host')}/${item.image}`
        }));

        return res.status(200).json(dataWithUrl);
    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


// 📦 Create new order
exports.createOrder = async (req, res) => {
    try {
        const { product_name, product_description } = req.body;
        const image = req.file ? req.file.path : null;
        if (!product_name || !product_description || !image) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const result = await Exclusively.create({
            product_name,
            product_description,
            image,
        });

        return res.status(201).json({
            message: "Order added successfully",
            id: result.insertId,image
        });

    } catch (error) {
        console.error("Error creating order:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};