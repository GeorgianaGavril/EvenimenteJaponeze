const express = require("express");
const router = express.Router();
const artistController = require("../controllers").artistController;

router.get("/", artistController.getAllArtisti);
router.post("/:evenimentId", artistController.createArtist);
router.get("/:id", artistController.getArtistById);
router.patch("/:id", artistController.updateArtistById);
router.delete("/:id", artistController.deleteArtistById);

module.exports = router;
