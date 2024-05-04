const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

// utils
const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.service,
    auth: {
      user: process.env.user,
      pass: process.env.pass,
    },
  });
};

const sendResetPasswordEmail = async (email, username, link) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.user,
    to: email,
    subject: `Password Reset`,
    text: `
      Hello ${username},

      We have received a request to reset your password. Please click on the link below to reset your password:

      ${link}

      If you did not request a password reset, please ignore this email. Your account is secure.

      Best regards,
      The Team at [Your Company Name]
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendRegisterEmail = async (email, username, link) => {
  const transporter = createTransporter();

  const mailRegisOptions = {
    from: process.env.user,
    to: email,
    subject: `Welcome!`,
    text: `
      Hello ${username},

      Welcome in our service!
      Please click on the link below to end your registration:

      ${link}

      If you did not sign up in our services, please ignore this email.

      Best regards,
      The Team at Cine EDI
    `,
  };

  await transporter.sendMail(mailRegisOptions);
};

const sendContactEmail = async (name, email, subject, message) => {
  const transporter = createTransporter();

  const mailContactOptions = {
    from: email,
    to: process.env.user,
    subject: `Message from ${email}: ${subject}`,
    text: `
  Email sender: ${email}
  Name of sender: ${name}
  Subject: ${subject}\n
  Message:\n\n ${message}.
  `,
  };

  await transporter.sendMail(mailContactOptions);
};

const sendOrderEmail = async (jsonData) => {
  const transporter = createTransporter(); 
  const orderDetailsJson = JSON.parse(jsonData);
  const account = orderDetailsJson[0].account;
  const rentals = orderDetailsJson[0].rentals;
  const { firstName, secondName, email, street, houseNumber, city, postalCode, country } = account;
  
  const orderedMovies = rentals.map(rental => {
    const { title, description, pricePerDay } = rental.vhs;
    return `Title: ${title}\nDescription: ${description}\nPrice for rent: $${pricePerDay}`;
  }).join('\n\n');

  const totalPrice = rentals.reduce((total, rental) => total + rental.vhs.pricePerDay, 0);
  const rental_date = formatDate(rentals[0].rentalDate);
  const due_date = formatDate(rentals[0].dueDate);
  
  const mailOrderOptions = {
    from: process.env.user,
    to: email,
    subject: `Order Confirmation - ${firstName} ${secondName}`,
    html: `
      <h1>Hello ${firstName} !!! </h1>

      <p>Thank you for your order! Below are the details of your rental:</p>
  
      <p><strong>Customer Details:</strong></p>
      <ul>
        <li>Name: ${firstName} ${secondName}</li>
        <li>Email: ${email}</li>
        <li>Address: ${street} ${houseNumber}, ${city} ${postalCode}, ${country}</li>
      </ul>

      <p><strong>Date Details:</strong></p>
      <ul>
        <li>Rental Date: ${rental_date}</li>
        <li>Due Date: ${due_date}</li>
      </ul>

      <p><strong>Ordered Movies:</strong></p>
      <ul>
        ${rentals.map(rental => `
          <li>
            <strong>Title:</strong> ${rental.vhs.title}<br>
            <strong>Description:</strong> ${rental.vhs.description}<br>
            <strong>Price for rent:</strong> $${rental.vhs.pricePerDay}
          </li>
        `).join('')}
      </ul>
  
      <p><strong>Total Price:</strong> $${totalPrice}</p>

      <p><strong>Order Status:</strong> In Progress</p>
  
      <p>We will process your order shortly. If you have any questions, feel free to contact us.</p>
  
      <p>Follow us on <a href="https://twitter.com/cine_edi">Twitter</a> and <a href="https://www.facebook.com/cine_edi">Facebook</a> for the latest updates and promotions.</p>

      <p>Best regards,<br>
      The Team at Cine EDI</p>
    `,
    attachments: [{
      filename: 'logo3.png',
      path: '',
      cid: 'https://utfs.io/f/a2ed3f40-e72b-418e-ab13-9ff222e65cd3-1peup4.png' //same cid value as in the html img src
  }]
  };

  await transporter.sendMail(mailOrderOptions);
};


module.exports = { sendResetPasswordEmail, sendRegisterEmail, sendContactEmail, sendOrderEmail };
