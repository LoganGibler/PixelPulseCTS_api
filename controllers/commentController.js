const Comments = require("../db/commentSchema");
const Tickets = require("../db/ticketSchema");

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

exports.createComment = async (req, res) => {
  try {
    const newComment = await Comments.create({
      ticketNumber: req.body.ticketNumber,
      comment: req.body.comment,
      // index: req.body.index,
      date: new Date(),
      author: req.body.author,
      edited: false,
    });

    if (newComment) {
      // add to audit string a new comment as added
      const filter = { ticketNumber: req.body.ticketNumber };
      // need to add a date to this:
      const update = {
        $push: {
          auditString: [
            `${req.body.author} added a new comment at`,
            formatDate(),
          ],
        },
      };
      await Tickets.updateOne(filter, update);
    }

    newComment
      ? res.status(200).json({ newComment })
      : res.status(400).json({ message: "Failed to create new comment." });
  } catch (error) {
    res.status(500).json({ message: "Query failed on createComment" });
  }
};

// this should only be able to run by author of the comment
exports.updateComment = async (req, res) => {
  try {
    // console.log(req.body);

    const filter = { _id: req.body.comment_id };

    const update = {
      comment: req.body.comment,
      dateEdited: new Date(),
      edited: true,
    };
    const updatedComment = await Comments.updateOne(filter, update);

    const ticketFilter = { ticketNumber: req.body.ticketNumber };
    const ticketUpdate = {
      $push: {
        auditString: [`${req.body.user} edited a comment at`, formatDate()],
      },
    };
    await Tickets.updateOne(ticketFilter, ticketUpdate);

    updatedComment
      ? res.status(200).json({ updatedComment })
      : res.status(400).json({ message: "Failed to update comment." });
  } catch (error) {
    res.status(500).json({ message: "Query Failed on updateComment" });
  }
};

exports.getTicketComments = async (req, res) => {
  try {
    const ticketComments = await Comments.find({
      ticketNumber: req.body.ticketNumber,
    }).sort({ date: -1 });
    ticketComments
      ? res.status(200).json({ ticketComments })
      : res.status(400).json({ message: "failed to fetch ticket comments" });
  } catch (error) {
    res.status(500).json({ message: "Query failed on getticketComments" });
  }
};

// this should only be accessible by admin users.
exports.deleteComment = async (req, res) => {
  try {
    const deletedComment = await Comments.deleteOne({
      _id: req.body.comment_id,
    });
    deletedComment.deletedCount > 0
      ? res.status(200).json({ deletedComment })
      : res.status(400).json({ message: "failed to delete comment." });
  } catch (error) {
    res.status(500).json({ message: "Query failed on deleteComment." });
  }
};
