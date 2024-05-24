const { RentalsRecord } = require('../database/Records/Rental/RentalsRecord');
const { sendRecommendationEmail } = require('../config/emailSender');

const generateRecommendations = async () => {
  const latestMovies = await RentalsRecord.findLatestMovies();
  return latestMovies;
};

const sendRecommendations = async () => {
  try {
    const usersWithRentals = await RentalsRecord.findUsersWithRentals();

    const userRentalsMap = usersWithRentals.reduce((acc, rental) => {
      const { accountId, firstName, secondName, email } = rental;
      if (!acc[accountId]) {
        acc[accountId] = {
          firstName,
          secondName,
          email
        };
      }
      return acc;
    }, {});

    const recommendations = await generateRecommendations();

    for (const userId in userRentalsMap) {
      const { firstName, secondName, email } = userRentalsMap[userId];
      const recommendationDetails = {
        firstName,
        secondName,
        email,
        recommendations
      };
      await sendRecommendationEmail(recommendationDetails);
    }
  } catch (error) {
    console.error('Error sending recommendations:', error);
  }
};


module.exports = { sendRecommendations };
