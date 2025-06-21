const express = require("express");
const router = express.Router();
const userController = require("../controllers").userController;

router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);
router.get("/:id", userController.getUserById);
router.patch("/:id", userController.updateUserById);
router.delete("/:id", userController.deleteUserById);
router.get("/count/userObisnuit", userController.getUserCount);
router.post("/all", userController.bulkCreateUsers);
router.get("/monthly/sign-up", userController.getMonthlyUserStats);

module.exports = router;
