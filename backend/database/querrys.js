const insertRoot = `INSERT INTO accounts (id, first_name, second_name, password, email, role, is_active) VALUES (UUID(), 'root', 'root', '$2b$10$8Lbg6tvI4e/mOyku3uvNNONfatfeTGHI/D531boVUqWIe3kTOKK/K', 'root@gmail.com', 'admin', '1');`;

const findRoot = `SELECT id FROM accounts WHERE first_name = 'root'`;

const createOrders = `
  CREATE TABLE IF NOT EXISTS orders (
    order_id varchar(36) NOT NULL,
    account_id varchar(36) NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status varchar(20) DEFAULT 'pending',
    PRIMARY KEY (order_id),
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
`;


const createAccounts = `
      CREATE TABLE IF NOT EXISTS accounts (
        id varchar(36) NOT NULL,
        first_name varchar(50) NOT NULL,
        second_name varchar(50) NOT NULL,
        password varchar(255) NOT NULL,
        email varchar(100) NOT NULL,
        role varchar(20) NOT NULL DEFAULT 'user',
        img_url varchar(100) NOT NULL DEFAULT 'https://utfs.io/f/0576a965-e83c-47aa-b5b1-31aeac3c55c0-kmjf4x.jpg',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT false,
        refresh_token TEXT,
        UNIQUE KEY (email),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
      `;

const createClientAddresses = `
      CREATE TABLE IF NOT EXISTS client_addresses (
          id varchar(36) NOT NULL,
          account_id varchar(36) NOT NULL,
          street varchar(255) NOT NULL,
          house_number varchar(255),
          city varchar(100) NOT NULL,
          state varchar(100),
          postal_code varchar(20) NOT NULL,
          country varchar(100) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          UNIQUE (account_id),
          FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
  `;
  
const createVhsTapes = `
      CREATE TABLE IF NOT EXISTS vhs_tapes (
        id varchar(36) NOT NULL,
        title varchar(255) NOT NULL,
        description text,
        img_url varchar(255),
        genre varchar(255),
        price_per_day decimal(10, 2) NOT NULL DEFAULT 5.00,  -- Cena za dobę wypożyczenia
        quantity_available int NOT NULL DEFAULT 1,  -- Ilość dostępnych kaset
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
    `;

    const createRentals = `
      CREATE TABLE IF NOT EXISTS rentals (
        id varchar(36) NOT NULL,
        account_id varchar(36) NOT NULL,
        order_id varchar(36),
        vhs_id varchar(36) NOT NULL,
        rental_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        due_date TIMESTAMP,
        return_date TIMESTAMP,
        status varchar(20) DEFAULT 'rented',
        FOREIGN KEY (account_id) REFERENCES accounts(id),
        FOREIGN KEY (vhs_id) REFERENCES vhs_tapes(id),
        FOREIGN KEY (order_id) REFERENCES orders(order_id),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
    `;



const deleteNotActiveAccount = `
    CREATE EVENT IF NOT EXISTS delete_inactive_users
      ON SCHEDULE EVERY 15 MINUTE
      DO
      BEGIN
        DELETE FROM accounts WHERE is_active = false AND TIMESTAMPDIFF(MINUTE, created_at, NOW()) >= 15;
      END;
`;

const event_schedulerON = `SET GLOBAL event_scheduler = ON;
`;

module.exports = {
  insertRoot,
  findRoot,
  createAccounts,
  deleteNotActiveAccount,
  event_schedulerON,
  createVhsTapes,
  createRentals,
  createClientAddresses,
  createOrders,
};
