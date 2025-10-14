const pool = require("../../config/db");
const bcrypt = require("bcrypt");

const User = {
  // Find user by email
  async findByEmail(email) {
    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0]; // Return the first matching user (or undefined)
  },

  // Create new user
  async create(firstname, lastname, email, mobile, password, role) {
    const sql = `
      INSERT INTO users (firstname, lastname, email, mobile, password, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [
      firstname,
      lastname,
      email,
      mobile,
      password,
      role,
    ]);
    return result.insertId; // Return the new user's ID
  },

  // Compare password with hashed password
  async comparePasswords(inputPassword, hashedPassword) {
    return await bcrypt.compare(inputPassword, hashedPassword);
  },

  // Set OTP and its expiry time for user identified by email
  async setOtp(email, otp, expiry) {
    // Check if an OTP entry exists for the email
    const [rows] = await pool.execute(
      "SELECT id FROM password_resets WHERE email = ?",
      [email]
    );

    if (rows.length > 0) {
      // Update existing OTP
      const sql = `UPDATE password_resets SET otp = ?, expiry = ? WHERE email = ?`;
      const [result] = await pool.execute(sql, [otp, expiry, email]);
      return result.affectedRows > 0;
    } else {
      // Insert new OTP
      const sql = `INSERT INTO password_resets (email, otp, expiry) VALUES (?, ?, ?)`;
      const [result] = await pool.execute(sql, [email, otp, expiry]);
      return result.affectedRows > 0;
    }
  },

  // Find user and verify OTP (join users and password_resets)
  // Find user and verify OTP
  async findByEmailAndOtp(email, otp) {
    const sql = `
    SELECT u.* FROM users u
    JOIN password_resets rp ON u.email = rp.email
    WHERE u.email = ? AND rp.otp = ? AND rp.expiry > NOW()
  `;
    const [rows] = await pool.execute(sql, [email, otp]);
    return rows[0]; // Return user if OTP matches and is not expired
  },

  // Find user by email and check if there's a non-expired password reset entry
  async findByEmailAndReset(email) {
    const sql = `
    SELECT u.* FROM users u
    JOIN password_resets rp ON u.email = rp.email
    WHERE u.email = ? AND rp.expiry > NOW()
  `;
    const [rows] = await pool.execute(sql, [email]);
    return rows[0]; // Return the user if OTP is valid (non-expired)
  },

  // Update password and clear OTP entry from password_resets
  async updatePasswordAndClearOtp(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // Update user password
    const updateUserSql = `UPDATE users SET password = ? WHERE id = ?`;
    const [result] = await pool.execute(updateUserSql, [
      hashedPassword,
      userId,
    ]);

    if (result.affectedRows > 0) {
      // Delete OTP record from password_resets
      const deleteOtpSql = `DELETE FROM password_resets WHERE email = (SELECT email FROM users WHERE id = ?)`;
      await pool.execute(deleteOtpSql, [userId]);
      return true;
    }
    return false;
  },
};

module.exports = User;
