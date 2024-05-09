const { performTransaction } = require("../performTransaction");
const { v4: uuidv4 } = require("uuid");
const { validateEmail, validateUserName } = require("../../../config/config");
const {
  INSERT,
  ACTIVE,
  DELETE,
  UPDATE_BY_ID,
  UPDATE_ROLE,
  SELECT_ALL,
  SELECT_BY_EMAIL,
  SELECT_BY_ID,
  SELECT_BY_USERNAME,
  UPDATE_TOKEN_BY_ID,
  SELECT_TOKEN_BY_ID,
  UPDATE_IMG_URL_BY_ID,
  SELECT_URL_BY_ID,
  UPDATE_USER_DATA_BY_ID,
  SELECT_BY_ROLE,
} = require("./querryUsersRecord");
const { pool } = require("../../pool");

class UsersRecord {
  constructor(obj) {
    this.id = obj.id;
    this.first_name = obj.first_name;
    this.second_name = obj.second_name;
    this.email = obj.email;
    this.role = obj.role;
    this.img_url = obj.img_url;
    this.created_at = obj.created_at;
  }

  static async insert(first_name, second_name, hashPassword, email) {
    if (!validateEmail(email)) {
      throw new Error("Invalid email address.");
    }
    const id = uuidv4();

    return performTransaction(async (connection) => {
      await connection.execute(INSERT, [id, first_name, second_name, hashPassword, email]);
      return id;
    });
  }

  static async activateAccount(id) {
    return performTransaction(async (connection) => {
      const results = await connection.execute(ACTIVE, [id]);
      return results;
    });
  }

  static async delete(id) {
    return performTransaction(async (connection) => {
      const result = await connection.execute(DELETE, [id]);
      return result;
    });
  }

  static async updatePasswordById([hashPassword, id]) {
    return performTransaction(async (connection) => {
      const results = await connection.execute(UPDATE_BY_ID, [
        hashPassword,
        id,
      ]);
      return results;
    });
  }

  static async updateRefreshTokenById(refreshToken, id) {
    return performTransaction(async (connection) => {
      const results = await connection.execute(UPDATE_TOKEN_BY_ID, [refreshToken, id]);
      return results;
    });
  }


  // static async updateRole(role, id) {
  //   return performTransaction(async (connection) => {
  //     const results = await connection.execute(UPDATE_ROLE, [role, id]);
  //     return results;
  //   });
  // }

  static async listAll() {
    const [results] = await pool.execute(SELECT_ALL);
    return results.map(obj => new UsersRecord(obj));
  }

  static async listByRole(role) {
    try {
      const [results] = await pool.execute(SELECT_BY_ROLE, [role]);
      return results.map(obj => new UsersRecord(obj));
    } catch (error) {
      console.error("Error in listByRole:", error);
      throw error;
    }
  }

  static async selectByEmail(email) {
    const [results] = await pool.execute(SELECT_BY_EMAIL, email);
    return results;
  }

  static async selectById(id) {
    const [results] = await pool.execute("SELECT * FROM accounts WHERE id = ?", [id]);
    return results;
  }

  static async selectByUsername(first_name) {
    const [results] = await pool.execute(SELECT_BY_USERNAME, first_name);
    return results;
  }


  static async selectTokenById(id) {
    const [results] = await pool.execute(SELECT_TOKEN_BY_ID, id);
    return results;
  }

  static async updateImgUrl(id, img_url) {
    try {
      await performTransaction(async (connection) => {
        const results = await connection.execute(UPDATE_IMG_URL_BY_ID, [img_url, id]);
      });
    } catch (error) {
      throw error;
    }
  }

  static async selectUrlById(id) {
    const [results] = await pool.execute(SELECT_URL_BY_ID, id);
    return results;
  }

  static async deleteUrl(id) {
    const standardUrl = "https://utfs.io/f/bca7e335-8a46-4ffa-9186-81d51e65c875-kmjf4x.jpg";
    return performTransaction(async (connection) => {
      const results = await connection.execute(UPDATE_IMG_URL_BY_ID, [standardUrl, id]);
      return results;
    });
  }

  static async updateUserData(first_name,second_name, email, id) {
    return performTransaction(async (connection) => {
      const results = await connection.execute(UPDATE_USER_DATA_BY_ID, [first_name, second_name, email, id]);
      return results;
    });
  }
}

module.exports = { UsersRecord };
