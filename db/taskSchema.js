const mongoose = require("mongoose");

const tasksSchema = mongoose.Schema({
  linkedTicketNumber: {
    type: String,
    // required: true,
  },
  // title: {
  //   type: String,
  //   required: false,
  //   default: "Default Task Name",
  // },
  assignedTeam: {
    type: String,
    // required: true,
  },
  assignedPerson: {
    type: String,
    required: false,
    default: "",
  },
  submitter: {
    type: String,
    // required: true,
  },
  description: {
    type: String,
    // required: true,
  },
  status: {
    type: String,
    required: false,
    default: "Submitted",
  },
  completeBy: {
    type: Date,
    required: false,
    // default: () => {
    //   const tomorrow = new Date();
    //   tomorrow.setDate(tomorrow.getDate() + 1);
    //   return tomorrow;
    // },
  },
  dateCreated: {
    type: Date,
    default: () => new Date(),
    required: true,
  },
  // taskNumber: {
  //   type: Number,
  //   required: true,
  // },
});

const Tasks = mongoose.model("Tasks", tasksSchema);
module.exports = Tasks;
