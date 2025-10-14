const pool = require("../../config/db");

const Users = {
  // Get all categories
  async getAll() {
    const [rows] = await pool.execute(
      `SELECT id, CONCAT(firstname, ' ', lastname) AS name, email, mobile, role FROM users`
    );
    return rows;
  },

  async remove(id) {
    const [result] = await pool.execute("DELETE FROM users WHERE id = ?", [id]);
    return result;
  },

  async update(id, data) {
  const { firstname, lastname, mobile, role } = data;

  const [result] = await pool.execute(
    `UPDATE users
     SET firstname = ?, lastname = ?, mobile = ?, role = ?, updated_at = NOW()
     WHERE id = ?`,
    [firstname, lastname, mobile, role, id]
  );

  return result;
}


};

module.exports = Users;
