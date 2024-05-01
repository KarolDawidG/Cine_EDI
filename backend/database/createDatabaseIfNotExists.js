require("dotenv").config();
const { pool } = require("./pool");

const nameDB = process.env.NAME_DB;

const checkDatabaseExists = async (pool, nameDB) => {
  try {
    const [rows] = await pool.query(`SHOW DATABASES LIKE ?`, [nameDB]);
    return rows.length > 0;
  } catch (err) {
    console.error(`Error checking database "${nameDB}":`, err);
    throw err;
  }
};

const createDatabaseIfNotExists = async () => {
  try {
    console.log(`Checking if database "${nameDB}" exists...`);
    const exists = await checkDatabaseExists(pool, nameDB);
    if (!exists) {
      console.log(`Database "${nameDB}" does not exist, creating...`);
      await pool.query(`CREATE DATABASE IF NOT EXISTS \`${nameDB}\``);
      console.log(`Database "${nameDB}" has been created.`);
    } else {
      console.log(`Database "${nameDB}" already exists, no need to create.`);
    }
  } catch (err) {
    console.error(`Error creating/checking database "${nameDB}":`, err);
  }
};

module.exports = { createDatabaseIfNotExists };
