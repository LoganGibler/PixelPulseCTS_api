const express = require("express");
const ticketController = require("../controllers/ticketController");

const router = express.Router();

router.post("/createTicket", ticketController.createTicket);
router.post(
  "/getTicketsByTeamsAndDate",
  ticketController.getTicketsByTeamsAndDate
);

router.post(
  "/getAllUnresolvedTickets",
  ticketController.getAllUnresolvedTickets
);

router.post(
  "/getTicketsByTypeAndTeam",
  ticketController.getTicketsByTypeAndTeam
);
router.post("/updateTicketStatus", ticketController.updateTicketStatus);
// router.post("/updateTicketPriority", ticketController.updateTicketPriority);
// router.post("/updateTicketTitle", ticketController.updateTicketTitle);
// router.post(
//   "/updateTicketDescription",
//   ticketController.updateTicketDescription
// );
router.post("/assignTicket", ticketController.assignTicket);

router.post("/addInvolvedTeams", ticketController.addInvolvedTeams);
router.post("/searchTickets", ticketController.searchTickets);
router.post(
  "/getTicketByTicketNumber",
  ticketController.getTicketByTicketNumber
);

router.post("/updateTicket", ticketController.updateTicket);

// email to ticket creation
// router.post("/createTicketFromEmail", ticketController.createTicketFromEmail);

module.exports = router;
