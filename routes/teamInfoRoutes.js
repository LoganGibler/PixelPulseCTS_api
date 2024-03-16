const express = require("express");
const router = express.Router();
const authenticate = require("../authMiddleware");
const teamInfoController = require("../controllers/teamInfoController");

router.post("/addTeam", teamInfoController.addTeam);
router.get("/getTeams", teamInfoController.getTeams);
router.post("/getTeamById", teamInfoController.getTeamById);
module.exports = router;
