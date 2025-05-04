const EvenimentDb = require("../models").Eveniment;
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
      const sala = await SalaDb.findByPk(req.params.salaId);

      if (!sala) {
        return res.status(404).send({ message: "Nu exista sala cu acest ID!" });
      }

      const event = await EvenimentDb.create({
        ...req.body,
        salaId: req.params.salaId,
      });
      res.status(201).json(event);
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
