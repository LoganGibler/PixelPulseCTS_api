const CompanyInfo = require("../db/companyInfoSchema");

exports.addCompanyTeam = async (req, res) => {
  try {
    const newTeam = await CompanyInfo.updateOne({
      $push: { teams: req.body.team },
    });

  

    newTeam ? res.status(200).json({ message: "New team added." }) : null;
  } catch (error) {
    res
      .status(500)
      .json({ message: "failed to add team to company info schema." });
  }
};

exports.addCompany = async (req, res) => {
  try {
    const newCompany = await CompanyInfo.create({
      companyID: req.body.companyID,
      teams: [],
    });

    

    newCompany ? res.status(200).json({ message: "newCompany added." }) : null;
  } catch (error) {
    res
      .status(500)
      .json({ message: "failed to add team to company info schema." });
  }
};

exports.getCompanyTeams = async (req, res) => {
  try {
    const companyTeams = await CompanyInfo.findOne({ companyID: "11111" });
    companyTeams
      ? res.status(200).json({ companyTeams })
      : res.status(500).json({ message: "companyTeams not found." });
  } catch (error) {
    throw error;
  }
};

// exports.createTicketCount = async (req, res) => {
//   try {
//     const ticketNum = await CompanyInfo.create({ ticketNumber: 1000000 });
//     res
//       .status(200)
//       .json({ message: `Ticket number has been reset to: ${ticketNum}` });
//   } catch (error) {
//     res.status(500).json({});
//   }
// };

exports.iterateTicketCount = async (req, res) => {
  try {
    let ticketNum = await CompanyInfo.findOne({ companyID: "11111" });

    ticketNum = ticketNum.ticketNumber;
    const filter = { companyID: "11111" };
    const update = { ticketNumber: ticketNum + 1 };
    await CompanyInfo.updateOne(filter, update);
    res.status(200).json({ message: "Ticket number has been iterated." });
  } catch (error) {
    res.status(500).json({ message: "Failed to iterate ticket count" });
  }
};
