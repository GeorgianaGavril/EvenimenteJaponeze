const ArtistDb = require("../models").Artist;
const Evenimentdb = require("../models").Eveniment;
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

  getArtistiByEvent: async (req, res) => {
    const eventId = req.params.evenimentId;

    try {
      const event = await verificaExistentaEntitate(
        Evenimentdb,
        eventId,
        res,
        "eveniment"
      );
      if (!event) {
        return;
      }

      const artisti = await ArtistDb.findAll({
        where: { evenimentId: eventId },
      });
      res.status(200).json(artisti);
    } catch (err) {
      functieEroare(err, "Eroare la returnarea artistilor!", res);
    }
  },

  createArtist: async (req, res) => {
    try {
      const artist = await ArtistDb.create({
        ...req.body,
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
