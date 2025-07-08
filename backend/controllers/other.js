const connection = require("../models").connection;

const controller = {
  resetDB: (req, res) => {
    connection
      .sync({ force: true })
      .then(() => {
        res.status(201).send({ message: "Baza de date resetata cu succes!" });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ message: "Eroare la resetarea bazei de date!" });
      });
  },
};

module.exports = controller;
