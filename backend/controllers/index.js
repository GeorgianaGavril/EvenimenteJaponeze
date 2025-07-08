const connection = require("./other");
const userController = require("./user");
const eventController = require("./eveniment");
const locController = require("./loc");
const salaController = require("./sala");
const biletController = require("./bilet");
const artistController = require("./artist");
const artistEvenimentController = require("./artistEveniment");
const eventServiceController = require("./eveniment");

const controllers = {
  connection,
  userController,
  eventController,
  locController,
  salaController,
  biletController,
  artistController,
  artistEvenimentController,
  eventServiceController,
};

module.exports = controllers;
