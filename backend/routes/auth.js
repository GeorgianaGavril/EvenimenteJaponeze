const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { createUser } = require("../controllers/user");

router.post("/login", authController.login);
router.post("/sign-up", createUser);

module.exports = router;
