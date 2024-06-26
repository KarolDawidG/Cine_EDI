const express = require('express');
const middleware = require('../../config/middleware');
const { limiter, errorHandler, verifyToken } = require('../../config/config');
const MESSAGES = require('../../config/messages');
const STATUS_CODES = require('../../config/status-codes');
const logger = require('../../logs/logger');
const { UsersRecord } = require('../../database/Records/Users/UsersRecord');

const router = express.Router();

router.use(middleware, limiter, errorHandler);

router.get("/", async (req, res, next) => {
  try {
    const usersList = await UsersRecord.listAll();
    return res.json({ usersList });
  } catch (error) {
    logger.error(error.message);
    return res.status(STATUS_CODES.SERVER_ERROR).send(MESSAGES.SERVER_ERROR);
  }
});

router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;

  try {
    await UsersRecord.delete(id);
    return res
      .status(STATUS_CODES.SUCCESS)
      .send("The operation has been successful.");
  } catch (error) {
    logger.error(error.message);
    return res
      .status(STATUS_CODES.SERVER_ERROR)
      .send(`Users Route: DELETE: ${MESSAGES.UNKNOW_ERROR}`);
  }
});

module.exports = router;
