const express = require("express");
const router = express.Router();

const taskController = require("../controllers/taskController");

router.post("/createTask", taskController.createTask);
router.post("/updateTaskStatus", taskController.updateTaskStatus);
router.post("/getAssignedTasks", taskController.getAssignedTasks);
router.post("/claimTask", taskController.claimTask);
router.post("/getTicketTasks", taskController.getTicketTasks);
router.post("/deleteTaskByID", taskController.deleteTaskByID);

module.exports = router;
