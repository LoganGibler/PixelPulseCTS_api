const express = require("express");
const router = express.Router();
const authenticate = require("../authMiddleware");
const teamInfoController = require("../controllers/teamInfoController");

router.post("/addTeam", authenticate, teamInfoController.addTeam);
router.get("/getTeams", authenticate, teamInfoController.getTeams);
router.post("/getTeamById", authenticate, teamInfoController.getTeamById);
module.exports = router;
