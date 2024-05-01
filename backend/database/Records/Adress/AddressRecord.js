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

  static async selectById(id) {
    const [results] = await pool.execute('select * from client_addresses where account_id = ?', [id]);
    return results.map(obj => new AddressRecord(obj));
  }

  static async addressExists(account_id) {
    const [results] = await pool.execute('SELECT id FROM client_addresses WHERE account_id = ?', [account_id]);
    return results.length > 0;
}


static async insert(data) {
  const { account_id, street, house_number, city, state, postal_code, country } = data;
  const id = generateRandomId(24);

  const exists = await AddressRecord.addressExists(account_id);
  if (exists) {
      throw new Error('Użytkownik może mieć tylko jeden adres.');
  }

  return performTransaction(async (connection) => {
    await connection.execute("INSERT INTO client_addresses (id, account_id, street, house_number, city, state, postal_code, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
       [id, account_id, street, house_number, city, state, postal_code, country]);
    return id;
  });
}


  static async update(id, data) {
    const { street, house_number, city, state, postal_code, country } = data;
    try {
        await pool.execute(
            "UPDATE client_addresses SET street = ?, house_number = ?, city = ?, state = ?, postal_code = ?, country = ? WHERE account_id = ?",
            [street, house_number, city, state, postal_code, country, id]
        );
        return { message: "Adres został pomyślnie zaktualizowany." };
    } catch (error) {
        throw error;
    }
}


}

module.exports = { AddressRecord };
