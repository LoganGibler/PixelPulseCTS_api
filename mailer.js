const nodemailer = require("nodemailer");
require("dotenv").config();

// Load environment variables
const email = "pixelpulsects@pixelpulselabs.tech";
const appPassword = "eabg pqtv ysxv jfac";

// Set up transporter using email and app password
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: true,
  debug: true,
  auth: {
    user: email,
    pass: appPassword,
  },
});

// Function to send email
async function sendEmail(toEmail, subject, text) {
  try {
    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: email,
      to: toEmail,
      subject: subject,
      text: text,
    });
    console.log("Email sent: " + info.response);
    return info.response;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

// Test sending email
sendEmail(
  "Logan.Gibler@gmail.com",
  "Test",
  "This is a test email from the server"
).catch((err) => {
  console.error("Error sending test email:", err);
});
