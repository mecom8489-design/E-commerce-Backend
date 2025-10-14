const User = require("../../models/AuthModel/authModel");
const nodemailer = require("nodemailer");

// Setup nodemailer transporter (example with Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Request OTP - send OTP to email if user exists
exports.requestOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findByEmail(email);

    if (!user) {
      // Security: don't reveal if email doesn't exist
      return res.status(200).json({ message: "If email exists, OTP sent" });
    }

    const otp = generateOtp();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    await User.setOtp(email, otp, expiry);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Password Reset OTP",
      text: `Your OTP for password reset is ${otp}. It will expire in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "If email exists, OTP sent" });
  } catch (error) {
    console.error("OTP request error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// verify using OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const user = await User.findByEmailAndOtp(email, otp);

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    return res.status(200).json({ message: "OTP verified successfully." });
  } catch (error) {
    console.error("OTP verification failed:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email, OTP, and new password are required." });
    }

    // Find user by email and OTP using your existing method
    const user = await User.findByEmailAndReset(email);

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    // Update password and clear OTP entry using your model method
    const isUpdated = await User.updatePasswordAndClearOtp(
      user.id,
      newPassword
    );

    if (!isUpdated) {
      return res.status(500).json({ message: "Failed to update password." });
    }

    return res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Password reset failed:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
