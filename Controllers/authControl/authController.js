const jwt = require("jsonwebtoken");
const User = require("../../models/AuthModel/authModel");
require("dotenv").config();
const bcrypt = require("bcrypt");

function generateToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
}

exports.signup = async (req, res) => {
  try {
    const { firstname, lastname, mobile, email, password } = req.body;

    if (!firstname || !lastname || !mobile || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findByEmail(email);

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await User.create(
      firstname,
      lastname,
      email,
      mobile,
      hashedPassword,
      "user"
    );

    res.status(201).json({
      message: "User registered successfully",
      userId,
      role: "user",
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({
      message: "An unexpected error occurred during signup",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isValid = await User.comparePasswords(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
