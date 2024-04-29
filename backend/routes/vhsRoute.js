const express = require('express');
const { errorHandler } = require('../config/config');
const middleware = require('../config/middleware');
const { VHSRecord } = require('../database/Records/VHS/VHSRecord');

const router = express.Router();

router.use(middleware);
router.use(errorHandler);

router.get('/', async (req, res) => {
    
    try {
        const vhsData = await VHSRecord.selectAll();
        res.status(200).json({
            message: "Kasety zostaly pobrane został pomyślnie utworzony.",
            vhsData: vhsData,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nie udało się pobrac kaset z powodu błędu serwera." });
    }
});

module.exports = router;
