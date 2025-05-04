const ArtistDb = require("../models").Artist;
const {
  functieEroare,
  verificaExistentaEntitate,
} = require("../utils/errorsManager");

const controller = {
  getAllArtisti: async (req, res) => {
    try {
      const artisti = await ArtistDb.findAll();
      res.status(200).json(artisti);
    } catch (err) {
      functieEroare(err, "Eroare la returnarea artistilor!", res);
    }
  },

  createArtist: async (req, res) => {
    try {
      const artist = await ArtistDb.create({
        ...req.body,
        evenimentId: req.params.evenimentId,
      });
      res.status(201).json(artist);
    } catch (err) {
      functieEroare(err, "Eroare la crearea artistului!", res);
    }
  },

  getArtistById: async (req, res) => {
    const id = req.params.id;
    try {
      const artist = await verificaExistentaEntitate(
        ArtistDb,
        id,
        res,
        "artist"
      );
      if (!artist) {
        return;
      }

      res.status(200).json(artist);
    } catch (err) {
      functieEroare(err, "Eroare la returnarea artistului!", res);
    }
  },

  updateArtistById: async (req, res) => {
    const id = req.params.id;
    const toUpdate = req.body;
    try {
      const artist = await verificaExistentaEntitate(
        ArtistDb,
        id,
        res,
        "artist"
      );
      if (!artist) {
        return;
      }

      await artist.update(toUpdate);
      res.status(200).json(artist);
    } catch (err) {
      functieEroare(err, "Eroare la modificarea artist!", res);
    }
  },

  deleteArtistById: async (req, res) => {
    const id = req.params.id;
    try {
      const artist = await verificaExistentaEntitate(
        ArtistDb,
        id,
        res,
        "artist"
      );
      if (!artist) {
        return;
      }

      await artist.destroy();
      res.status(200).send({ message: "Artist sters cu succes!" });
    } catch (err) {
      functieEroare(err, "Eroare la stergerea biletului!", res);
    }
  },
};

module.exports = controller;
