const express = require("express");
const router = express.Router();
const resetController = require("../controllers").connection;

router.get("/", resetController.resetDB);

module.exports = router;
