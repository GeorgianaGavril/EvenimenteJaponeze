const LocDb = require("../models").Loc;
const functieEroare = require("../utils/errorsManager").functieEroare;

const controller = {
  getAllLocuri: async (req, res) => {
    try {
      const loc = await LocDb.findAll();
      res.status(200).json(loc);
    } catch (err) {
      functieEroare(err, "Eroare la returnarea locurilor!", res);
    }
  },

  createLoc: async (req, res) => {
    try {
      const loc = await LocDb.create({
        ...req.body,
      });
      res.status(201).json(loc);
    } catch (err) {
      functieEroare(err, "Eroare la crearea locului!", res);
    }
  },

  getLocById: async (req, res) => {
    const id = req.params.id;

    try {
      const loc = await LocDb.findByPk(id);

      if (!loc) {
        return res.status(404).send({ message: "Nu exista loc cu acest id!" });
      }

      res.status(200).json(loc);
    } catch (err) {
      functieEroare(err, "Eroare la returnarea locului!", res);
    }
  },

  updateLocById: async (req, res) => {
    const id = req.params.id;
    const toUpdate = req.body;

    try {
      const loc = await LocDb.findByPk(id);

      if (!loc) {
        return res.status(404).send({ message: "Nu exista loc cu acest id!" });
      }

      await loc.update(toUpdate);
      res.status(200).json(loc);
    } catch (err) {
      functieEroare(err, "Eroare la modificarea locului!", res);
    }
  },

  deleteLocById: async (req, res) => {
    const id = req.params.id;

    try {
      const loc = await LocDb.findByPk(id);

      if (!loc) {
        return res.status(404).send({ message: "Nu exista loc cu acest id!" });
      }

      await loc.destroy();
      res.status(200).send({ message: "Loc sters cu succes!" });
    } catch (err) {
      functieEroare(err, "Eroare la stergerea locului!", res);
    }
  },
};

module.exports = controller;
