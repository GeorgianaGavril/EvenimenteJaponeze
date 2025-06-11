const BiletDb = require("../models").Bilet;
const EventDb = require("../models").Eveniment;
const {
  functieEroare,
  verificaExistentaEntitate,
} = require("../utils/errorsManager");

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

  bulkCreateBilete: async (req, res) => {
    try {
      const { bilete } = req.body;

      if (!Array.isArray(bilete)) {
        return res
          .status(400)
          .send({ message: "Trebuie trimis array de bilete!" });
      }

      await BiletDb.bulkCreate(bilete);
      res.status(201).send({ message: "Bilete introduse cu succes!" });
    } catch (err) {
      functieEroare(err, "Eroare la crearea biletelor!", res);
    }
  },

  getBiletById: async (req, res) => {
    const id = req.params.id;
    try {
      const bilet = await verificaExistentaEntitate(BiletDb, id, res, "bilet");
      if (!bilet) {
        return;
      }

      res.status(200).json(bilet);
    } catch (err) {
      functieEroare(err, "Eroare la returnarea biletului!", res);
    }
  },

  getBileteByEvent: async (req, res) => {
    const evenimentId = req.params.evenimentId;
    try {
      const event = await verificaExistentaEntitate(
        EventDb,
        evenimentId,
        res,
        "eveniment"
      );
      if (!event) {
        return;
      }

      const bilete = await BiletDb.findAll({
        where: { evenimentId: evenimentId },
      });
      res.status(200).json(bilete);
    } catch (err) {
      functieEroare(
        err,
        `Eroare la returnarea biletelor pentru evenimentul ${evenimentId}`,
        res
      );
    }
  },

  deleteBiletById: async (req, res) => {
    const id = req.params.id;
    try {
      const bilet = await verificaExistentaEntitate(BiletDb, id, res, "bilet");
      if (!bilet) {
        return;
      }

      await bilet.destroy();
      res.status(200).send({ message: "Bilet sters cu succes!" });
    } catch (err) {
      functieEroare(err, "Eroare la stergerea biletului!", res);
    }
  },
};

module.exports = controller;
