const express = require('express');
const { errorHandler } = require('../config/config');
const middleware = require('../config/middleware');
const { RentalsRecord } = require('../database/Records/Rental/RentalsRecord');
const { generateEDIDocument } = require('./generateEDIDocument');
const { sendOrderEmail, sendingPackage, sendOrderReturnEmail } = require('../config/emailSender');
const { AddressRecord } = require('../database/Records/Adress/AddressRecord');

const router = express.Router();

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
    // console.log(formData);
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

        const data = JSON.stringify(orderDetails, null, 2);
        // console.log(data);
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


router.put('/:id/:status', async (req, res) => {
    const id = req.params.id;
    const status = req.params.status;
    
        if (!id || !['returned', 'paid'].includes(status)) {
            return res.status(400).json({ message: 'Invalid parameters' });
        }
        
    try {
      await RentalsRecord.updateOrder(id, status);
  
      if (status === 'returned') {
        const simlpyDetail = await RentalsRecord.findSimpleDetailsByOrderId(id);
        await sendOrderReturnEmail(simlpyDetail);

      } else if (status === 'paid') {
        const orderDetails = await RentalsRecord.findDetailsByOrderId(id);
            if (!orderDetails) {
            throw new Error('Order details not found.');
            }
        const data = JSON.stringify(orderDetails, null, 2);
        await sendingPackage(data);
      }
  
      res.status(200).json({
        message: "Zamówienie zostało pomyślnie aktualizowane."
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Nie udało się aktualizowac zamowienia." });
    }
  });
  
  module.exports = router;
  

module.exports = router;
