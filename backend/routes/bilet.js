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
router.get("/per/eveniment", biletController.getBiletePerEveniment);
router.get("/stat/lunar", biletController.getBiletePerLuna);
router.get("/stats/category", biletController.getRataOcuparePeCategorie);
router.get("/total/income", biletController.getTotalIncome);
router.get("/hourly/sell", biletController.getBiletePerOra);
router.get("/income/category", biletController.getIncomePerCategory);

module.exports = router;
