const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UsersRecord } = require('../../database/Records/Users/UsersRecord');
const { errorHandler } = require('../../config/config');
const middleware = require('../../config/middleware');
const { validatePassword } = require('../../config/config');
const { sendRegisterEmail } = require('../../config/emailSender');
const MESSAGES = require('../../config/messages');
const STATUS_CODES = require('../../config/status-codes');
const URL = require('../../config/url');
const logger = require('../../logs/logger');

require("dotenv").config();
const JWT_CONFIRMED_TOKEN = process.env.JWT_CONFIRMED_TOKEN;

const router = express.Router();
router.use(middleware);
router.use(errorHandler);

router.post("/", async (req, res) => {
  const { email, first_name, second_name, password } = req.body;
  console.log(email);
  console.log(first_name);
  console.log(second_name);
  console.log(password);

  if (!validatePassword(password)) {
    return res.status(STATUS_CODES.BAD_REQUEST).send(MESSAGES.INVALID_PASS);
  }

  try {
    const userExists = {
      emailExists: await UsersRecord.selectByEmail([email]),
      loginExists: await UsersRecord.selectByUsername([first_name]),
    };

    if (userExists.emailExists.length > 0) {
      return res.status(STATUS_CODES.FORBIDDEN).send(MESSAGES.EMAIL_EXIST);
    }

    // if (userExists.loginExists.length > 0) {
    //   return res.status(STATUS_CODES.FORBIDDEN).send(MESSAGES.USER_EXIST);
    // }

    const hashPassword = await bcrypt.hash(password, 10);
    const idActivation = await UsersRecord.insert(first_name, second_name, hashPassword, email);
    const activationToken = jwt.sign({ userId: idActivation }, JWT_CONFIRMED_TOKEN, { expiresIn: "5m" });
    const link = `${URL.REGISTER_URL}${activationToken}`;

    await sendRegisterEmail(email, first_name, link);

    logger.info(MESSAGES.SUCCESSFUL_SIGN_UP);
    return res.status(STATUS_CODES.SUCCESS).send(MESSAGES.SUCCESSFUL_SIGN_UP);
  } catch (error) {
    logger.error(`Register POST: ${error.message}`);
    return res.status(STATUS_CODES.SERVER_ERROR).send(`Register POST: ${MESSAGES.SERVER_ERROR}`);
  }
});

router.get("/:token", async (req, res) => {
  const { token } = req.params;
  try {
    jwt.verify(token, JWT_CONFIRMED_TOKEN, async (err, decoded) => {
      if (err) {
        return res.status(STATUS_CODES.UNAUTHORIZED).send(MESSAGES.JWT_ERROR);
      }

      const id = decoded.userId;
      await UsersRecord.activateAccount(id);

      return res.redirect(URL.URL_LOGIN);
    });
  } catch (error) {
    logger.error(`Server error: ${error.message}`);
    return res.status(STATUS_CODES.SERVER_ERROR).send(MESSAGES.SERVER_ERROR);
  }
});

module.exports = router;
