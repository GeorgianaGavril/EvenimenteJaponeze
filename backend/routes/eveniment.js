const express = require("express");
const router = express.Router();
const eventController = require("../controllers").eventController;

router.get("/", eventController.getAllEvents);
router.post("/:salaId", eventController.createEvent);
router.get("/:id", eventController.getEventById);
router.patch("/:id", eventController.updateEventById);
router.delete("/:id", eventController.deleteEventById);

module.exports = router;
