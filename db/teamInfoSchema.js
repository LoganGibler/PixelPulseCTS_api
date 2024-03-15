const mongoose = require("mongoose");

const teamInfoSchema = mongoose.Schema({
  teamName: {
    type: String,
    required: true,
  },
  teamEmail: {
    type: String,
    required: true,
  },
  teamPager: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const TeamInfo = mongoose.model("TeamInfo", teamInfoSchema);
module.exports = TeamInfo;
