const PDFDocument = require('pdfkit');
const path = require('path');

function generateInvoicePDF(orderDetails, id) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        let buffers = [];
        
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            resolve(pdfData);
        });

        const logoPath = path.join(__dirname, '../utils/logo.png');
        doc.image(logoPath, { fit: [100, 100], align: 'center' })
           .moveDown();

        doc.fontSize(20).text('Cine EDI', { align: 'center' });
        doc.moveDown();

        doc.fontSize(16).text('Invoice', { align: 'center' });
        doc.moveDown();

        doc.fontSize(12).text(`Order ID: ${id}`);
        doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`);
        doc.text(`Due Date: ${new Date().toLocaleDateString()}`); 
        doc.moveDown();
        
        doc.text(`Customer: ${orderDetails.customerName}`);
        doc.text(`Address: ${orderDetails.address}`);
        doc.moveDown();

        doc.text('Items:');
        orderDetails.items.forEach(item => {
            doc.text(`- ${item.name}: ${item.quantity} x $${item.price}`);
        });
        doc.moveDown();

        doc.fontSize(12).text(`Total: $${orderDetails.total}`, { align: 'right' });
        doc.moveDown();

        doc.fontSize(10).text('Thank you for your business!', { align: 'center' });
        doc.text('If you have any questions about this invoice, please contact us at support@cineedi.com', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text('Terms & Conditions:', { align: 'left' });
        doc.fontSize(10).text('The parcel will be sent cash on delivery. Payment will be made upon receipt.', { align: 'left' });

        doc.end();
    });
}

module.exports = {
    generateInvoicePDF,
};
