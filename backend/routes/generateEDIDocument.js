const generateEDIDocument = (orderDetails) => {
    const segments = [];

    // Zakładamy, że wszystkie zamówienia mają tego samego klienta, więc bierzemy dane z pierwszego elementu
    const account = orderDetails.account;
    const firstRental = orderDetails.rentals;
    const rentalDate = formatDateForEDI(orderDetails.rentals[0].rentalDate);

    // UNB Segment - Interchange Header
    segments.push(`UNB+UNOA:3+${account.email}:ZZZ+RECEIVER_ID:ZZZ+${rentalDate}+0000000001'`);

    orderDetails.rentals.forEach((rental, index) => {
        // UNH Segment - Message Header for each item
        segments.push(`UNH+${index + 1}+ORDERS:D:96A:UN:EDIFACT'`);

        // BGM Segment - Beginning of the Message
        segments.push(`BGM+220+${rental.rentalId}+9'`);

        // DTM Segment - Date/Time/Period for rental date
        segments.push(`DTM+137:${rentalDate}:102'`);

        // NAD Segment - Name and Address for the supplier
        segments.push(`NAD+SU+CineEDI'`);

        // NAD Segment - Name and Address for the customer, using name and surname
        segments.push(`NAD+BY++${account.firstName} ${account.secondName}::160++${account.email}'`);

        // Place of delivery and shipping
        segments.push(`NAD+DP++${account.address.street} ${account.address.houseNumber}::${account.address.city}:${account.address.postalCode}'`); // Place of delivery using actual address from data

        // LIN Segment - Line Item
        segments.push(`LIN+${index + 1}++${rental.vhs.title}'`);

        // QTY Segment - Quantity
        segments.push(`QTY+21:1'`);

        // PRI Segment - Price Details
        segments.push(`PRI+AAA:${rental.vhs.pricePerDay}'`);

        // DTM Segment for due date (return date)
        segments.push(`DTM+206:${formatDateForEDI(rental.dueDate)}:102'`);
    });

    // UNS Segment - Section Control
    segments.push(`UNS+S'`);

    // CNT Segment - Control Total for number of line items
    segments.push(`CNT+2:${orderDetails.rentals.length}'`);

    // CNT Segment - Total Quantity
    segments.push(`CNT+7:${orderDetails.rentals.length}'`); // Assuming each rental has quantity 1

    // UNT Segment - Message Trailer
    segments.push(`UNT+${segments.length + 1}+1'`);

    // UNZ Segment - Interchange Trailer
    segments.push(`UNZ+1+0000000001'`);

    return segments.join("\n");
}

const formatDateForEDI = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}${month}${day}`;
}

module.exports = {
    generateEDIDocument,
};
