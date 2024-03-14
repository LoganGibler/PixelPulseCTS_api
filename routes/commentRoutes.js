const express = require("express");
const commentsController = require("../controllers/commentController");
const authenticate = require("../authMiddleware");
const router = express.Router();

router.post("/createComment", authenticate, commentsController.createComment);
router.post("/updateComment", authenticate, commentsController.updateComment);
router.post("/getComments", authenticate, commentsController.getTicketComments);
router.post("/deleteComment", authenticate, commentsController.deleteComment);

module.exports = router;
