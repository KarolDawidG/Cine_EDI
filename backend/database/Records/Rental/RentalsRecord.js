const { performTransaction } = require("../performTransaction");
const { pool } = require("../../pool"); 
const { v4: uuidv4 } = require("uuid");

class RentalsRecord {
  constructor(rentalData) {
    this.rentalData = rentalData;
  }

  static async insert(formData) {
    return performTransaction(async (connection) => {
        let ids = [];
        try {
            for (const item of formData.items) {
                const id = uuidv4();
                
                await connection.execute(
                    `INSERT INTO rentals (id, account_id, vhs_id, rental_date, due_date, return_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [
                        id,
                        item.account_id,
                        item.id,
                        new Date(),
                        item.due_date,
                        null,
                        item.status
                    ]
                );
                
                // Sprawdzenie dostępności przed aktualizacją
                const [rows] = await connection.execute(
                    `SELECT quantity_available FROM vhs_tapes WHERE id = ?`,
                    [item.id]
                );
                if (rows[0].quantity_available > 0) {
                    await connection.execute(
                        `UPDATE vhs_tapes SET quantity_available = quantity_available - 1 WHERE id = ?`,
                        [item.id]
                    );
                }
                ids.push(id);
            }
            return ids;
        } catch (error) {
            console.error('Error during inserting rental records:', error);
            throw error; // Przekazanie błędu dalej, aby można było go obsłużyć poza funkcją
        }
    });
}


static async findById(rentalIds) {
  if (!Array.isArray(rentalIds) || rentalIds.length === 0) {
      return [];
  }

  const placeholders = rentalIds.map(() => '?').join(',');
  const query = `
      SELECT 
          r.id AS rentalId, 
          r.rental_date, 
          r.due_date, 
          r.return_date, 
          r.status,
          a.id AS accountId,
          a.first_name,
          a.second_name,
          a.email,
          a.img_url AS userImgUrl,
          v.id AS vhsId,
          v.title,
          v.description,
          v.img_url AS vhsImgUrl,
          v.price_per_day,
          ca.street AS street,
          ca.house_number AS houseNumber,
          ca.city AS city,
          ca.state AS state,
          ca.postal_code AS postalCode,
          ca.country AS country
      FROM rentals r
      JOIN accounts a ON r.account_id = a.id
      JOIN vhs_tapes v ON r.vhs_id = v.id
      LEFT JOIN client_addresses ca ON a.id = ca.account_id
      WHERE r.id IN (${placeholders})
  `;

  try {
      const [results] = await pool.execute(query, rentalIds);
      const groupedByAccount = results.reduce((acc, row) => {
          const accountId = row.accountId;
          if (!acc[accountId]) {
              acc[accountId] = {
                  account: {
                      accountId: accountId,
                      firstName: row.first_name,
                      secondName: row.second_name,
                      email: row.email,
                      imageUrl: row.userImgUrl,
                      street: row.street,
                      houseNumber: row.houseNumber,
                      city: row.city,
                      state: row.state,
                      postalCode: row.postalCode,
                      country: row.country
                  },
                  rentals: []
              };
          }
          const rentalId = row.rentalId;
          if (!acc[accountId].rentals.some(rental => rental.rentalId === rentalId)) {
              acc[accountId].rentals.push({
                  rentalId: rentalId,
                  rentalDate: row.rental_date,
                  dueDate: row.due_date,
                  returnDate: row.return_date,
                  status: row.status,
                  vhs: {
                      vhsId: row.vhsId,
                      title: row.title,
                      description: row.description,
                      imageUrl: row.vhsImgUrl,
                      pricePerDay: row.price_per_day
                  }
              });
          }
          return acc;
      }, {});

      return Object.values(groupedByAccount);
  } catch (error) {
      console.error('Error fetching rental details for multiple IDs:', error);
      throw error;
  }
}

static async findAllByUserId(userId) {
    const query = `
      SELECT 
        r.id AS rentalId, 
        r.rental_date, 
        r.due_date, 
        r.return_date, 
        r.status,
        v.id AS vhsId,
        v.title,
        v.description,
        v.img_url AS vhsImgUrl,
        v.price_per_day
      FROM rentals r
      JOIN vhs_tapes v ON r.vhs_id = v.id
      WHERE r.account_id = ?
    `;
  
    try {
      const [results] = await pool.execute(query, [userId]);
      return results.map(row => ({
        rentalId: row.rentalId,
        rentalDate: row.rental_date,
        dueDate: row.due_date,
        returnDate: row.return_date,
        status: row.status,
        vhsId: row.vhsId,
        title: row.title,
        description: row.description,
        imageUrl: row.vhsImgUrl,
        pricePerDay: row.price_per_day
      }));
    } catch (error) {
      console.error('Error fetching rentals for user:', error);
      throw error;
    }
  }
  

  
}

module.exports = { RentalsRecord };
