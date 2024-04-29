const { performTransaction } = require("../performTransaction");
const { pool } = require("../../pool");
const { generateRandomId } = require("../../../config/config");

class AddressRecord {
  constructor(obj) {
    this.id = obj.id;
    this.account_id = obj.account_id;
    this.street = obj.street;
    this.house_number = obj.house_number;
    this.city = obj.city;
    this.state = obj.state;
    this.postal_code = obj.postal_code;
    this.country = obj.country;
  }

  static async insert(data) {
    const { account_id, street, house_number, city, state, postal_code, country } = data;
    const id = generateRandomId(24);

    return performTransaction(async (connection) => {
      await connection.
        execute("INSERT INTO client_addresses (id, account_id, street, house_number, city, state, postal_code, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
         [id, account_id, street, house_number, city, state, postal_code, country]);
      return id;
    });
  }

}

module.exports = { AddressRecord };
