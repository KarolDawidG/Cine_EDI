const express = require('express');
const { errorHandler } = require('../config/config');
const middleware = require('../config/middleware');
const { AddressRecord } = require('../database/Records/Adress/AddressRecord');

const router = express.Router();

router.use(middleware);
router.use(errorHandler);

router.post('/', async (req, res) => {
    const formData = req.body;
    try {
        const orderId = await AddressRecord.insert(formData);
        res.status(200).json({
            message: "Adres został pomyślnie utworzony.",
            orderId: orderId,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nie udało się dodac adresu z powodu błędu serwera." });
    }
});

module.exports = router;
