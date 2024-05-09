const { performTransaction } = require("../performTransaction");
const { pool } = require("../../pool"); 
const { v4: uuidv4 } = require("uuid");

class RentalsRecord {
  constructor(rentalData) {
    this.rentalData = rentalData;
  }

  static async insert(formData) {
    return performTransaction(async (connection) => {
        const order_id = uuidv4();
        const account_id = formData.items[0].account_id;

        try {
            await connection.execute(
                `INSERT INTO orders (order_id, account_id, order_date) VALUES (?, ?, ?)`,
                [order_id, account_id, new Date(),]
            );

            for (const item of formData.items) {
                const id = uuidv4();
                
                await connection.execute(
                    `INSERT INTO rentals (id, account_id, order_id, vhs_id, rental_date, due_date, return_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        id,
                        item.account_id,
                        order_id,
                        item.id,
                        new Date(),
                        item.due_date,
                        null,
                        item.status
                    ]
                );
                
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
            }
            return order_id;
        } catch (error) {
            console.error('Error during inserting rental records:', error);
            throw error;
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
  
  static async deleteByRentalDate(date, userId) {
    return performTransaction(async (connection) => {
        try {
            const [result] = await connection.execute(
                `DELETE FROM rentals WHERE account_id = ? AND rental_date = ?;`,
                [userId, date]
            );

            if (result.affectedRows > 0) {
                console.log(`Deleted ${result.affectedRows} rentals on exact date ${date} for user ${userId}.`);
                return result.affectedRows;
            } else {
                throw new Error('No rentals found for this exact date and time for this user.');
            }
        } catch (error) {
            console.error('Error during deleting rentals by exact date and time:', error);
            throw error;
        }
    });
}

static async findAllOrdersByUserId(userId) {
    const query = `
      SELECT 
        o.order_id AS orderId,
        o.order_date,
        o.status AS orderStatus,
        r.id AS rentalId,
        r.rental_date,
        r.due_date,
        r.return_date,
        r.status AS rentalStatus,
        v.id AS vhsId,
        v.title,
        v.description,
        v.img_url AS vhsImgUrl,
        v.price_per_day
      FROM orders o
      JOIN rentals r ON o.order_id = r.order_id
      JOIN vhs_tapes v ON r.vhs_id = v.id
      WHERE o.account_id = ?
    `;

    try {
      const [results] = await pool.execute(query, [userId]);
      const orders = {};
      results.forEach(row => {
        if (!orders[row.orderId]) {
          orders[row.orderId] = {
            orderId: row.orderId,
            orderDate: row.order_date,
            orderStatus: row.orderStatus,
            rentals: []
          };
        }
        orders[row.orderId].rentals.push({
          rentalId: row.rentalId,
          rentalDate: row.rental_date,
          dueDate: row.due_date,
          returnDate: row.return_date,
          rentalStatus: row.rentalStatus,
          vhsId: row.vhsId,
          title: row.title,
          description: row.description,
          imageUrl: row.vhsImgUrl,
          pricePerDay: row.price_per_day
        });
      });

      return Object.values(orders);
    } catch (error) {
      console.error('Error fetching grouped orders for user:', error);
      throw error;
    }
  }

static async selectRentalById(order_id) {
    try {
        const [results] = await pool.execute('SELECT id FROM rentals WHERE order_id = ?', [order_id]);
        const ids = results.map(row => row.id);
        return ids;
    } catch (error) {
        console.error('Error retrieving rental records by order_id:', error);
        throw error;
    }
}

static async deleteByOrderId(orderId) {
    return performTransaction(async (connection) => {
        try {
            const [orderStatusResult] = await connection.execute(
                `SELECT status FROM orders WHERE order_id = ?;`,
                [orderId]
            );
            const status = orderStatusResult[0].status;
                if (status === "paid") {
                    throw new Error('Cannot delete order because it is already paid.');
                }
            await connection.execute(
                `DELETE FROM rentals WHERE order_id = ?;`,
                [orderId]
            );
            const [result] = await connection.execute(
                `DELETE FROM orders WHERE order_id = ?;`,
                [orderId]
            );
                if (result.affectedRows > 0) {
                    return result.affectedRows;
                } else {
                    throw new Error('No order found with the specified ID or it could not be deleted.');
                }
        } catch (error) {
            console.error('Error during deleting order:', error);
            throw error;
        }
    });
}

static async listAllOrders() {
    try {
        const [results] = await pool.execute(`
            SELECT 
                o.order_id AS OrderID, 
                CONCAT(a.first_name, ' ', a.second_name) AS FullName, 
                o.order_date AS OrderDate, 
                o.status AS OrderStatus 
            FROM orders o 
            JOIN accounts a ON o.account_id = a.id
        `);
        return results;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
}


}

module.exports = { RentalsRecord };
