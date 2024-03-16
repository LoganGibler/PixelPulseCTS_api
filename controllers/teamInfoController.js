const TeamInfo = require("../db/teamInfoSchema");

exports.addTeam = async (req, res) => {
  try {
    const createdTeam = await TeamInfo.create(req.body);
    createdTeam
      ? res.status(200).json({ message: "New team added." })
      : res.status(400).json({ message: "Failed to create new team." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "failed to add team to company info schema." });
  }
};

exports.getTeams = async (req, res) => {
  try {
    const teams = await TeamInfo.find();
    res.status(200).json({ teams });
  } catch (error) {
    res.status(500).json({ message: "failed to get teams." });
  }
};

exports.getTeamById = async (req, res) => {
  try {
    const filter = { _id: req.body.id };
    const team = await TeamInfo.findOne(filter);
    team
      ? res.status(200).json({ team })
      : res.status(400).json({ message: "failed to get team by that id." });
  } catch (error) {
    res.status(500).json({ message: "failed to get team by id." });
  }
};
