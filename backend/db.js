// db.js
const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

const db = pool.promise();

db.getConnection()
  .then(() => {
    console.log('✅ MySQL connected successfully');
  })
  .catch((err) => {
    console.error('❌ MySQL connection failed:', err.message);
    process.exit(1); // Optional: stop server if DB fails
  });

module.exports = db;
