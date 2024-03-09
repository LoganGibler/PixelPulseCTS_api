const Tasks = require("../db/taskSchema");
const Tickets = require("../db/ticketSchema");
require("dotenv").config();

const formatDate = () => {
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZone: "EST",
  };
  return new Date().toLocaleString("en-US", options);
};

exports.createTask = async (req, res) => {
  try {
    const task = await Tasks.create({
      linkedTicketNumber: req.body.ticketNumber,
      assignedTeam: req.body.assignedTeam,
      submitter: req.body.submittedBy,
      description: req.body.description,
      completeBy: req.body.completeBy,
    });

    const filter = { ticketNumber: req.body.ticketNumber };
    const update = {
      $push: {
        auditString: [`${req.body.submittedBy} added a new task`, formatDate()],
      },
    };

    await Tickets.updateOne(filter, update);

    task
      ? res.status(200).json({ task })
      : res.status(400).json({ message: "failed to create new task." });
  } catch (error) {
    res.status(500).json({ message: "failed to create new task." });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const filter = { _id: req.body.taskID };
    const update = { status: req.body.status };
    const task = await Tasks.updateOne(filter, update);
    task
      ? res.status(200).json({ message: "Task updated." })
      : res.status(400).json({ message: "failed to update task." });
  } catch (error) {
    res.status(500).json({ message: "/updateTaskStatus query failed." });
  }
};

exports.getTicketTasks = async (req, res) => {
  try {
    const filter = { linkedTicketNumber: req.body.ticketNumber };

    const tasks = await Tasks.find(filter);

    tasks
      ? res.status(200).json({ tasks })
      : res.status(400).json({ message: "failed to fetch tickets tasks." });
  } catch (error) {
    res.status(500).json({ message: "failed to fetch TicketTasks." });
  }
};

exports.getAssignedTasks = async (req, res) => {
  try {
    const filter = { assignedTeam: req.body.team };
    const tasks = await Tasks.find(filter);
    tasks
      ? res.status(200).json({ tasks })
      : res
          .status(400)
          .json({ message: "no tasks found for " + req.body.team });
  } catch (error) {
    res
      .status(500)
      .json({ message: "failed to fetch tasks assigned to your user." });
  }
};

exports.claimTask = async (req, res) => {
  try {
    const filter = { _id: req.body.taskID };
    const update = { assignedPerson: req.body.user, status: "Active" };
    const updatedTask = await Tasks.updateOne(filter, update);
    updatedTask
      ? res.status(200).json({ message: "Task updated successfully." })
      : res.status(400).json({ message: "failed to update task." });
  } catch (error) {
    res.status(500).json({ message: "failed to claim ticket" });
  }
};

exports.deleteTaskByID = async (req, res) => {
  try {
    const filter = { _id: req.body.taskID };
    await Tasks.deleteOne(filter);
    res.status(200).json({ message: "Task deleted." });
  } catch (error) {
    res.status(500).json({ message: "failed to delete task." });
  }
};
