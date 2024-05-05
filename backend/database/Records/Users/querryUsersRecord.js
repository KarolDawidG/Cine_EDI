const INSERT = "INSERT INTO accounts (id, first_name, second_name, password, email) VALUES (?, ?, ?, ?, ?)";
const ACTIVE = "UPDATE accounts SET is_active = true WHERE id = ?";
const DELETE = "DELETE FROM accounts WHERE id = ?";
const UPDATE_BY_ID = "UPDATE accounts SET password = ? WHERE id = ?";
const UPDATE_TOKEN_BY_ID = "UPDATE accounts SET refresh_token = ? WHERE id = ?";
const UPDATE_ROLE = "UPDATE accounts SET role = ? WHERE id = ?";
const SELECT_ALL = "SELECT * FROM accounts";
const SELECT_BY_ROLE = "SELECT * FROM `accounts` WHERE `role` = ?";
const SELECT_BY_EMAIL = "SELECT * FROM accounts WHERE email = ?";
const SELECT_BY_ID = "SELECT * FROM accounts WHERE id = ?";
const SELECT_TOKEN_BY_ID = "SELECT refresh_token FROM accounts WHERE id = ?";
const SELECT_BY_USERNAME = "SELECT id, is_active, role, password FROM accounts WHERE first_name = ?";
const UPDATE_IMG_URL_BY_ID = "UPDATE accounts SET img_url = ? WHERE id = ?";
const SELECT_URL_BY_ID = "SELECT img_url FROM accounts WHERE id = ?";
const UPDATE_USER_DATA_BY_ID = "UPDATE accounts SET first_name = ?, second_name = ?, email = ? WHERE id = ?";

module.exports = {
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
};
