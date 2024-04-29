const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const fs = require("fs");

const TOKEN_EXPIRATION_TIME = "1m";
const SECRET_REFRESH_TOKEN = crypto.randomBytes(32).toString("hex");
const REFRESH_TOKEN_EXPIRATION = "7d";
const privateKey = fs.readFileSync("./klucze/privateKey.pem", "utf8");

const generateToken = (username, role) => {
  const payload = {
    user: username,
    role: role,
    exp: Math.floor(Date.now() / 1000) + parseInt(TOKEN_EXPIRATION_TIME.split("m")[0]) * 60 * 60,
  };
  return jwt.sign(payload, privateKey, { algorithm: "RS256" });
};

const generateRefreshToken = (username, role) => {
  const payload = {
    user: username,
    role: role
  };
  return jwt.sign(payload, SECRET_REFRESH_TOKEN, {
    expiresIn: REFRESH_TOKEN_EXPIRATION
  });
};

module.exports = {
  generateToken,
  generateRefreshToken,
  TOKEN_EXPIRATION_TIME,
  SECRET_REFRESH_TOKEN,
  REFRESH_TOKEN_EXPIRATION
};
