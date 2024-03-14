const express = require("express");
const router = express.Router();
const authenticate = require("../authMiddleware");
const taskController = require("../controllers/taskController");

router.post("/createTask", authenticate, taskController.createTask);
router.post("/updateTaskStatus", authenticate, taskController.updateTaskStatus);
router.post("/getAssignedTasks", authenticate, taskController.getAssignedTasks);
router.post("/claimTask", authenticate, taskController.claimTask);
router.post("/getTicketTasks", authenticate, taskController.getTicketTasks);
router.post("/deleteTaskByID", authenticate, taskController.deleteTaskByID);

module.exports = router;
