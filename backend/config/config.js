const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const MESSAGES = require("./messages");
const STATUS_CODES = require("./status-codes");
const logger = require("../logs/logger");
const fs = require("fs");

const  generateRandomId = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
// console.log(generateRandomId(24));

const errorHandler = (err, req, res, next) => {
  console.error(err);
  logger.error(err.message);
  if (err instanceof SyntaxError) {
    return res.status(STATUS_CODES.BAD_REQUEST).send(MESSAGES.INVALID_REQUEST);
  } else {
    return res.status(STATUS_CODES.SERVER_ERROR).send(MESSAGES.UNKNOW_ERROR);
  }
};

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
});

const limiterLogin = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50,
});

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
  },
});

if (!fs.existsSync("./klucze")) {
  fs.mkdirSync("./klucze");
}

if (!fs.existsSync("./ediDocuments")) {
  fs.mkdirSync("./ediDocuments");
}

fs.writeFileSync("./klucze/privateKey.pem", privateKey);
fs.writeFileSync("./klucze/publicKey.pem", publicKey);

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(STATUS_CODES.UNAUTHORIZED)
      .send(MESSAGES.USER_NOT_LOGGED_IN);
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, publicKey, { algorithms: ["RS256"] }, (err, decoded) => {
    if (err) {
      logger.info(MESSAGES.JWT_ERROR);
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .send(MESSAGES.SESSION_EXPIRED);
    }
    req.userRole = decoded.role;
    req.user = decoded;
    next();
  });
};

const queryParameterize = /^[A-Za-z0-9]+$/;

const validateEmail = (email) => {
  const pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  return pattern.test(email);
};

const validatePassword = (password) => {
  if (password.length < 8) {
    return false;
  }
  if (!/[A-Z]/.test(password)) {
    return false;
  }
  if (!/[0-9]/.test(password)) {
    return false;
  }
  return true;
};

const validateUserName = (username) => {
  if (username.length >= 6 && username.length <= 16) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  errorHandler,
  generateRandomId,
  limiter,
  limiterLogin,
  queryParameterize,
  validateEmail,
  validatePassword,
  validateUserName,
  verifyToken,
};
