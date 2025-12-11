const razor = require("../razorpay");
const crypto = require("crypto");




exports.creatRazor = async (req, res) => {

    try {
        const { amount } = req.body;

        const options = {
            amount: amount * 100,   // ₹ → paise
            currency: "INR",
            receipt: "order_rcptid_11",
        };

        const order = await razor.orders.create(options);
        res.json(order);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}


exports.verifypayment = async (req, res) => {

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", key_secret)
        .update(body)
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        return res.json({ success: true, message: "Payment verified successfully" });
    } else {
        return res.json({ success: false, message: "Payment verification failed" });
    }

}