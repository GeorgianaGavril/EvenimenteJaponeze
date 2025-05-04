const express = require("express");
const router = express.Router();
const resetRouter = require("./other");
const userRouter = require("./user");
const eventRouter = require("./eveniment");
const locRouter = require("./loc");
const salaRouter = require("./sala");
const biletRouter = require("./bilet");
const authRouter = require("./auth");
const artistRouter = require("./artist");

router.use("/reset", resetRouter);
router.use("/user", userRouter);
router.use("/event", eventRouter);
router.use("/loc", locRouter);
router.use("/sala", salaRouter);
router.use("/bilet", biletRouter);
router.use("/auth", authRouter);
router.use("/artist", artistRouter);

module.exports = router;
