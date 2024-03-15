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
