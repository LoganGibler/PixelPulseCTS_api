const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require("dotenv").config();

// Load environment variables
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const email = "pixelpulsects@pixelpulselabs.tech";

async function sendEmail(toEmail, subject, text) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: email,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: email,
      to: toEmail,
      subject: subject,
      text: text,
    };

    const response = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + response);
    return response;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

module.exports = sendEmail;
