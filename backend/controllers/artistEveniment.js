const { ArtistEveniment, Artist, Eveniment } = require("../models");
const {
  functieEroare,
  verificaExistentaEntitate,
} = require("../utils/errorsManager");

const controller = {
  getAll: async (req, res) => {
    try {
      const asocieri = await ArtistEveniment.findAll({
        include: [Artist, Eveniment],
      });
      res.status(200).json(asocieri);
    } catch (err) {
      functieEroare(
        err,
        "Eroare la returnarea legăturilor artist-eveniment!",
        res
      );
    }
  },

  getByEvenimentId: async (req, res) => {
    const evenimentId = req.params.evenimentId;

    try {
      const artisti = await ArtistEveniment.findAll({
        where: { evenimentId },
        include: [
          {
            model: Artist,
            attributes: ["nume", "prenume"],
          },
        ],
      });

      res.status(200).json(artisti);
    } catch (err) {
      res.status(500).json({ message: "Eroare la obținerea artiștilor", err });
    }
  },

  create: async (req, res) => {
    const { artistId, evenimentId, rol } = req.body;
    try {
      const artist = await verificaExistentaEntitate(
        Artist,
        artistId,
        res,
        "artist"
      );
      const eveniment = await verificaExistentaEntitate(
        Eveniment,
        evenimentId,
        res,
        "eveniment"
      );
      if (!artist || !eveniment) return;

      const asociere = await ArtistEveniment.create({
        artistId,
        evenimentId,
        rol,
      });
      res.status(201).json(asociere);
    } catch (err) {
      functieEroare(err, "Eroare la crearea legăturii artist-eveniment!", res);
    }
  },

  update: async (req, res) => {
    const { artistId, evenimentId } = req.params;
    const { rol } = req.body;

    try {
      const asociere = await ArtistEveniment.findOne({
        where: { artistId, evenimentId },
      });

      if (!asociere) {
        return res.status(404).json({ message: "Legătura nu a fost găsită." });
      }

      asociere.rol = rol;
      await asociere.save();
      res.status(200).json(asociere);
    } catch (err) {
      functieEroare(err, "Eroare la modificarea rolului!", res);
    }
  },

  // șterge legătura artist-eveniment
  delete: async (req, res) => {
    const { artistId, evenimentId } = req.params;

    try {
      const asociere = await ArtistEveniment.findOne({
        where: { artistId, evenimentId },
      });

      if (!asociere) {
        return res.status(404).json({ message: "Legătura nu a fost găsită." });
      }

      await asociere.destroy();
      res.status(200).json({ message: "Legătura a fost ștearsă cu succes." });
    } catch (err) {
      functieEroare(err, "Eroare la ștergerea legăturii!", res);
    }
  },
};

module.exports = controller;
