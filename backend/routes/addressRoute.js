const express = require('express');
const { errorHandler } = require('../config/config');
const middleware = require('../config/middleware');
const { AddressRecord } = require('../database/Records/Adress/AddressRecord');

const router = express.Router();

router.use(middleware);
router.use(errorHandler);

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const address = await AddressRecord.selectById([id]);
        
        res.status(200).json({
            message: "The address has been successfully displayed.",
            address: address
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "The address could not be displayed due to a server error." });
    }
});

router.post('/', async (req, res) => {
    const formData = req.body;
    try {
        const orderId = await AddressRecord.insert(formData);
        res.status(200).json({
            message: "The address has been successfully created.",
            orderId: orderId,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const formData = req.body;
    try {
        const result = await AddressRecord.update(id, formData);
        
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "The address could not be updated due to a server error." });
    }
});

module.exports = router;
