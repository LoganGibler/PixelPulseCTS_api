const mongoose = require("mongoose");

const commentsSchema = mongoose.Schema({
  ticketNumber: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  // index: {
  //   type: String,
  //   required: true,
  // },
  date: {
    type: Date,
    // default: Date.now,
    // required: true,
  },
  dateEdited: {
    type: Date,
    required: false,
  },
  author: {
    type: String,
    required: true,
  },
  edited: {
    type: Boolean,
    default: false,
  },
});

const Comments = mongoose.model("Comments", commentsSchema);
module.exports = Comments;
