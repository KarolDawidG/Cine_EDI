const express = require('express');
const jwt = require('jsonwebtoken');
const middleware = require('../../config/middleware');
const { errorHandler } = require('../../config/config');
const { UsersRecord } = require('../../database/Records/Users/UsersRecord');
const { sendResetPasswordEmail } = require('../../config/emailSender');
const MESSAGES = require('../../config/messages');
const STATUS_CODES = require('../../config/status-codes');
const URL = require('../../config/url');
const logger = require('../../logs/logger');
require('dotenv').config();

const jwt_secret = process.env.jwt_secret || "";

const router = express.Router();

router.use(middleware);
router.use(errorHandler);

router.post("/", async (req, res) => {
  const { email } = req.body;

  let usernameReset = "";
  let idReset = "";
  let emailReset = "";
  let passwordReset = "";

  try {
    const emailExists = await UsersRecord.selectByEmail([email]);
    if (!emailExists || emailExists.length === 0) {
      return res.status(STATUS_CODES.SUCCESS).send(MESSAGES.EMAIL_SUCCESS);
    }
    usernameReset = emailExists[0].first_name;
    emailReset = emailExists[0].email;
    idReset = emailExists[0].id;
    passwordReset = emailExists[0].password;
    
  } catch (error) {
    logger.error(error.message);
    res.status(STATUS_CODES.SERVER_ERROR).send(MESSAGES.SERVER_ERROR);
  }

  const secret = jwt_secret + passwordReset;
  const payload = {
    email: emailReset,
    id: idReset
  };
  const token = jwt.sign(payload, secret, { expiresIn: "1m" });
  const link = `${URL.RESET_URL}${idReset}/${token}`;

  await sendResetPasswordEmail(emailReset, usernameReset, link);

  try {
    logger.info(MESSAGES.EMAIL_SUCCESS);
    res.status(STATUS_CODES.SUCCESS).send(MESSAGES.EMAIL_SUCCESS);
  } catch (error) {
    logger.error(`Server error email route: ${error.message}`);
    res.status(STATUS_CODES.SERVER_ERROR).send(MESSAGES.SERVER_ERROR);
  }
});

module.exports = router;
