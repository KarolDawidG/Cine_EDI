require("dotenv").config();
const { pool } = require("./pool");

const nameDB = process.env.NAME_DB;

const {
  createAccountsTable,
  createVhsTapesTable,
  createRentalsTable,
  createRoot,
  deleteAccount,
  createClientAddressesTable,
  eventSchedulerON,
} = require("./dbCreator");

const initializeDatabase = async () => {
  try {
    await pool.query(`USE ${nameDB}`);
    const tables = [
      createAccountsTable,
      createVhsTapesTable,
      createRentalsTable,
      createRoot,
      deleteAccount,
      createClientAddressesTable,
      eventSchedulerON,
    ];
    for await (const table of tables) {
      await table(pool);
    }
    console.log("Database cine initialized successfully.");
  } catch (err) {
    console.error(err);
  }
};

module.exports = { initializeDatabase };
