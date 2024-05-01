const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { UsersRecord } = require('../../database/Records/Users/UsersRecord');
const { errorHandler, limiterLogin } = require('../../config/config');
const middleware = require('../../config/middleware');
const { generateRefreshToken, generateToken, SECRET_REFRESH_TOKEN } = require('../../config/tokenUtils');
const MESSAGES = require('../../config/messages');
const STATUS_CODES = require('../../config/status-codes');
const logger = require('../../logs/logger');

const router = express.Router();

router.use(middleware);
router.use(errorHandler);

router.post("/", limiterLogin, async (req, res) => {
  let idUser;
  const user = req.body.username;
  const password = req.body.password;

  try {

    if (!user || !password) {
      return res
        .status(STATUS_CODES.UNPROCESSABLE_ENTITY)
        .send(`Login Route: POST: ${MESSAGES.UNPROCESSABLE_ENTITY}`);
    }

    const ifUser = await UsersRecord.selectByUsername([user]);
    
    if (!ifUser || ifUser.length === 0) {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .send(`Login Route: POST: ${MESSAGES.UNPROCESSABLE_ENTITY}`);
    }

    idUser = ifUser[0].id;
    
    if (!ifUser[0].is_active) {
      return res.status(STATUS_CODES.UNAUTHORIZED)
                .send(`Login Route: POST: ${MESSAGES.FORBIDDEN}`);
    }

    const hashedPassword = ifUser[0].password;
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordValid) {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .send(`Login Route: POST: ${MESSAGES.UNPROCESSABLE_ENTITY}`);
    }

    const role = ifUser[0].role;
    logger.info(`Logged in user: ${user}, access level: ${role}`);

    const token = generateToken(user, role);
    const refreshToken = generateRefreshToken(user, role);
    
    await UsersRecord.updateRefreshTokenById(refreshToken, idUser);

    return res.status(STATUS_CODES.SUCCESS).json({
      token: token,
      idUser: idUser,
      message: MESSAGES.SUCCESSFUL_SIGN_UP,
    });
  } catch (error) {
    logger.error(error.message);
    return res
      .status(STATUS_CODES.SERVER_ERROR)
      .send(`Login Route: POST: ${MESSAGES.INTERNET_DISCONNECTED}`);
  }
});

router.post("/refresh", async (req, res) => {
  const idUser = req.body.idUser;
  const userInfo = await UsersRecord.selectTokenById([idUser]);
  const refreshToken = userInfo[0]?.refresh_token;

  console.log("Czy jest /refresh refreshToken");
  console.log(refreshToken);

  if (!refreshToken) {
    return res.status(401).json({ message: MESSAGES.NO_REFRESH_TOKEN });
  }
  jwt.verify(refreshToken, SECRET_REFRESH_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: MESSAGES.INVALID_REFRESH_TOKEN });
    }
    const username = decoded.user;
    const role = decoded.role;
    const newToken = generateToken(username, role);
    const newRefreshToken = generateRefreshToken(username, role);

    UsersRecord.updateRefreshTokenById(newRefreshToken, idUser);

    return res.json({ token: newToken });
  });
});

module.exports = router;
