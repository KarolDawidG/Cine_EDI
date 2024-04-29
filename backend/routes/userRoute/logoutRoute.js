const express = require('express');
const middleware = require('../../config/middleware');
const logger = require('../../logs/logger');
const MESSAGES = require('../../config/messages');
const STATUS_CODES = require('../../config/status-codes');

const router = express.Router();
router.use(middleware);

router.get("/", (req, res) => {
  logger.info(MESSAGES.SUCCESSFUL_LOGOUT);
  return res.status(STATUS_CODES.SUCCESS).send(MESSAGES.SUCCESSFUL_LOGOUT);
});

module.exports = router;
