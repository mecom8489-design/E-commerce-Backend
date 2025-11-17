const db = require("../config/db");

const Exclusively = {
    getAll: async () => {
        const [rows] = await db.query(`
          SELECT 
            id,
            product_name,
            product_description,
            image,
            created_at
          FROM \`Exclusively Available\`
          ORDER BY id DESC
        `);
        return rows;
    },

     // ➕ Add new order
     create: async ({ product_name, product_description, image }) => {
        const [result] = await db.query(`
            INSERT INTO \`Exclusively Available\` 
            (product_name, product_description, image)
            VALUES (?, ?, ?)
        `, [product_name, product_description, image]);

        return result;
    }
};

module.exports = Exclusively;
