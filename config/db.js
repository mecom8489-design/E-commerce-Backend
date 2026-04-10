const mysql = require("mysql2/promise");
require("dotenv").config();
 
const pool = mysql.createPool({
  host: process.env.DB_HOST || "sql.freedb.tech",
  user: process.env.DB_USER || "freedb_backend",
  password:"",
  database: process.env.DB_NAME || "ecommerce_backend",
  port:58429,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
 
// Test the database connection
pool
  .getConnection()
  .then((connection) => {
    console.log("Database connected successfully");
    connection.release(); // Release the connection back to the pool
  })
  .catch((err) => {
    console.error(
      "Make sure MySQL server is running and configuration is correct"
    );
  });
 
module.exports = pool;