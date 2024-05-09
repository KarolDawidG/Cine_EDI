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
    const [results] = await pool.execute('SELECT * FROM client_addresses WHERE account_id = ?', id);
    return results;
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
      const [result] = await pool.execute(
        "UPDATE client_addresses SET street = ?, house_number = ?, city = ?, state = ?, postal_code = ?, country = ? WHERE account_id = ?",
        [street, house_number, city, state, postal_code, country, id]
      );

      if (result.affectedRows > 0) {
        return { message: "Adres został pomyślnie zaktualizowany." };
      } else {
        // Tworzenie nowego ID adresu za pomocą uuidv4
        const newId = generateRandomId(24);
        await pool.execute(
          "INSERT INTO client_addresses (id, account_id, street, house_number, city, state, postal_code, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [newId, id, street, house_number, city, state, postal_code, country]
        );
        return { message: "Nowy adres został pomyślnie utworzony.", id: newId };
      }
    } catch (error) {
      console.error('Error during updating or inserting address:', error);
      throw error;
    }
  }


}

module.exports = { AddressRecord };
