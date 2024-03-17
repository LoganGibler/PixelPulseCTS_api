const express = require("express");
const userController = require("../controllers/userController");
const authenticate = require("../authMiddleware");
const router = express.Router();

router.post("/createUser",  userController.createUser);
router.post("/loginUser", userController.loginUser);

router.delete("/deleteUser", authenticate, userController.deleteUser);

router.get("/getAllUsers", authenticate, userController.getAllUsers);

router.get("/getUsersByTeam", authenticate, userController.getUsersByTeam);
router.get("/getUsersByRole", authenticate, userController.getUsersByRole);
router.get("/getUsersByEmail", authenticate, userController.getUsersByEmail);
router.get("/getUsersByName", authenticate, userController.getUsersByName);
router.get("/getAllUsersAdmin", authenticate, userController.getAllUsersAdmin);

router.post("/getUsersById", authenticate, userController.getUsersById);
router.post("/updateUserName", authenticate, userController.updateUserName);
router.post("/updateUserEmail", authenticate, userController.updateUserEmail);
router.post("/updateUserPager", authenticate, userController.updatePagerById);
router.post("/updateUserPhone", authenticate, userController.updatePhoneById);
router.post("/updateUserTeam", authenticate, userController.updateTeamById);
router.post("/updateUserRole", authenticate, userController.updateRoleById);

router.post("/searchUsers", userController.searchUsers);
router.post("/getUsersTeams", authenticate, userController.getUsersTeams);
router.post("/getTeamMembers", authenticate, userController.getTeamMembers);
module.exports = router;
