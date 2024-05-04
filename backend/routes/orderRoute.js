const express = require('express');
const { errorHandler } = require('../config/config');
const middleware = require('../config/middleware');
const { RentalsRecord } = require('../database/Records/Rental/RentalsRecord');
const { generateEDIDocument } = require('./generateEDIDocument');
const { sendOrderEmail } = require('../config/emailSender');

const router = express.Router();

//TODO: add businessLogic.js

router.use(middleware);
router.use(errorHandler);

router.post('/', async (req, res) => {
    const formData = req.body;
    
    try {
        const orderId = await RentalsRecord.insert(formData);
        const orderDetails = await RentalsRecord.findById(orderId);

        const street = orderDetails[0].account.street;
        const houseNumber = orderDetails[0].account.houseNumber;
        const city = orderDetails[0].account.city;
        const state = orderDetails[0].account.state;
        const postalCode = orderDetails[0].account.postalCode;
        const country = orderDetails[0].account.country;

        if (!(street && houseNumber && city && state && postalCode && country)) {
            return res.status(400).json({
                message: "Najpierw dodaj adres do wysyłki."
            });
        }

        const data = JSON.stringify(orderDetails, null, 2)
        const ediDocument = generateEDIDocument(data);
        await sendOrderEmail(data);

        res.status(201).json({
            message: "Zamówienie zostało pomyślnie utworzone."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nie udało się utworzyć zamówienia z powodu błędu serwera." });
    }
});

module.exports = router;
