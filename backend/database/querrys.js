const insertRoot = `INSERT INTO accounts (id, first_name, second_name, password, email, role, is_active) VALUES (UUID(), 'root', 'root', '$2b$10$8Lbg6tvI4e/mOyku3uvNNONfatfeTGHI/D531boVUqWIe3kTOKK/K', 'root@gmail.com', 'admin', '1');`;

const findRoot = `SELECT id FROM accounts WHERE first_name = 'root'`;

const createAccounts = `
      CREATE TABLE IF NOT EXISTS accounts (
        id varchar(36) NOT NULL,
        first_name varchar(50) NOT NULL,
        second_name varchar(50) NOT NULL,
        password varchar(255) NOT NULL,
        email varchar(100) NOT NULL,
        role varchar(20) NOT NULL DEFAULT 'user',
        img_url varchar(100) NOT NULL DEFAULT 'https://utfs.io/f/bca7e335-8a46-4ffa-9186-81d51e65c875-kmjf4x.jpg',
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
          FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
  `;
  
const createVhsTapes = `
      CREATE TABLE IF NOT EXISTS vhs_tapes (
        id varchar(36) NOT NULL,
        title varchar(255) NOT NULL,
        description text,
        img_url varchar(255),
        price_per_day decimal(10, 2) NOT NULL DEFAULT 5.00,  -- Cena za dobę wypożyczenia
        quantity_available int NOT NULL DEFAULT 1,  -- Ilość dostępnych kaset
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
    `;

    const createRentals = `
      CREATE TABLE IF NOT EXISTS rentals (
        id varchar(36) NOT NULL,
        account_id varchar(36) NOT NULL,  -- Identyfikator użytkownika
        vhs_id varchar(36) NOT NULL,  -- Identyfikator kasety VHS
        rental_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Data wypożyczenia
        due_date TIMESTAMP,  -- Planowana data zwrotu
        return_date TIMESTAMP,  -- Rzeczywista data zwrotu
        status varchar(20) DEFAULT 'rented',  -- Status wypożyczenia (np. rented, returned)
        FOREIGN KEY (account_id) REFERENCES accounts(id),
        FOREIGN KEY (vhs_id) REFERENCES vhs_tapes(id),
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

//insert vhs_tapes 
// INSERT INTO vhs_tapes (id, title, description, img_url, price_per_day, quantity_available)
// VALUES
// (UUID(), 'Back to the Future', 'Marty McFly, a 17-year-old high school student, is accidentally sent thirty years into the past in a time-traveling DeLorean invented by his close friend, the maverick scientist Doc Brown.', 'https://example.com/img/back-to-the-future.jpg', 5.00, 5),
// (UUID(), 'The Terminator', 'In 1984, a human soldier is tasked to stop an indestructible cyborg killing machine, both sent from 2029, from executing a young woman, whose unborn son is the key to humanity\'s future salvation.', 'https://example.com/img/the-terminator.jpg', 5.00, 3),
// (UUID(), 'Ghostbusters', 'Three former parapsychology professors set up shop as a unique ghost removal service.', 'https://example.com/img/ghostbusters.jpg', 5.00, 4),
// (UUID(), 'Jurassic Park', 'During a preview tour, a theme park suffers a major power breakdown that allows its cloned dinosaur exhibits to run amok.', 'https://example.com/img/jurassic-park.jpg', 5.00, 2),
// (UUID(), 'Pulp Fiction', 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.', 'https://example.com/img/pulp-fiction.jpg', 5.00, 3);


module.exports = {
  insertRoot,
  findRoot,
  createAccounts,
  deleteNotActiveAccount,
  event_schedulerON,
  createVhsTapes,
  createRentals,
  createClientAddresses,
};
