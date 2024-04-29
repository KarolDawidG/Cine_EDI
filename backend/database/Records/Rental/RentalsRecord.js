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
      for (const item of formData.items) {
        const id = uuidv4();
        await connection.execute(
          `INSERT INTO rentals (id, account_id, vhs_id, rental_date, due_date, return_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            id,
            formData.account_id,
            item.vhs_id,
            new Date(),  // Data wypożyczenia ustawiona na obecny czas
            item.due_date,  // Planowana data zwrotu
            null,  // Data zwrotu, początkowo null
            item.status  // Status początkowy wypożyczenia
          ]
        );
        // Aktualizacja ilości dostępnych kaset
        await connection.execute(
          `UPDATE vhs_tapes SET quantity_available = quantity_available - 1 WHERE id = ? AND quantity_available > 0`,
          [item.vhs_id]
        );
        ids.push(id);
      }
      return ids; // Zwraca listę identyfikatorów wszystkich utworzonych rekordów
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
            ca.country AS country,
            ca.address_type AS addressType
        FROM rentals r
        JOIN accounts a ON r.account_id = a.id
        JOIN vhs_tapes v ON r.vhs_id = v.id
        LEFT JOIN client_addresses ca ON a.id = ca.account_id AND ca.address_type = 'shipping'
        WHERE r.id IN (${placeholders})
    `;

    try {
        const [results] = await pool.execute(query, rentalIds);
        // Group by account to avoid repeating account data
        const groupedByAccount = results.reduce((acc, row) => {
            if (!acc[row.accountId]) {
                acc[row.accountId] = {
                    account: {
                        accountId: row.accountId,
                        firstName: row.first_name,
                        secondName: row.second_name,
                        email: row.email,
                        imageUrl: row.userImgUrl,
                        street: row.street,
                        houseNumber: row.houseNumber,
                        city: row.city,
                        state: row.state,
                        postalCode: row.postalCode,
                        country: row.country,
                        type: row.addressType
                    },
                    rentals: []
                };
            }
            acc[row.accountId].rentals.push({
                rentalId: row.rentalId,
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
            return acc;
        }, {});

        return Object.values(groupedByAccount); // Convert the map object back into an array
    } catch (error) {
        console.error('Error fetching rental details for multiple IDs:', error);
        throw error;
    }
}


  
}

module.exports = { RentalsRecord };
