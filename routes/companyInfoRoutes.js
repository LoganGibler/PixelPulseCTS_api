const express = require("express");
const companyInfoController = require("../controllers/companyInfoController");
const router = express.Router();
const authenticate = require("../authMiddleware");

router.post("/createCompany", authenticate, companyInfoController.addCompany);
router.post(
  "/addCompanyTeam",
  authenticate,
  companyInfoController.addCompanyTeam
);
router.get(
  "/getCompanyTeams",
  authenticate,
  companyInfoController.getCompanyTeams
);
router.get(
  "/iterateTicketCount",
  authenticate,
  companyInfoController.iterateTicketCount
);

module.exports = router;
