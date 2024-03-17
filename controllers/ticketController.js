const Tickets = require("../db/ticketSchema");
const CompanyInfo = require("../db/companyInfoSchema");
var currentDate = new Date();
var day = currentDate.getDate();
var month = currentDate.getMonth() + 1;
var year = currentDate.getFullYear();
var hours = currentDate.getHours();
const moment = require("moment");
const minutes =
  currentDate.getMinutes() < 10
    ? "0" + currentDate.getMinutes()
    : currentDate.getMinutes().toString();
var seconds = currentDate.getSeconds();
var logDate = hours + ":" + minutes + " " + month + "/" + day + "/" + year;

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

exports.createTicket = async (req, res) => {
  try {
    let ticketNumber = await CompanyInfo.findOne({ companyID: "11111" });
    ticketNumber = ticketNumber.ticketNumber + 1;

    const checkTickets = await Tickets.findOne({ ticketNumber: ticketNumber });

    console.log(req.body);
    if (checkTickets === null) {
      const createdTicket = await Tickets.create({
        ticketNumber: ticketNumber,
        ticketNumberString: ticketNumber,
        title: req.body.title,
        type: req.body.type,
        description: req.body.description,
        priority: req.body.priority,
        status: req.body.status,
        team: req.body.team,
        submitter: req.body.submitter,
        relatedTicket: req.body.relatedTicket,
        completeBy: req.body.completeBy,
        involvedTeams: req.body.involvedTeams,
        master: req.body.master,
        paging: req.body.paging,
        implementationStart: req.body.implementationStart,
        implementationEnd: req.body.implementationEnd,
        elevatedAccess: req.body.elevatedAccess,
        emergency: req.body.emergency,
      });

      if (createdTicket) {
        let ticketNum = await CompanyInfo.findOne({ companyID: "11111" });
        ticketNum = ticketNum.ticketNumber;
        const filter = { companyID: "11111" };
        const update = { ticketNumber: ticketNum + 1 };
        await CompanyInfo.updateOne(filter, update);

        await Tickets.updateOne(
          { _id: createdTicket._id },
          { $push: { auditString: [`Ticket has been created.`, formatDate()] } }
        );

        res
          .status(200)
          .json({ message: "Ticket has been created:", createdTicket });
      } else {
        res.status(500).json({ message: "Ticket creation failed." });
      }
    } else {
      res.status(500).json({ message: "dup ticket has been found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Ticket creation failed." });
    console.error(error);
  }
};

// grabs tickets assigned to a team, in ascending order by date.
exports.getTicketsByTeamsAndDate = async (req, res) => {
  try {
    // console.log(req.body.team);
    const userTeams = req.body.team;
    const type = req.body.type;

    if (!userTeams || !type) {
      return res.status(200).json({ message: "no Data was passed." });
    }

    let ticketArray = [];

    for (let i = 0; i < userTeams.length; i++) {
      const filter = { team: userTeams[i], type: req.body.type };
      // console.log(filter);
      const tickets = await Tickets.find(filter);
      ticketArray = [...ticketArray, ...tickets];
    }

    if (type === "Service Request") {
      ticketArray.sort(
        (a, b) => moment(a.completeBy).toDate() - moment(b.completeBy).toDate()
      );
    } else {
      ticketArray.sort(
        (a, b) =>
          moment(a.dateCreated).toDate() - moment(b.dateCreated).toDate()
      );
    }

    // console.log("SHOULD BE SORTED BY DATE", ticketArray);
    ticketArray.length > 0
      ? res.status(200).json({ ticketArray })
      : res.status(210).json({ message: "No tickets have been found." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error finding guides by team on backend." });
  }
};

exports.getAllUnresolvedTickets = async (req, res) => {
  try {
    const filter = {
      type: req.body.type,
      status: {
        $nin: ["Closed", "Resolved", "Implemented"],
      },
    };
    const tickets = await Tickets.find(filter);

    // console.log("ALL TICKETS FOUND: ", tickets);
    tickets
      ? res.status(200).json({ tickets })
      : res.status(400).json({ message: "No tickets have been found." });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all tickets." });
  }
};

exports.getTicketsByTypeAndTeam = async (req, res) => {
  try {
    const tickets = await Tickets.find({
      type: req.body.type,
      team: req.body.team,
    }).sort({ dateCreated: 1 });
    tickets
      ? res.status(200).json({ tickets })
      : res.status(400).json({ message: "No tickets have been found." });
  } catch (error) {
    res.status(500).json({ message: "failed to get tickets." });
  }
};

exports.updateTicketStatus = async (req, res) => {
  try {
    const filter = { _id: req.body._id };
    const auditAddition = `Ticket Status was set to ${req.body.status} at: ${logDate}`;
    const update = {
      status: req.body.status,
      $push: { auditString: auditAddition },
    };
    const updatedTicket = await Tickets.updateOne(filter, update);
    updatedTicket
      ? res.status(200).json({ updatedTicket })
      : res.status(400).json({ message: "failed to update ticket status." });
  } catch (error) {
    res.status(500).json({ message: "failed to update ticket status." });
  }
};

exports.updateTicketPriority = async (req, res) => {
  try {
    const filter = { _id: req.body._id };
    const auditAddition = `Ticket priority was set to : ${req.body.priority} at: ${logDate}`;
    const update = {
      priority: req.body.priority,
      $push: { auditString: auditAddition },
    };
    const updatedTicket = await Tickets.updateOne(filter, update);
    updatedTicket
      ? res.status(200).json({ updatedTicket })
      : res.status(400).json({ message: "failed to update ticket priority." });
  } catch (error) {
    res.status(500).json({ message: "Failed to update Ticket priority" });
  }
};

exports.updateTicketTitle = async (req, res) => {
  try {
    const filter = { _id: req.body._id };
    const auditAddition = `Ticket title updated at ${logDate}`;
    const update = {
      title: req.body.title,
      $push: { auditString: auditAddition },
    };
    const updatedticket = await Tickets.updateOne(filter, update);
    updatedticket
      ? res.status(200).json({ updatedticket })
      : res.status(400).json({ message: "failed to update ticket title." });
  } catch (error) {
    res.status(500).json({ message: "Failed to update Ticket priority" });
  }
};

exports.updateTicketDescription = async (req, res) => {
  try {
    const auditAddition = `Ticket description has been updated at: ${logDate} `;
    const updatedticket = await Tickets.updateOne(
      { _id: req.body._id },
      {
        description: req.body.newDescription,
        $push: { auditString: auditAddition },
      }
    );
    updatedticket
      ? res.status(200).json({ updatedticket })
      : res.status(500).json({ message: "/updateTicketDescription failed." });
  } catch (error) {
    res.status(500).json({ message: "/updateTicketDescription failed." });
  }
};

exports.updateApproval = async (req, res) => {
  try {
    const filter = { _id: req.body.ticket_id };
    const auditAddition = `Change approval was changed to : ${req.body.approval} at ${logDate}`;
    const update = {
      approved: req.body.approval,
      $push: { auditString: auditAddition },
    };
    const updatedTicket = await Tickets.updateOne(filter, update);
    if (req.body.author) {
      await Tickets.updateOne(filter, { approvedBy: req.body.author });
    }
    updatedTicket
      ? res.status(200).json({ updatedTicket })
      : res.status(500).json({ message: "failed to update approval." });
  } catch (error) {
    res.status(500).json({ message: "failed on updateApproval." });
  }
};

exports.assignTicket = async (req, res) => {
  try {
    const filter = { _id: req.body._id };
    const update = { userAssigned: req.body.name, status: "Active" };

    // console.log(filter);
    // console.log(update);

    const findTicket = await Tickets.findOne(filter);
    // console.log(findTicket, "!!!!!!!!");
    const updatedTicket = await Tickets.updateOne(filter, update);
    updatedTicket
      ? res.status(200).json({ updatedTicket })
      : res.status(400).json({ message: "failed to update claimed user." });
  } catch (error) {
    res.status(500).json({ message: "failed to update user assigned." });
  }
};

exports.addInvolvedTeams = async (req, res) => {
  try {
    const teams = req.body.teams;
    teams.forEach(async (team) => {
      const filter = { _id: req.body.guide_id };
      const update = { $push: { involvedTeams: team } };
      await Tickets.updateOne(filter, update);
    });

    res.status(200).json({ message: "required teams have been updated." });
  } catch (error) {
    res.status(500).json({ message: "failed to add team(s) to ticket." });
  }
};

exports.createTicketFromEmail = async (req, res) => {
  try {
    res.status(200).json({ message: "endpoint hit." });
  } catch (error) {
    res.status(500).json({ message: "failed to create ticket from email." });
  }
};
// Kon70576

exports.searchTickets = async (req, res) => {
  try {
    const search = req.body.search;

    // Perform a case-insensitive search on string fields
    const regex = new RegExp(search, "i");
    const filter = {
      $or: [
        { title: { $regex: regex } },
        { description: { $regex: regex } },
        { ticketNumberString: { $regex: regex } },
        { involvedTeams: { $regex: regex } },
        { submitter: { $regex: regex } },
        { team: { $regex: regex } },
        { auditString: { $regex: regex } },
      ],
    };

    // Use the query to find tickets that match the search criteria
    const matchingTickets = await Tickets.find(filter);

    res.status(200).json({ tickets: matchingTickets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to search ticket." });
  }
};

exports.getTicketByTicketNumber = async (req, res) => {
  try {
    const filter = { ticketNumber: req.body.ticketNumber };
    const ticket = await Tickets.findOne(filter);

    ticket
      ? res.status(200).json({ ticket })
      : res.status(300).json({ message: "No ticket found." });
  } catch (error) {
    res.status(500).json({ message: "getTicketByNumber failed with error." });
  }
};

exports.updateTicket = async (req, res) => {
  const ticketValues = req.body.ticketValues;

  // console.log("BEFORE UTC CONVERSION", ticketValues.implementationStart);
  // console.log("BEFORE UTC CONVERSION", ticketValues.implementationEnd);

  const implementationStartUTC = new Date(
    ticketValues.implementationStart
  ).toISOString();
  const implementationEndUTC = new Date(
    ticketValues.implementationEnd
  ).toISOString();

  // console.log(implementationStartUTC, "HERE IS THE END DATE");
  // console.log(implementationEndUTC, "HERE IS THE START DATE");

  try {
    const filter = { ticketNumber: ticketValues.ticketNumber };
    if (filter === null || undefined) {
      res
        .status(300)
        .json({ message: "Incorrect parameters for updating a ticket" });
    }

    const oldData = await Tickets.findOne(filter);
    // console.log("HERE IS OLD DATA:", oldData);

    const update = {
      title: ticketValues.title,
      type: ticketValues.type,
      description: ticketValues.description,
      priority: ticketValues.priority,
      status: ticketValues.status,
      userAssigned: ticketValues.userAssigned,
      approved: ticketValues.approved,
      elevatedAccess: ticketValues.elevatedAccess,
      emergency: ticketValues.emergency,
      involvedTeams: ticketValues.involvedTeams,
      team: ticketValues.team,
      submitter: ticketValues.submitter,
      implementationStart: implementationStartUTC,
      implementationEnd: implementationEndUTC,
      completeBy: ticketValues.completeBy,
      auditString: ticketValues.auditString,
      paging: ticketValues.paging,
      masterTicket: ticketValues.masterTicket,
      linkedTickets: ticketValues.linkedTickets,
    };

    const updatedTicket = await Tickets.updateOne(filter, update);

    if (oldData.title !== ticketValues.title) {
      const update = {
        $push: {
          auditString: [
            `Title was updated by ${req.body.user}, changed from ${oldData.title} to ${ticketValues.title}`,
            formatDate(),
          ],
        },
      };
      await Tickets.updateOne(filter, update);
    }

    if (oldData.involvedTeams.length !== ticketValues.involvedTeams.length) {
      const update = {
        $push: {
          auditString: [
            `InvolvedTeams was updated by ${req.body.user}, changed from ${oldData.involvedTeams} to ${ticketValues.involvedTeams}`,
            formatDate(),
          ],
        },
      };
      await Tickets.updateOne(filter, update);
    }

    if (oldData.team !== ticketValues.team) {
      const update = {
        $push: {
          auditString: [
            `AssignedTeam was updated by ${req.body.user}, changed from ${oldData.team} to ${ticketValues.team}`,
            formatDate(),
          ],
        },
      };
      await Tickets.updateOne(filter, update);
    }

    if (oldData.assignedPerson !== ticketValues.assignedPerson) {
      const update = {
        $push: {
          auditString: [
            `assignedPerson was updated by ${req.body.user}, changed from ${oldData.assignedPerson} to ${ticketValues.assignedPerson}`,
            formatDate(),
          ],
        },
      };
      await Tickets.updateOne(filter, update);
    }

    if (oldData.description !== ticketValues.description) {
      const update = {
        $push: {
          auditString: [
            `Description was updated by ${req.body.user}`,
            formatDate(),
          ],
        },
      };
      await Tickets.updateOne(filter, update);
    }

    if (oldData.status !== ticketValues.status) {
      const update = {
        $push: {
          auditString: [
            `Status was updated by ${req.body.user}, changed from ${oldData.status} to ${ticketValues.status}`,
            formatDate(),
          ],
        },
      };
      await Tickets.updateOne(filter, update);
    }

    if (oldData.priority !== ticketValues.priority) {
      const update = {
        $push: {
          auditString: [
            `Priority was updated by ${req.body.user}, changed from ${oldData.priority} to ${ticketValues.priority}`,
            formatDate(),
          ],
        },
      };
      await Tickets.updateOne(filter, update);
    }

    if (oldData.masterTicket !== ticketValues.masterTicket) {
      const update = {
        $push: {
          auditString: [
            `masterTicket was updated by ${req.body.user}, changed from ${oldData.masterTicket} to ${ticketValues.masterTicket}`,
            formatDate(),
          ],
        },
      };
      await Tickets.updateOne(filter, update);
    }

    if (oldData.emergency !== ticketValues.emergency) {
      const update = {
        $push: {
          auditString: [
            `emergency was updated by ${req.body.user}, changed from ${oldData.emergency} to ${ticketValues.emergency}`,
            formatDate(),
          ],
        },
      };
      await Tickets.updateOne(filter, update);
    }

    if (oldData.type !== ticketValues.type) {
      const update = {
        $push: {
          auditString: [
            `Type was updated by ${req.body.user}, changed from ${oldData.type} to ${ticketValues.type}`,
            formatDate(),
          ],
        },
      };
      await Tickets.updateOne(filter, update);
    }

    if (oldData.approved !== ticketValues.approved) {
      const update = {
        $push: {
          auditString: [
            `Ticket was approved by ${req.body.user} at`,
            formatDate(),
          ],
        },
      };
      await Tickets.updateOne(filter, update);
    }

    if (oldData.elevatedAccess !== ticketValues.elevatedAccess) {
      const update = {
        $push: {
          auditString: [
            `ElevatedAccess was updated by ${req.body.user}, changed to ${ticketValues.elevatedAccess}`,
            formatDate(),
          ],
        },
      };
      await Tickets.updateOne(filter, update);
    }

    // if (oldData.implementationStart !== ticketValues.implementationStart) {
    //   const update = {
    //     $push: {
    //       auditString: [
    //         `ImplementationStart was updated by ${req.body.user}, changed from ${oldData.implementationStart} to ${ticketValues.implementationStart}`,
    //         formatDate(),
    //       ],
    //     },
    //   };
    //   await Tickets.updateOne(filter, update);
    // }

    // if (oldData.implementationEnd !== ticketValues.implementationEnd) {
    //   const update = {
    //     $push: {
    //       auditString: [
    //         `ImplementationStart was updated by ${req.body.user}, changed from ${oldData.implementationEnd} to ${ticketValues.implementationEnd} at`,
    //         formatDate(),
    //       ],
    //     },
    //   };
    //   await Tickets.updateOne(filter, update);
    // }

    if (oldData.completeBy !== ticketValues.completeBy) {
      const update = {
        $push: {
          auditString: [
            `completeBy was updated by ${req.body.user}, changed from ${oldData.completeBy} to ${ticketValues.completeBy}`,
            formatDate(),
          ],
        },
      };
      await Tickets.updateOne(filter, update);
    }

    if (oldData.paging !== ticketValues.paging) {
      const update = {
        $push: {
          auditString: [
            `paging was updated by ${req.body.user}, changed from ${oldData.paging} to ${ticketValues.paging}`,
            formatDate(),
          ],
        },
      };
      await Tickets.updateOne(filter, update);
    }

    updatedTicket
      ? res.status(200).json({ updatedTicket })
      : res.status(400).json({ message: "failed to update ticket." });
  } catch (error) {
    res.status(500).json({ message: "failed to update ticket." });
  }
};
