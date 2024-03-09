const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: false,
    minlength: 3,
    maxlength: 30,
  },
  password: {
    type: String,
    required: false,
    minlength: 7,
    maxlength: 80,
  },
  role: [
    {
      //User, Admin, Developer
      type: String,
      required: false,
      minlength: 3,
      maxlength: 30,
      default: "User",
    },
  ],
  team: [
    {
      type: String,
      required: false,
      minlength: 3,
      maxlength: 30,
    },
  ],
  active: {
    type: Boolean,
    required: false,
    default: true,
  },
  officePhone: {
    type: String,
    required: false,
    minlength: 3,
    maxlength: 30,
  },
  pagerPhone: {
    type: String,
    required: false,
    minlength: 3,
    maxlength: 30,
  },
  failedLoginAttempts: {
    type: Number,
    default: 0,
  },
  lockedUntil: {
    type: Number,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
