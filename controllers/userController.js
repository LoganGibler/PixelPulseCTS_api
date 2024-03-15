const User = require("../db/userSchema");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const TeamInfo = require("../db/teamInfoSchema");
// const { default: mongoose } = require("mongoose");

exports.testAuth = async (req, res) => {
  try {
    const authenticatedUser = req.user;
    // let adminStatus = req.adminStatus;
    res.status(200).json({
      message: "User is authenticated.",
      // authenticatedUser,
      authenticatedUser,
    });
  } catch (error) {
    res.status(200).json({ message: "User is not authenticated." });
  }
};

// Create user
exports.createUser = async (req, res) => {
  try {
    const userCheck = await User.find({ name: req.body.name });
    if (userCheck[0] !== undefined) {
      return res.status(400).json({ message: "user already exists." });
    } else {
      const password = process.env.defaultPass;
      const salt = await bcrypt.genSalt();
      const hashedPassword = bcrypt.hashSync(password, salt);
      const user = await User.create({
        name: req.body.name,
        password: hashedPassword,
        email: req.body.email,
        role: req.body.role,
        team: req.body.team,
        officePhone: req.body.officePhone,
        pagerPhone: req.body.pagerPhone,
      });
      user
        ? res.status(200).json({ message: "User sucessfully created", user })
        : res.status(400).json({ message: "failed to create user" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

const MAX_FAILED_ATTEMPTS = 3; // Adjust the maximum allowed failed attempts
const LOCKOUT_DURATION_MINUTES = 5; // Adjust the lockout duration in minutes

exports.loginUser = async (req, res) => {
  try {
    // should username be email? probably
    let { email, password } = req.body;
    const user = await User.findOne({ email: email });
    // console.log(user);
    if (!user) {
      return res.status(402).json({ message: "Invalid credentials." });
    }

    // Check if the account is locked
    if (
      user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS &&
      user.lockedUntil > Date.now()
    ) {
      const remainingTime = Math.ceil(
        (user.lockedUntil - Date.now()) / (60 * 1000)
      ); // in minutes
      return res.status(429).json({
        message: `Account locked. Try again in ${remainingTime} minutes.`,
      });
    }

    bcrypt.compare(password, user.password, async (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Invalid credentials." });
      }

      if (result) {
        const filter = { email: req.body.email };
        const update = { failedLoginAttempts: 0, lockedUntil: null };
        await User.updateOne(filter, update);
        // change below to 60*60 for 1 hour.
        const expiresIn = 60 * 60 * 60;
        const token = jwt.sign({ email: user.email }, process.env.userJWT, {
          expiresIn,
        });

        const userID = user._id;
        res.json({
          message: "Login Successful.",
          token,
          userID,
        });
      } else {
        const newFailedAttempts = user.failedLoginAttempts + 1;
        let update = { failedLoginAttempts: newFailedAttempts };
        const filter = { email: req.body.email };
        if (newFailedAttempts > MAX_FAILED_ATTEMPTS) {
          const lockoutDuration = LOCKOUT_DURATION_MINUTES * 60 * 1000; //5 mins, in milliseconds
          const lockedUntil = Date.now() + lockoutDuration;
          // console.log(lockedUntil);
          update = {
            failedLoginAttempts: newFailedAttempts,
            lockedUntil: lockedUntil,
          };
        }

        User.updateOne(filter, update)
          .then(() => {
            return res.status(404).json({ message: "Invalid credentials." });
          })
          .catch((error) => {
            return res
              .status(500)
              .json({ message: "Error updating user lock out data." });
          });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed." });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = { _id: req.body.id };
    const deletedUser = await User.deleteOne(userId);
    // console.log(deletedUser.deletedCount);
    deletedUser.deletedCount > 0
      ? res
          .status(200)
          .json({ message: "User sucessfuly deleted", deletedUser })
      : res.status(400).json({ error: "User not found" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the user" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select({ __v: 0, password: 0 });
    users.length != 0
      ? res.status(200).json({ users })
      : res.status(400).json({ message: "No users have been found." });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all users." });
  }
};

// Find all users   need admin shows password
exports.getAllUsersAdmin = async (req, res) => {
  try {
    const users = await User.find({});
    users.length != 0
      ? res.status(200).json({ users })
      : res.status(400).json({ message: "No users have been found." });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all users." });
  }
};

// findUserByID   Having issues
exports.getUsersById = async (req, res) => {
  try {
    if (req.body.id.length !== 24) {
      res.status(400).json({ message: "bad length" });
    } else {
      const filter = { _id: req.body.id };
      const users = await User.findOne(filter).select({ __v: 0, password: 0 });
      users
        ? res.status(200).json({ users })
        : res.status(404).json({ message: "No users match" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "failed to get users." });
  }
};

// findUserByTeam
exports.getUsersByTeam = async (req, res) => {
  try {
    const filter = { team: req.body.team };
    const users = await User.find(filter).select({ __v: 0, password: 0 });
    users.length != 0
      ? res.status(200).json({ users })
      : res.status(400).json({ message: "No users have been found." });
  } catch (error) {
    res.status(500).json({ message: "failed to get users." });
  }
};

// findUserByRole
exports.getUsersByRole = async (req, res) => {
  try {
    const filter = { role: req.body.role };
    const users = await User.find(filter).select({ __v: 0, password: 0 });
    users.length != 0
      ? res.status(200).json({ users })
      : res.status(400).json({ message: "No users have been found." });
  } catch (error) {
    res.status(500).json({ message: "failed to get users." });
  }
};

// findUserByEmail
exports.getUsersByEmail = async (req, res) => {
  try {
    const filter = { email: req.body.email };
    const users = await User.find(filter).select({ __v: 0, password: 0 });
    users.length != 0
      ? res.status(200).json({ users })
      : res.status(400).json({ message: "No users have been found." });
  } catch (error) {
    res.status(500).json({ message: "failed to get users." });
  }
};

// findUserByName
exports.getUsersByName = async (req, res) => {
  try {
    const filter = { name: req.body.name };
    const users = await User.find(filter).select({ __v: 0, password: 0 });
    users.length != 0
      ? res.status(200).json({ users })
      : res.status(400).json({ message: "No users have been found." });
  } catch (error) {
    res.status(500).json({ message: "failed to get users." });
  }
};

//----------------------------updates----------------------------//

//updateUserNameByID
exports.updateUserName = async (req, res) => {
  try {
    const filter = { _id: req.body.id };
    const update = { name: req.body.name };
    const updateduser = await User.updateOne(filter, update);
    updateduser.matchedCount > 0
      ? res
          .status(200)
          .json({ message: "Users name has been updated", updateduser })
      : res.status(400).json({ message: "No user with given ID." });
  } catch (error) {
    res.status(500).json({ message: "failed to update user status." });
  }
};

//updateUserEmailByID
exports.updateUserEmail = async (req, res) => {
  try {
    const filter = { _id: req.body.id };
    const update = { email: req.body.email };
    const updateduser = await User.updateOne(filter, update);
    updateduser.matchedCount > 0
      ? res
          .status(200)
          .json({ message: "Users email has been updated", updateduser })
      : res.status(400).json({ message: "failed to update user status." });
  } catch (error) {
    res.status(500).json({ message: "failed to update user status." });
  }
};

//update Pager By ID
exports.updatePagerById = async (req, res) => {
  try {
    const filter = { _id: req.body.id };
    const update = { pagerPhone: req.body.pagerPhone };
    const updateduser = await User.updateOne(filter, update);
    updateduser.matchedCount > 0
      ? res
          .status(200)
          .json({ message: "Users pager number has been updated", updateduser })
      : res.status(400).json({ message: "failed to update user status." });
  } catch (error) {
    res.status(500).json({ message: "failed to update user status." });
  }
};

//update office phone By ID
exports.updatePhoneById = async (req, res) => {
  try {
    const filter = { _id: req.body.id };
    const update = { officePhone: req.body.officePhone };
    const updateduser = await User.updateOne(filter, update);
    updateduser.matchedCount > 0
      ? res
          .status(200)
          .json({ message: "Users office phone has been updated", updateduser })
      : res.status(400).json({ message: "failed to update user status." });
  } catch (error) {
    res.status(500).json({ message: "failed to update user status." });
  }
};

//update team By ID
exports.updateTeamById = async (req, res) => {
  try {
    const filter = { _id: req.body.id };
    const update = { team: req.body.team };
    const updateduser = await User.updateOne(filter, update);
    updateduser.matchedCount > 0
      ? res
          .status(200)
          .json({ message: "Users team has been updated", updateduser })
      : res.status(400).json({ message: "failed to update user status." });
  } catch (error) {
    res.status(500).json({ message: "failed to update user status." });
  }
};

//update role By ID
exports.updateRoleById = async (req, res) => {
  try {
    const filter = { _id: req.body.id };
    const update = { role: req.body.role };
    const updateduser = await User.updateOne(filter, update);
    updateduser.matchedCount > 0
      ? res
          .status(200)
          .json({ message: "Users role has been updated", updateduser })
      : res.status(400).json({ message: "failed to update user status." });
  } catch (error) {
    res.status(500).json({ message: "failed to update user status." });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const search = req.body.search;
    console.log("Here is the search: ", search);

    const regex = new RegExp(search, "i");
    // console.log("Here is regex:", typeof regex.toString());

    const filter = {
      $or: [
        { name: { $regex: regex } },
        { email: { $regex: regex } },
        { role: { $elemMatch: { $regex: regex } } },
        { team: { $elemMatch: { $regex: regex } } },

        { officePhone: { $regex: regex } },
        { pagerPhone: { $regex: regex } },
      ],
    };

    const foundUsers = await User.find(filter);
    // console.log("Here are found users: ", foundUsers);
    foundUsers
      ? res.status(200).json({ foundUsers })
      : res.status(300).json({ message: "No users found." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "failed to search users." });
  }
};

exports.getUsersTeams = async (req, res) => {
  try {
    const teamData = [];
    const teams = req.body.teams;
    console.log("Here is user teams:", teams);
    for (let i = 0; i < teams.length; i++) {
      const filter = { teamName: teams[i] };
      const teamInfo = await TeamInfo.findOne(filter);
      teamData.push(teamInfo);
      console.log(teamData);
    }

    res.status(200).json({ teamData });
  } catch (error) {
    res.status(500).json({ message: "failed to get users teams." });
  }
};

exports.getTeamMembers = async (req, res) => {
  try {
    const team = req.body.team;
    const teamMembers = await User.find({ team: team }).select({
      __v: 0,
      password: 0,
    });
    res.status(200).json({ teamMembers });
  } catch (error) {
    res.status(500).json({ message: "Failed to get team members." });
  }
};
