const EvenimentDb = require("../models").Eveniment;
const ArtistEvenimentDb = require("../models").ArtistEveniment;
const SalaDb = require("../models").Sala;
const {
  functieEroare,
  verificaExistentaEntitate,
} = require("../utils/errorsManager");

const controller = {
  getAllEvents: async (req, res) => {
    try {
      const events = await EvenimentDb.findAll();
      res.status(200).json(events);
    } catch (err) {
      functieEroare("Eroare la returnarea evenimentelor", res);
    }
  },

  createEvent: async (req, res) => {
    try {
      const {
        titlu,
        data,
        durata,
        descriere,
        pretVIP,
        pretLoja,
        pretStandard,
        salaId,
        artisti = [],
      } = req.body;

      const eveniment = await EvenimentDb.create({
        titlu,
        data,
        durata,
        descriere,
        pretVIP,
        pretLoja,
        pretStandard,
        salaId,
      });

      for (const artist of artisti) {
        await ArtistEvenimentDb.create({
          artistId: artist.id,
          evenimentId: eveniment.id,
          rol: artist.rol || "necunoscut",
        });
      }

      res.status(201).json(eveniment);
    } catch (err) {
      functieEroare(err, "Eroare la crearea evenimentului", res);
    }
  },

  getEventById: async (req, res) => {
    const id = req.params.id;
    try {
      const event = await verificaExistentaEntitate(
        EvenimentDb,
        id,
        res,
        "event"
      );
      if (!event) {
        return;
      }

      res.status(200).json(event);
    } catch (err) {
      functieEroare(err, "Eroare la returnarea evenimentului!", res);
    }
  },

  updateEventById: async (req, res) => {
    const id = req.params.id;
    const salaId = req.params.salaId;
    const toUpdate = req.body;
    try {
      const event = await verificaExistentaEntitate(
        EvenimentDb,
        id,
        res,
        "event"
      );
      if (!event) {
        return;
      }

      await event.update(toUpdate);
      res.status(200).json(event);
    } catch (err) {
      functieEroare(err, "Eroare la modificarea evenimentului!", res);
    }
  },

  deleteEventById: async (req, res) => {
    const id = req.params.id;
    try {
      const event = await verificaExistentaEntitate(
        EvenimentDb,
        id,
        res,
        "event"
      );
      if (!event) {
        return;
      }

      await event.destroy();
      res.status(200).send({ message: "Eveniment sters cu succes!" });
    } catch (err) {
      functieEroare(err, "Eroare la stergerea evenimentului!", res);
    }
  },
};

module.exports = controller;
