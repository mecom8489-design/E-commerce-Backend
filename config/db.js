const mysql = require("mysql2/promise");
require("dotenv").config();
 
const pool = mysql.createPool({
  host:"localhost",
  user:"root",
  password:"",
  database: "ecommerce_backend",
  port:3306,
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