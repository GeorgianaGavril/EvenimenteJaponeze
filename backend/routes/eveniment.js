const express = require("express");
const router = express.Router();
const eventController = require("../controllers").eventController;
const { verifyAdmin } = require("../middlewares/admin");

router.get("/", eventController.getAllEvents);
router.post("/", verifyAdmin, eventController.createEvent);
router.get("/:id", eventController.getEventById);
router.patch("/:id", verifyAdmin, eventController.updateEventById);
router.delete("/:id", verifyAdmin, eventController.deleteEventById);

module.exports = router;
