const SalaDb = require("../models").Sala;
const functieEroare = require("../utils/errorsManager").functieEroare;

const controller = {
  getAllSali: async (req, res) => {
    try {
      const sala = await SalaDb.findAll();
      res.status(200).json(sala);
    } catch (err) {
      functieEroare(err, "Eroare la returnarea salilor!", res);
    }
  },

  createSala: async (req, res) => {
    try {
      const sala = await SalaDb.create({ ...req.body });
      res.status(201).json(sala);
    } catch (err) {
      functieEroare(err, "Eroare la crearea salii!", res);
    }
  },

  getSalaById: async (req, res) => {
    const id = req.params.id;
    try {
      const sala = await SalaDb.findByPk(id);

      if (!sala) {
        return res.status(200).send({ message: "Nu exista sala cu acest ID!" });
      }

      res.status(200).json(sala);
    } catch (err) {
      functieEroare(err, "Eroare la returnarea salii!", res);
    }
  },

  updateSalaById: async (req, res) => {
    const id = req.params.id;
    const toUpdate = req.body;
    try {
      const sala = await SalaDb.findByPk(id);

      if (!sala) {
        return res.status(200).send({ message: "Nu exista sala cu acest ID!" });
      }

      await sala.update(toUpdate);
      res.status(200).json(sala);
    } catch (err) {
      functieEroare(err, "Eroare la modificarea salii!", res);
    }
  },

  deleteSalaById: async (req, res) => {
    const id = req.params.id;
    try {
      const sala = await SalaDb.findByPk(id);

      if (!sala) {
        return res.status(200).send({ message: "Nu exista sala cu acest ID!" });
      }

      await sala.destroy();
      res.status(200).send({ message: "Sala stearsa cu succes!" });
    } catch (err) {
      functieEroare(err, "Eroare la stergerea salii!", res);
    }
  },
};

module.exports = controller;
