const express = require("express");
const companyInfoController = require("../controllers/companyInfoController");
const router = express.Router();

router.post("/createCompany", companyInfoController.addCompany);
router.post("/addCompanyTeam", companyInfoController.addCompanyTeam);
router.get("/getCompanyTeams", companyInfoController.getCompanyTeams);
router.get("/iterateTicketCount", companyInfoController.iterateTicketCount);

module.exports = router;
