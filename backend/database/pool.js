require("dotenv").config();
const { createPool } = require("mysql2/promise");

const dbConfig = {
  host: process.env.HOST_DB || "",
  user: process.env.USER_DB || "",
  password: process.env.PASS_DB || "",
  database: process.env.NAME_DB || "",
  namedPlaceholders: true,
  decimalNumbers: true,
};

const pool = createPool(dbConfig);

module.exports = { pool };
