const express = require("express");
const router = express.Router();
const biletController = require("../controllers").biletController;

router.get("/", biletController.getAllBilete);
router.post(
  "/user/:userId/eveniment/:evenimentId",
  biletController.createBilet
);
router.post("/all", biletController.bulkCreateBilete);
router.get("/event/:evenimentId", biletController.getBileteByEvent);
router.get("/:id", biletController.getBiletById);
router.delete("/:id", biletController.deleteBiletById);

module.exports = router;
