const express = require("express");
const userController = require("../controllers/userController");
const authenticate = require("../authMiddleware");

const router = express.Router();

router.get("/testAuth", authenticate, userController.testAuth);
/* comment*/
module.exports = router;
