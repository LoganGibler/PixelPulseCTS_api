const mongoose = require("mongoose");

const ticketSchema = mongoose.Schema({
  ticketNumber: {
    type: Number,
    required: true,
  },
  ticketNumberString: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 200,
  },
  type: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 200,
  },
  description: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 2000,
  },
  priority: {
    type: String,
    required: true,
    default: "4",
    minlength: 1,
    maxlength: 10,
  },
  status: {
    // could be: active, logged, resolved, closed, waiting for 3rd party
    type: String,
    required: true,
    minlength: 3,
    maxlength: 200,
    default: "Submitted",
  },
  userAssigned: {
    type: String,
    required: false,
    default: "",
  },
  dateCreated: {
    type: Date,
    default: () => new Date(),
    required: true,
  },
  // dateEdited: {
  //   type: Date,
  //   default: Date.now, // Set the default value to the current date and time
  //   required: true,
  // },
  approved: {
    type: Boolean,
    required: false,
    default: false,
  },
  elevatedAccess: {
    type: String,
  },
  approvedBy: {
    type: String,
    required: false,
    minlength: 3,
    maxlength: 30,
  },
  // Cloud Engineers, Supply Chain, Frontend AppTeam, Marketing, Merchandising, DatacenterOps
  team: {
    type: String,
    required: false,
    minlength: 3,
    maxlength: 200,
    default: "",
  },
  submitter: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 200,
  },
  implementationStart: {
    type: Date,
    required: false,
    minlength: 3,
    maxlength: 50,
    default: () => new Date(),
  },
  implementationEnd: {
    type: Date,
    required: false,
    minlength: 3,
    maxlength: 50,
    default: () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow;
    },
  },
  completeBy: {
    type: Date,
    required: false,
    minlength: 3,
    maxlength: 50,
    default: Date.now(),
  },
  auditString: [],
  masterTicket: {
    type: Boolean,
    default: false,
  },
  linkedTickets: [],
  involvedTeams: [],
  relatedTicket: {
    type: String,
    required: false,
  },
  taskNumbers: {
    type: Number,
    required: false,
    default: 0,
  },
  emergency: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Tickets = mongoose.model("Tickets", ticketSchema);
module.exports = Tickets;
