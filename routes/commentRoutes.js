const express = require("express");
const commentsController = require("../controllers/commentController");

const router = express.Router();

router.post("/createComment", commentsController.createComment);
router.post("/updateComment", commentsController.updateComment);
router.post("/getComments", commentsController.getTicketComments);
router.post("/deleteComment", commentsController.deleteComment);

module.exports = router;
