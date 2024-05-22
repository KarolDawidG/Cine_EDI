const express = require('express');
const { errorHandler } = require('../config/config');
const middleware = require('../config/middleware');
const { RentalsRecord } = require('../database/Records/Rental/RentalsRecord');

const router = express.Router();

router.use(middleware);
router.use(errorHandler);

router.get('/', async (req, res) => {
    try {
        const analizing = await RentalsRecord.dataAnalysis();
        res.json(analizing); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nie udało się pobrac danych z powodu błędu serwera." });
    }
});

router.get('/user/:id', async (req, res) => {
  const id = req.params.id;
      try {
          const userData = await RentalsRecord.dataAnalysisById(id);
          res.json(userData); 
      } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Nie udało się pobrac danych z powodu błędu serwera." });
      }
});

router.get('/users', async (req, res) => {
    try {
        const usersList = await RentalsRecord.dataUsers();
        res.json(usersList); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nie udało się pobrac danych z powodu błędu serwera." });
    }
});

module.exports = router;