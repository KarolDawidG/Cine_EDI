const { pool } = require("./pool");
const {
  insertRoot,
  findRoot,
  createAccounts,
  deleteNotActiveAccount,
  event_schedulerON,
  createVhsTapes,
  createRentals,
  createClientAddresses,
} = require("./querrys");

const createAccountsTable = async () => {
  try {
    await pool.query(createAccounts);
  } catch (err) {
    console.error(err);
  }
};

const createClientAddressesTable = async () => {
  try {
    await pool.query(createClientAddresses);
  } catch (err) {
    console.error(err);
  }
};

const createVhsTapesTable = async () => {
  try {
    await pool.query(createVhsTapes);
  } catch (err) {
    console.error(err);
  }
};

const createRentalsTable = async () => {
  try {
    await pool.query(createRentals);
  } catch (err) {
    console.error(err);
  }
};

const deleteAccount = async () => {
  try {
    await pool.query(deleteNotActiveAccount);
  } catch (err) {
    console.error(err);
  }
};

const eventSchedulerON = async () => {
  try {
    await pool.query(event_schedulerON);
  } catch (err) {
    console.error(err);
  }
};

const createRoot = async () => {
  try {
    const [rows] = await pool.query(findRoot);
    if (Array.isArray(rows) && rows.length === 0) {
      await pool.query(insertRoot);
      console.log("User root (pass: Admin12#) has been added.");
    } else {
      console.log("User root status: 1");
    }
  } catch (err) {
    console.error(err);
  }
};

module.exports = { createAccountsTable, createVhsTapesTable, createRentalsTable, createRoot, createClientAddressesTable, deleteAccount, eventSchedulerON };
