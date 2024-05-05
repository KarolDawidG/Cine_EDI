const express = require('express');
const middleware = require('../../config/middleware');
const { limiter, errorHandler, verifyToken } = require('../../config/config');
const { UsersRecord } = require('../../database/Records/Users/UsersRecord');
const MESSAGES = require('../../config/messages');
const STATUS_CODES = require('../../config/status-codes');
const logger = require('../../logs/logger');

const router = express.Router();

router.use(middleware, limiter, errorHandler);

// router.get("/:role", verifyToken, async (req, res, next) => {
//   const role = req.params.role;
//   try {
//     const usersList = await UsersRecord.listByRole(role);
//     return res.json({ usersList });
//   } catch (error) {
//     logger.error(error.message);
//     return res.status(STATUS_CODES.SERVER_ERROR).send(MESSAGES.SERVER_ERROR);
//   }
// });

router.put("/:id", async (req, res) => {
  const userId = req.params.id;
  const { first_name, second_name , email } = req.body;
  
  try {
    await UsersRecord.updateUserData(first_name, second_name , email, userId);
    return res
      .status(STATUS_CODES.SUCCESS)
      .json({message: "Dane zostały pomyślnie aktualizowane."});
  } catch (error) {
    logger.error(error.message);
    return res
      .status(STATUS_CODES.SERVER_ERROR)
      .send(`Users Route: PUT: ${MESSAGES.UNKNOW_ERROR}`);
  }
});

router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  
  try {
    const userInfo = await UsersRecord.selectById(id);
    
    return res.status(STATUS_CODES.SUCCESS).json(userInfo);
  } catch (error) {
    logger.error(error.message);
    return res
      .status(STATUS_CODES.SERVER_ERROR)
      .send(`Users Route: GET: ${MESSAGES.UNKNOW_ERROR}`);
  }
});

module.exports = router;
