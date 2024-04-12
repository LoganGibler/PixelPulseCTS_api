const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const commentRoutes = require("./routes/commentRoutes");
const companyInfoRoutes = require("./routes/companyInfoRoutes");
const taskRoutes = require("./routes/taskRoutes");
const teamInfoRoutes = require("./routes/teamInfoRoutes");
const cors = require("cors");
const fetchEmails = require("./fetchEmails");
const cron = require("node-cron");

require("dotenv").config();

const app = express();
app.enable("trust proxy");
// Use middleware to parse JSON requests
app.use(express.json());
const allowedOrigins = [
  "http://localhost:8000",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "https://pixelpulsects.netlify.app",
];
app.use(
  cors({
    credentials: true,
    origin: allowedOrigins,
  })
);

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/ticket", ticketRoutes);
app.use("/comment", commentRoutes);
app.use("/companyInfo", companyInfoRoutes);
app.use("/task", taskRoutes);
app.use("/teamInfo", teamInfoRoutes);
// adding comment to test ssh key for laptop

cron.schedule("*/20 * * * * *", async () => {
  try {
    await fetchEmails();
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});

mongoose
  .connect(process.env.db_url_qa)
  .then((result) => {
    console.log("Connected to MongoDB");
    app.listen(8000);
  })
  .catch((err) => console.log(err));
