const express = require("express");
const ticketController = require("../controllers/ticketController");
const authenticate = require("../authMiddleware");
const router = express.Router();

router.post("/createTicket", ticketController.createTicket);
router.post(
  "/getTicketsByTeamsAndDate",
  authenticate,
  ticketController.getTicketsByTeamsAndDate
);

router.post(
  "/getAllUnresolvedTickets",
  authenticate,
  ticketController.getAllUnresolvedTickets
);

router.post(
  "/getTicketsByTypeAndTeam",
  authenticate,
  ticketController.getTicketsByTypeAndTeam
);
router.post(
  "/updateTicketStatus",
  authenticate,
  ticketController.updateTicketStatus
);
// router.post("/updateTicketPriority", ticketController.updateTicketPriority);
// router.post("/updateTicketTitle", ticketController.updateTicketTitle);
// router.post(
//   "/updateTicketDescription",
//   ticketController.updateTicketDescription
// );
router.post("/assignTicket", authenticate, ticketController.assignTicket);

router.post(
  "/addInvolvedTeams",
  authenticate,
  ticketController.addInvolvedTeams
);
router.post("/searchTickets", authenticate, ticketController.searchTickets);
router.post(
  "/getTicketByTicketNumber",
  authenticate,
  ticketController.getTicketByTicketNumber
);

router.post("/updateTicket", ticketController.updateTicket);

// email to ticket creation
// router.post("/createTicketFromEmail", ticketController.createTicketFromEmail);

module.exports = router;
