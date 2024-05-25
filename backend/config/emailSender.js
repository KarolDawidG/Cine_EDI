  const nodemailer = require("nodemailer");
  const dotenv = require("dotenv");
  const { format } = require('date-fns');
  const { generateInvoicePDF } = require('../utils/generatePDF'); 
  const path = require('path');
  dotenv.config();

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
      subject: `Password Reset Request`,
      html: `
        <div style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px; border-radius: 10px; border: 1px solid #ddd;">
          <h2 style="color: #3b5998; font-size: 24px;">Hello ${username},</h2>
          <p style="color: #444; font-size: 16px;">We have received a request to reset your password. Please click on the button below to reset your password:</p>
          <a href="${link}" style="display: inline-block; background-color: #3b5998; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 18px; margin-bottom: 20px;">Reset Password</a>
          <p style="color: #777; font-size: 14px;">If you did not request a password reset, please ignore this email. Your account is secure.</p>
          <br>
          <p style="color: #666; font-size: 16px;">Best regards,</p>
          <p style="color: #3b5998; font-size: 18px;">The Team at Cine EDI</p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
  };

  const sendRegisterEmail = async (email, username, link) => {
    const transporter = createTransporter();

    const mailRegisOptions = {
      from: process.env.user,
      to: email,
      subject: `Welcome to Our Service!`,
      html: `
        <div style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px; border-radius: 10px; border: 1px solid #ddd;">
          <h2 style="color: #3b5998; font-size: 24px;">Hello ${username},</h2>
          <p style="color: #444; font-size: 16px;">Welcome to our service! We're excited to have you on board.</p>
          <p style="color: #444; font-size: 16px;">Please click on the button below to complete your registration:</p>
          <a href="${link}" style="display: inline-block; background-color: #3b5998; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 18px; margin-bottom: 20px;">Complete Registration</a>
          <p style="color: #777; font-size: 14px;">If you did not sign up for our services, please ignore this email.</p>
          <br>
          <p style="color: #666; font-size: 16px;">Best regards,</p>
          <p style="color: #3b5998; font-size: 18px;">The Team at Cine EDI</p>
        </div>
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
      html: `
        <div style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px; border-radius: 10px; border: 1px solid #ddd;">
        <img src="https://utfs.io/f/a2ed3f40-e72b-418e-ab13-9ff222e65cd3-1peup4.png" alt="Logo" style="display: block; margin: 0 auto; width: 200px; height: auto; border-radius: 10px;">  
        <h2 style="color: #3b5998; font-size: 24px; margin-bottom: 20px;">Message from ${name}</h2>
          <p style="color: #444; font-size: 16px;"><strong>Email sender:</strong> ${email}</p>
          <p style="color: #444; font-size: 16px;"><strong>Name of sender:</strong> ${name}</p>
          <p style="color: #444; font-size: 16px;"><strong>Subject:</strong> ${subject}</p>
          <p style="color: #444; font-size: 16px;"><strong>Message:</strong></p>
          <p style="color: #444; font-size: 16px;">${message}</p>
          <br>
          <p style="color: #666; font-size: 16px;">Best regards,</p>
          <p style="color: #3b5998; font-size: 18px;">The Team at Cine EDI</p>
        </div>
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
        <div style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px; border-radius: 10px; border: 1px solid #ddd;">
          <h2 style="color: #3b5998; font-size: 24px;">Hello ${firstName} !!!</h2>
          <img src="https://utfs.io/f/a2ed3f40-e72b-418e-ab13-9ff222e65cd3-1peup4.png" alt="Logo" style="display: block; margin: 0 auto; width: 200px; height: auto; border-radius: 10px;">
          <p style="color: #444; font-size: 16px;">Thank you for your order! Below are the details of your rental:</p>
          <h3 style="color: #3b5998; font-size: 20px;">Customer Details:</h3>
          <ul style="list-style-type: none; padding: 0;">
            <li><strong style="color: #333;">Name:</strong> ${firstName} ${secondName}</li>
            <li><strong style="color: #333;">Email:</strong> ${email}</li>
            <li><strong style="color: #333;">Address:</strong> ${street} ${houseNumber}, ${city} ${postalCode}, ${country}</li>
          </ul>

          <p style="color: #444; font-size: 16px;">We are currently preparing your package!</p>
          <img src="https://utfs.io/f/2fffa660-f3ab-4a22-84aa-f3a7749ed49b-sd9i3b.jpg" alt="Packing" style="display: block; margin: 0 auto; width: 400px; height: auto; border-radius: 10px;">
         
          <h3 style="color: #3b5998; font-size: 20px;">Date Details:</h3>
          <ul style="list-style-type: none; padding: 0;">
            <li><strong style="color: #333;">Rental Date:</strong> ${rental_date}</li>
            <li><strong style="color: #333;">Due Date:</strong> ${due_date}</li>
          </ul>
          <h3 style="color: #3b5998; font-size: 20px;">Ordered Movies:</h3>
          <ul style="list-style-type: none; padding: 0;">
            ${rentals.map(rental => `
              <li>
                <strong style="color: #333;">Title:</strong> ${rental.vhs.title}<br>
                <strong style="color: #333;">Description:</strong> ${rental.vhs.description}<br>
                <strong style="color: #333;">Price for rent:</strong> $${rental.vhs.pricePerDay}
              </li>
            `).join('')}
          </ul>
          <p style="color: #444; font-size: 16px;"><strong>Total Price:</strong> $${totalPrice}</p>
          <p style="color: #444; font-size: 16px;"><strong>Order Status:</strong> In Progress</p>
          <p style="color: #777; font-size: 14px;">We will process your order shortly. If you have any questions, feel free to contact us.</p>
          <p style="color: #3b5998; font-size: 16px;">Follow us on <a href="https://twitter.com/cine_edi" style="color: #3b5998; text-decoration: none;">Twitter</a> and <a href="https://www.facebook.com/cine_edi" style="color: #3b5998; text-decoration: none;">Facebook</a> for the latest updates and promotions.</p>
          <p style="color: #3b5998; font-size: 18px;">Best regards,</p>
          <p style="color: #3b5998; font-size: 18px;">The Team at Cine EDI</p>
        </div>
      `,
    };
    await transporter.sendMail(mailOrderOptions);
  };
  
  const sendingPackage = async (orderDetails, id) => {
    try {
      const { customerName, customerEmail, address, items, total, orderId } = orderDetails;
      const [firstName, ...restName] = customerName.split(' ');
      const secondName = restName.join(' ');
  
      const pdfData = await generateInvoicePDF(orderDetails, id);
  
      const transporter = createTransporter();
      const mailPackageOptions = {
        from: process.env.user,
        to: customerEmail,
        subject: `The order has been sent - ${firstName} ${secondName}`,
        html: `
          <div style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px; border-radius: 10px; border: 1px solid #ddd;">
            <h2 style="color: #3b5998; font-size: 24px;">Hello ${firstName} !!!</h2>
            <img src="https://utfs.io/f/a2ed3f40-e72b-418e-ab13-9ff222e65cd3-1peup4.png" alt="Logo" style="display: block; margin: 0 auto; width: 200px; height: auto; border-radius: 10px;">
            <p style="color: #444; font-size: 16px;">We are currently sending your package! Below are the details of the shipping address:</p>
            <h3 style="color: #3b5998; font-size: 20px;">Customer Details:</h3>
            <ul style="list-style-type: none; padding: 0;">
              <li><strong style="color: #333;">Name:</strong> ${customerName}</li>
              <li><strong style="color: #333;">Email:</strong> ${customerEmail}</li>
              <li><strong style="color: #333;">Address:</strong> ${address}</li>
            </ul>
            
            <h3 style="color: #3b5998; font-size: 20px;">Ordered Movies:</h3>
            <ul style="list-style-type: none; padding: 0;">
              ${items.map(movie => `
                <li>
                  <strong style="color: #333;">Title:</strong> ${movie.name}
                </li>
              `).join('')}
            </ul>
  
            <p style="color: #444; font-size: 16px;"><strong>Total Price:</strong> $${total}</p>
            
            <p style="color: #444; font-size: 16px;">We have just sent your parcel!</p>
            <img src="https://utfs.io/f/b10d4091-80ad-4d45-bfd8-8f9746322d02-j1gosv.jpg" alt="Packing" style="display: block; margin: 0 auto; width: 400px; height: auto; border-radius: 10px;">
    
            <p style="color: #444; font-size: 16px;"><strong>Order Status:</strong> Sending</p>
            <p style="color: #777; font-size: 14px;">We will process your order shortly. If you have any questions, feel free to contact us.</p>
            <p style="color: #3b5998; font-size: 16px;">Follow us on <a href="https://twitter.com/cine_edi" style="color: #3b5998; text-decoration: none;">Twitter</a> and <a href="https://www.facebook.com/cine_edi" style="color: #3b5998; text-decoration: none;">Facebook</a> for the latest updates and promotions.</p>
            <p style="color: #3b5998; font-size: 18px;">Best regards,</p>
            <p style="color: #3b5998; font-size: 18px;">The Team at Cine EDI</p>
          </div>
        `,
        attachments: [
          {
            filename: `invoice_${id}.pdf`,
            content: pdfData,
            contentType: 'application/pdf'
          }
        ]
      };
      await transporter.sendMail(mailPackageOptions);
    } catch (error) {
      console.error('Error in sendingPackage:', error);
      throw error;
    }
  };

  const sendOrderReturnEmail = async (orderDetails) => {
    try {
      const { firstName, secondName, email, titles } = orderDetails;
  
      const transporter = createTransporter();
      const mailOrderOptions = {
        from: process.env.user,
        to: email,
        subject: `Thanks for returning the ordered VHS tapes - ${firstName} ${secondName}`,
        html: `
          <div style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px; border-radius: 10px; border: 1px solid #ddd;">
            <h2 style="color: #3b5998; font-size: 24px;">Hello ${firstName} !!!</h2>
            <img src="https://utfs.io/f/a2ed3f40-e72b-418e-ab13-9ff222e65cd3-1peup4.png" alt="Logo" style="display: block; margin: 0 auto; width: 200px; height: auto; border-radius: 10px;">
            <p style="color: #444; font-size: 16px;">Thank you for your order! Below are the details of your rental:</p>
            <h3 style="color: #3b5998; font-size: 20px;">Customer Details:</h3>
            <ul style="list-style-type: none; padding: 0;">
              <li><strong style="color: #333;">Name:</strong> ${firstName} ${secondName}</li>
              <li><strong style="color: #333;">Email:</strong> ${email}</li>
            </ul>
            
            <h3 style="color: #3b5998; font-size: 20px;">Ordered Movies:</h3>
            <ul style="list-style-type: none; padding: 0;">
              ${titles.map(title => `
                <li>
                  <strong style="color: #333;">Title:</strong> ${title}
                </li>
              `).join('')}
            </ul>
  
            <p style="color: #444; font-size: 16px;">We have just received your parcel!</p>
            <p style="color: #444; font-size: 14px;">Thanks for using our rental!</p>

            <img src="https://utfs.io/f/c9935a8e-97e5-4e0f-8f65-e7362cbd516b-3pdkna.jpg" alt="Returning" style="display: block; margin: 0 auto; width: 400px; height: auto; border-radius: 10px;">
    
            <p style="color: #444; font-size: 16px;"><strong>Order Status:</strong>Return</p>
            <p style="color: #777; font-size: 14px;">We will process your order shortly. If you have any questions, feel free to contact us.</p>
            <p style="color: #3b5998; font-size: 16px;">Follow us on <a href="https://twitter.com/cine_edi" style="color: #3b5998; text-decoration: none;">Twitter</a> and <a href="https://www.facebook.com/cine_edi" style="color: #3b5998; text-decoration: none;">Facebook</a> for the latest updates and promotions.</p>
            <p style="color: #3b5998; font-size: 18px;">Best regards,</p>
            <p style="color: #3b5998; font-size: 18px;">The Team at Cine EDI</p>
          </div>
        `,
      };
      await transporter.sendMail(mailOrderOptions);
    } catch (error) {
      console.error('Error in sendOrderReturnEmail:', error);
      throw error;
    }
  };

  const sendReminderEmail = async (rentalDetails) => {
    try {
      const { firstName, secondName, email, vhsTitle, due_date } = rentalDetails;
  
      console.log(`Due Date before formatting: ${due_date}`);
  
      const formattedDueDate = format(new Date(due_date), 'yyyy-MM-dd');
  
      console.log(`Formatted Due Date: ${formattedDueDate}`);
  
      const transporter = createTransporter();
      const mailOptions = {
        from: process.env.user,
        to: email,
        subject: `Reminder: Return Your VHS Tape - ${vhsTitle}`,
        html: `
          <div style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px; border-radius: 10px; border: 1px solid #ddd;">
            <h2 style="color: #3b5998; font-size: 24px;">Hello ${firstName} ${secondName}!</h2>
            <p style="color: #444; font-size: 16px;">This is a reminder to return the VHS tape you rented:</p>
            <h3 style="color: #3b5998; font-size: 20px;">Movie Title: ${vhsTitle}</h3>
            <p style="color: #444; font-size: 16px;">Due Date: ${formattedDueDate}</p>
            <p style="color: #444; font-size: 16px;">Please make sure to return it by the due date to avoid any late fees.</p>
            <p style="color: #777; font-size: 14px;">If you have any questions, feel free to contact us.</p>
            <p style="color: #3b5998; font-size: 16px;">Best regards,</p>
            <p style="color: #3b5998; font-size: 18px;">The Team at Cine EDI</p>
          </div>
        `,
      };
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error in sendReminderEmail:', error);
      throw error;
    }
  };

  const sendRecommendationEmail = async (recommendationDetails) => {
    try {
      const { firstName, secondName, email, recommendations } = recommendationDetails;
    
      const transporter = createTransporter();
      const mailOptions = {
        from: process.env.user,
        to: email,
        subject: `Movie Recommendations for You, ${firstName} ${secondName}`,
        html: `
          <div style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px; border-radius: 10px; border: 1px solid #ddd;">
            <h2 style="color: #3b5998; font-size: 24px;">Hello ${firstName} ${secondName}!</h2>
            <p style="color: #444; font-size: 16px;">Based on the latest publishing hits, we thought you might enjoy these movies:</p>
            <h3 style="color: #3b5998; font-size: 20px;">Recommended Movies:</h3>
            <ul style="list-style-type: none; padding: 0;">
              ${recommendations.map(movie => `
                <li style="margin-bottom: 15px;">
                  <strong style="color: #333; font-size: 18px;">Title:</strong> ${movie.title}<br>
                  <strong style="color: #333;">Description:</strong> ${movie.description}<br>
                  
                  <img src="https://image.tmdb.org/t/p/w600_and_h900_bestv2${movie.img_url}" alt="${movie.title}" style="width: 100px; height: auto; margin-top: 10px; border-radius: 5px;">
                </li>
              `).join('')}
            </ul>
            <p style="color: #444; font-size: 16px;">We hope you enjoy these recommendations!</p>
            <p style="color: #777; font-size: 14px;">If you have any questions, feel free to contact us.</p>
            <p style="color: #3b5998; font-size: 16px;">Best regards,</p>
            <p style="color: #3b5998; font-size: 18px;">The Team at Cine EDI</p>
          </div>
        `,
      };
  
      await transporter.sendMail(mailOptions);
      console.log(`Email with recomendation sent to ${email} successfully`);
    } catch (error) {
      console.error('Error in sendRecommendationEmail:', error);
      throw error;
    }
  };
  
  module.exports = {sendRecommendationEmail, sendReminderEmail, sendOrderReturnEmail, sendingPackage, sendResetPasswordEmail, sendRegisterEmail, sendContactEmail, sendOrderEmail };