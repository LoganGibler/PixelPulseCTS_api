const { google } = require("googleapis");
const cron = require("node-cron");
require("dotenv").config();

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

const auth = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
auth.setCredentials({ refresh_token: REFRESH_TOKEN });

const gmail = google.gmail({ version: "v1", auth });

const fetchEmails = async () => {
  try {
    console.log("fetch emails is running");
    const response = await gmail.users.messages.list({
      userId: "me",
    });
    console.log("Emails fetched: ", response.data.messages);
    return response.data.messages;
  } catch (error) {
    console.error("Error fetching emails:", error);
    throw error;
  }
};

cron.schedule("*/20 * * * * *", async () => {
  try {
    await fetchEmails();
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});

module.exports = fetchEmails;
