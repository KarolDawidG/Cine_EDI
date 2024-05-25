const fs = require('fs');
const path = require('path');

function parseEDIFile(data) {
    const lines = data.split("'");
    const orderDetails = {
        orderId: '',
        customerName: '',
        address: '',
        items: [],
        total: 0,
        customerEmail: ''
    };
    
    let currentItem = null;

    lines.forEach(line => {
        const segments = line.trim().split('+');
        switch (segments[0]) {
            case 'BGM':
                orderDetails.orderId = segments[2];
                break;
            case 'NAD':
                if (segments[1] === 'BY') {
                    const nameParts = segments[3].split('::');
                    orderDetails.customerName = nameParts[0];
                    orderDetails.customerEmail = segments[5];
                } else if (segments[1] === 'DP') {
                    const addressParts = segments.slice(4, 7).filter(part => part !== undefined && part !== '').join(' ');
                    // Usuwanie niepożądanych znaków
                    const cleanAddress = addressParts.replace(/[:;^#%]/g, ' ').replace(/\s+/g, ' ').trim();
                    orderDetails.address = cleanAddress;
                }
                break;
            case 'LIN':
                currentItem = {
                    name: segments[3],
                    quantity: 1,  // Zawsze ustaw ilość na 1
                    price: 5,     // Zawsze ustaw cenę na 5
                };
                orderDetails.items.push(currentItem);
                break;
            case 'CNT':
                if (segments[1] === '2' && segments[2]) {
                    orderDetails.total = parseFloat(segments[2]);
                }
                break;
            default:
                break;
        }
    });

    // Oblicz total na podstawie ilości i cen przedmiotów
    orderDetails.total = orderDetails.items.reduce((sum, item) => {
        return sum + (item.quantity * item.price);
    }, 0);

    return orderDetails;
}

function readEDIFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return reject(err);
            }
            const orderDetails = parseEDIFile(data);
            resolve(orderDetails);
        });
    });
}


module.exports = {
    readEDIFile,
};
