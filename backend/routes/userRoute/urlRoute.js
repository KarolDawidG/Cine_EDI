const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UsersRecord } = require('../../database/Records/Users/UsersRecord');
const { errorHandler, limiter, verifyToken } = require('../../config/config');
const middleware = require('../../config/middleware');
const MESSAGES = require('../../config/messages');
const STATUS_CODES = require('../../config/status-codes');
const logger = require('../../logs/logger');

const router = express.Router();
router.use(middleware);
router.use(limiter);
router.use(errorHandler);

router.get("/:id", verifyToken, async (req, res, next) => {
  const id = req.params.id;

  try {
    const userInfo = await UsersRecord.selectUrlById([id]);
    console.log(`URL Route: GET: : ${userInfo}`);

    return res.status(STATUS_CODES.SUCCESS).json(userInfo);
  } catch (error) {
    logger.error(error.message);
    return res
      .status(STATUS_CODES.SERVER_ERROR)
      .send(`URL Route: GET: ${MESSAGES.UNKNOW_ERROR}`);
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  const img_url = req.body.img_url;

  try {
    await UsersRecord.updateImgUrl(id, img_url);
    return res
      .status(STATUS_CODES.SUCCESS)
      .send(MESSAGES.SUCCESSFUL_OPERATION);
  } catch (error) {
    logger.error(error.message);
    return res
      .status(STATUS_CODES.SERVER_ERROR)
      .send(`URL Route: PUT: ${MESSAGES.UNKNOW_ERROR}`);
  }
});

router.delete("/:id", verifyToken, async (req, res, next) => {
  const id = req.params.id;
  try {
    await UsersRecord.deleteUrl(id);
    return res
      .status(STATUS_CODES.SUCCESS)
      .send(MESSAGES.SUCCESSFUL_OPERATION);
  } catch (error) {
    logger.error(error.message);
    return res
      .status(STATUS_CODES.SERVER_ERROR)
      .send(`URL Route: DELETE: ${MESSAGES.UNKNOW_ERROR}`);
  }
});

module.exports = router;
