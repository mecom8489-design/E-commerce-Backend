const pool = require("../../config/db");

const Contactus = {
  async create(data) {
    const { name, email,mobile, message } = data;
    const [result] = await pool.execute("INSERT INTO contactus (customerName, email,mobile, message) VALUES (?, ?, ?, ?)", [name, email,mobile, message]);
    return result;
  },
};

module.exports = Contactus;
