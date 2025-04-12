const express = require("express");
const router = express.Router();
const salaController = require("../controllers").salaController;

router.get("/", salaController.getAllSali);
router.post("/", salaController.createSala);
router.get("/:id", salaController.getSalaById);
router.patch("/:id", salaController.updateSalaById);
router.delete("/:id", salaController.deleteSalaById);

module.exports = router;
