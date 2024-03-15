const express = require("express");
const router = express.Router();
const authenticate = require("../authMiddleware");
const teamInfoController = require("../controllers/teamInfoController");

router.post("/addTeam", teamInfoController.addTeam);

module.exports = router;
