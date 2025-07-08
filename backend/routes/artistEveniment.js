const express = require("express");
const router = express.Router();
const artistEvenimentController =
  require("../controllers").artistEvenimentController;

router.get("/", artistEvenimentController.getAll);
router.get("/event/:evenimentId", artistEvenimentController.getByEvenimentId);
router.post("/", artistEvenimentController.create);
router.put("/:artistId/:evenimentId", artistEvenimentController.update);
router.delete("/:artistId/:evenimentId", artistEvenimentController.delete);

module.exports = router;
