const express = require('express');
const { errorHandler } = require('../config/config');
const middleware = require('../config/middleware');
const { RentalsRecord } = require('../database/Records/Rental/RentalsRecord');
const { generateEDIDocument } = require('./generateEDIDocument');
const { sendOrderEmail, sendingPackage, sendOrderReturnEmail } = require('../config/emailSender');
const { AddressRecord } = require('../database/Records/Adress/AddressRecord');
const {readEDIFile} = require('../utils/ediFileutils');

const fs = require('fs');
const path = require('path');
const router = express.Router();

//TODO: add businessLogic.js - wydzielic cala logike do oddzielnych komponentow

router.use(middleware);
router.use(errorHandler);

router.get('/', async (req, res) => {
    try {
       const data = await RentalsRecord.listAllOrders();
        res.status(200).json({data});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to download data in order route." });
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
       const data = await RentalsRecord.findAllByUserId(id);
        res.status(200).json({
            data: data,
            message: "The orders have been successfully displayed."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to download data in order route." });
    }
});

router.get('/all/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const data = await RentalsRecord.findAllOrdersByUserId(id);
        res.status(200).json({
            data: data,
            message: "The order has been successfully displayed."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to download data in order route." });
    }
});

router.post('/', async (req, res) => {
    const formData = req.body;
    const account_id = formData.items[0].account_id;
    
    try {
        const ifAddress = await AddressRecord.selectById([account_id]);
        if (!ifAddress.length) {
            return res.status(400).json({
                message: "First, add your shipping address!"
            });
        }
        const { street, house_number, city, state, postal_code, country } = ifAddress[0];
        if (!street || !house_number || !city || !state || !postal_code || !country) {
            return res.status(400).json({
                message: "The shipping address is incomplete."
            });
        }

        const id = await RentalsRecord.insert(formData);
        const orderId = await RentalsRecord.selectRentalById(id);
        const orderDetails = await RentalsRecord.findById(orderId);
        const data = JSON.stringify(orderDetails, null, 2);
        // Stworzenie pliku EDI i zapis w katalogu
        const ediDocument = generateEDIDocument(data);
        const ediDir = path.join(__dirname, '..', 'ediDocuments');
        // id = order_id from table orders
        const filePath = path.join(ediDir, `edi_${id}.txt`);
        console.log(id);
        fs.writeFileSync(filePath, ediDocument);
        await sendOrderEmail(data);
        res.status(201).json({
            message: "The order has been successfully created.",
            filePath: filePath
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "The order could not be created due to a server error." });
    }
});

router.delete('/all/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const deletedRows = await RentalsRecord.deleteByOrderId(id);
        res.status(200).json({
            message: "The order has been successfully deleted.",
            deletedRows: deletedRows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `${error.message}` });
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
            const simpleDetail = await RentalsRecord.findSimpleDetailsByOrderId(id);
            await RentalsRecord.updateRentalStatusByOrderId(id, status);
            await sendOrderReturnEmail(simpleDetail);
        } else if (status === 'paid') {
            const ediPath = path.join(__dirname, '..', 'ediDocuments', `edi_${id}.txt`);
            const orderDetails = await readEDIFile(ediPath);
                if (!orderDetails) {
                    throw new Error('Order details not found in EDI file.');
                } 
            await sendingPackage(orderDetails, id);
        }
        res.status(200).json({
            message: "The order has been successfully updated."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update the order." });
    }
});
  
  module.exports = router;