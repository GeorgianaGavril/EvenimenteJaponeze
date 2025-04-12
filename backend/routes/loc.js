const express = require("express");
const router = express.Router();
const locController = require("../controllers").locController;

router.get("/", locController.getAllLocuri);
router.post("/", locController.createLoc);
router.get("/:id", locController.getLocById);
router.patch("/:id", locController.updateLocById);
router.delete("/:id", locController.deleteLocById);

module.exports = router;
