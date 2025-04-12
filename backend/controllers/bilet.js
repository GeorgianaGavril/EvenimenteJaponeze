const BiletDb = require("../models").Bilet;
const { functieEroare } = require("../utils/errorsManager");

const controller = {
  getAllBilete: async (req, res) => {
    try {
      const bilete = await BiletDb.findAll();
      res.status(200).json(bilete);
    } catch (err) {
      functieEroare(err, "Eroare la returnarea biletelor!", res);
    }
  },

  createBilet: async (req, res) => {
    try {
      const bilet = await BiletDb.create({
        userId: req.params.userId,
        locId: req.body.locId,
        evenimentId: req.params.evenimentId,
      });
      res.status(201).json(bilet);
    } catch (err) {
      functieEroare(err, "Eroare la crearea biletului!", res);
    }
  },

  getBiletById: async (req, res) => {
    const id = req.params.id;
    try {
      const bilet = await BiletDb.findByPk(id);

      if (!bilet) {
        return res
          .status(404)
          .send({ message: "Nu exista bilet cu acest ID!" });
      }

      res.status(200).json(bilet);
    } catch (err) {
      functieEroare(err, "Eroare la returnarea biletului!", res);
    }
  },

  deleteBiletById: async (req, res) => {
    const id = req.params.id;
    try {
      const bilet = await BiletDb.findByPk(id);

      if (!bilet) {
        return res
          .status(404)
          .send({ message: "Nu exista bilet cu acest ID!" });
      }

      await bilet.destroy();
      res.status(200).send({ message: "Bilet sters cu succes!" });
    } catch (err) {
      functieEroare(err, "Eroare la stergerea biletului!", res);
    }
  },
};

module.exports = controller;
