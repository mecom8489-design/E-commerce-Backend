const pool = require("../../config/db");

const Users = {
  // Get all categories
  async getAll() {
    const [rows] = await pool.execute(
      `SELECT id, CONCAT(firstname, ' ', lastname) AS name, email, mobile, address, role FROM users`
    );
    return rows;
  },

  async remove(id) {
    const [result] = await pool.execute("DELETE FROM users WHERE id = ?", [id]);
    return result;
  },

  async update(id, data) {
  const { firstname, lastname, mobile, role, address  } = data;

  const [result] = await pool.execute(
    `UPDATE users
     SET firstname = ?, lastname = ?, mobile = ?, role = ?, address = ?, updated_at = NOW()
     WHERE id = ?`,
    [firstname, lastname, mobile, role, address, id]
  );

  return result;
},
async getById(id) {
  const [rows] = await pool.execute(
    `SELECT id, firstname, lastname, email, mobile, role, address 
     FROM users 
     WHERE id = ?`,
    [id]
  );

  return rows.length > 0 ? rows[0] : null;
}


};

module.exports = Users;
