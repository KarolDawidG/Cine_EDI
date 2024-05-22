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
        console.log(analizing);
        res.json(analizing); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nie udało się pobrac danych z powodu błędu serwera." });
    }
});

module.exports = router;
