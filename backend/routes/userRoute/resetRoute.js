const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UsersRecord } = require('../../database/Records/Users/UsersRecord');
const { errorHandler, limiter } = require('../../config/config');
const middleware = require('../../config/middleware');
const { validatePassword } = require('../../config/config');
const MESSAGES = require('../../config/messages');
const STATUS_CODES = require('../../config/status-codes');
const logger = require('../../logs/logger');

require("dotenv").config();
const jwt_secret = process.env.jwt_secret;
const router = express.Router();

router.use(middleware);
router.use(limiter);
router.use(errorHandler);

router.get("/:id/:token", (req, res) => {
  try {
    res.status(STATUS_CODES.SUCCESS).send(MESSAGES.SUCCESSFUL_OPERATION);
  } catch (error) {
    logger.error(error);
  }
});

router.post("/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password, password2 } = req.body;
  let oldPassword = "";

  if (password !== password2 || !validatePassword(password)) {
    return res.status(STATUS_CODES.BAD_REQUEST).send(MESSAGES.INVALID_PASS);
  }

  try {
    const user = await UsersRecord.selectById([id]);
    oldPassword = user[0]?.password || "";

    const secret = jwt_secret + oldPassword;
    jwt.verify(token, secret, async (err, decoded) => {
      if (err) {
        return res.status(STATUS_CODES.UNAUTHORIZED).send(MESSAGES.JWT_ERROR);
      }

      const hashPassword = await bcrypt.hash(password, 10);
      await UsersRecord.updatePasswordById([hashPassword, id]);

      logger.info(MESSAGES.SUCCESSFUL_RESET);
      return res.status(STATUS_CODES.SUCCESS).send(MESSAGES.SUCCESSFUL_RESET);
    });
  } catch (error) {
    logger.error(`Server error: ${error.message}`);
    return res.status(STATUS_CODES.SERVER_ERROR).send(MESSAGES.SERVER_ERROR);
  }
});

module.exports = router;
