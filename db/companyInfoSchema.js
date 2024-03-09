const mongoose = require("mongoose");

const companyInfoSchema = mongoose.Schema({
  companyID: {
    type: String,
  },
  ticketNumber: {
    type: Number,
  },
  teams: [],
});

const CompanyInfo = mongoose.model("CompanyInfo", companyInfoSchema);
module.exports = CompanyInfo;
