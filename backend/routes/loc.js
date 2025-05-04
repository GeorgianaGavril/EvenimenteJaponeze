const express = require("express");
const router = express.Router();
const locController = require("../controllers").locController;

router.get("/", locController.getAllLocuri);
router.post("/", locController.createLoc);
router.post("/all", locController.bulkCreateLoc);
router.get("/sala/:salaId", locController.getLocBySalaId);
router.get("/:id", locController.getLocById);
router.patch("/:id", locController.updateLocById);
router.delete("/:id", locController.deleteLocById);

module.exports = router;
