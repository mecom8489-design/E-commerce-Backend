const Exclusively = require("./Model");

// 📦 Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const data = await Exclusively.getAll(); // ✔ don't overwrite the model
        return res.status(200).json(data);
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