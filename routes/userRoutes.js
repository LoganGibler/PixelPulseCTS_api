const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/createUser", userController.createUser);
router.post("/loginUser", userController.loginUser);

router.delete("/deleteUser", userController.deleteUser);

router.get("/getAllUsers", userController.getAllUsers);
router.get("/getUsersById", userController.getUsersById);
router.get("/getUsersByTeam", userController.getUsersByTeam);
router.get("/getUsersByRole", userController.getUsersByRole);
router.get("/getUsersByEmail", userController.getUsersByEmail);
router.get("/getUsersByName", userController.getUsersByName);
router.get("/getAllUsersAdmin", userController.getAllUsersAdmin);

router.post("/updateUserName", userController.updateUserName);
router.post("/updateUserEmail", userController.updateUserEmail);
router.post("/updateUserPager", userController.updatePagerById);
router.post("/updateUserPhone", userController.updatePhoneById);
router.post("/updateUserTeam", userController.updateTeamById);
router.post("/updateUserRole", userController.updateRoleById);

module.exports = router;
