const express = require('express');
const { errorHandler } = require('../config/config');
const middleware = require('../config/middleware');
const { RentalsRecord } = require('../database/Records/Rental/RentalsRecord');
const { generateEDIDocument } = require('./generateEDIDocument');

const router = express.Router();

router.use(middleware);
router.use(errorHandler);

router.post('/', async (req, res) => {
    const formData = req.body;
    
    try {
        const orderId = await RentalsRecord.insert(formData);
        const orderDetails = await RentalsRecord.findById(orderId);
        const data = JSON.stringify(orderDetails, null, 2)
        console.log(data);

        // TODO: nie dziala poprawnie zapis
        // const ediDocument = generateEDIDocument(data);
        // console.log(ediDocument);

        res.status(201).json({
            message: "Zamówienie zostało pomyślnie utworzone."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nie udało się utworzyć zamówienia z powodu błędu serwera." });
    }
});

module.exports = router;
