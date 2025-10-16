const pool = require("../../config/db");

const supportUs = {
    async getall() {
        const [rows] = await pool.execute(
            `SELECT * FROM contactus ORDER BY created_at DESC`
        );
        return rows;
    },
      // Delete a category by ID
  async remove(id) {
    const [result] = await pool.execute("DELETE FROM contactus WHERE enquiryId = ?", [
      id,
    ]);
    return result;
  },
}




module.exports = supportUs;
