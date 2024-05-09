const express = require('express');
const { errorHandler } = require('../config/config');
const middleware = require('../config/middleware');
const { RentalsRecord } = require('../database/Records/Rental/RentalsRecord');
const { generateEDIDocument } = require('./generateEDIDocument');
const { sendOrderEmail } = require('../config/emailSender');
const { AddressRecord } = require('../database/Records/Adress/AddressRecord');

const router = express.Router();

const convertISOToStandardDate = (isoDate) => {
    const date = new Date(isoDate);
    date.setHours(date.getHours());
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
//TODO: add businessLogic.js

router.use(middleware);
router.use(errorHandler);

router.get('/', async (req, res) => {
    try {
       const data = await RentalsRecord.listAllOrders();

        res.status(200).json({data});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nie udało się pobrac danych." });
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
       const data = await RentalsRecord.findAllByUserId(id);
       
        res.status(200).json({
            data: data,
            message: "Zamówienie zostało pomyślnie wyswietlone."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nie udało się pobrac danych." });
    }
});

router.get('/all/:id', async (req, res) => {
    const id = req.params.id;
    try {
       
       const data = await RentalsRecord.findAllOrdersByUserId(id);

        res.status(200).json({
            data: data,
            message: "Zamówienie zostało pomyślnie wyswietlone."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nie udało się pobrac danych." });
    }
});

router.post('/', async (req, res) => {
    const formData = req.body;
    const account_id = formData.items[0].account_id;
    
    try {
        const ifAddress = await AddressRecord.selectById([account_id]);
            if (!ifAddress.length) {
                return res.status(400).json({
                    message: "Najpierw dodaj adres do wysyłki!"
                });
            }

        const { street, house_number, city, state, postal_code, country } = ifAddress[0];
            if (!street || !house_number || !city || !state || !postal_code || !country) {
                return res.status(400).json({
                    message: "Adres do wysyłki jest niekompletny."
                });
            }

        const id = await RentalsRecord.insert(formData);
        const orderId = await RentalsRecord.selectRentalById(id);
        const orderDetails = await RentalsRecord.findById(orderId);

        const data = JSON.stringify(orderDetails, null, 2)
        const ediDocument = generateEDIDocument(data);
        await sendOrderEmail(data);

        console.log(ediDocument);

        res.status(201).json({
            message: "Zamówienie zostało pomyślnie utworzone."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nie udało się utworzyć zamówienia z powodu błędu serwera." });
    }
});



router.delete('/all/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await RentalsRecord.deleteByOrderId( id);
        res.status(200).json({
            message: "Zamówienie zostało pomyślnie usuniete."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nie udało się usunac zamowienia." });
    }
});



module.exports = router;
