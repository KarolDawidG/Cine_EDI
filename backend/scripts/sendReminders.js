const { RentalsRecord } = require('../database/Records/Rental/RentalsRecord');
const { sendReminderEmail } = require('../config/emailSender');

const sendReminders = async () => {
  try {
    const daysBeforeDue = 7;
    const rentalsDueSoon = await RentalsRecord.findRentalsDueSoon(daysBeforeDue);

    for (const rental of rentalsDueSoon) {
      await sendReminderEmail(rental);
    }
    console.log('Reminders sent successfully.');
  } catch (error) {
    console.error('Error sending reminders:', error);
  }
};

module.exports = { sendReminders };
