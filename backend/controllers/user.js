const UserDb = require("../models").User;
const {
  functieEroare,
  verificaExistentaEntitate,
} = require("../utils/errorsManager");
const bcrypt = require("bcrypt");

const controller = {
  getAllUsers: async (req, res) => {
    try {
      const users = await UserDb.findAll();
      res.status(200).json(users);
    } catch (err) {
      functieEroare(err, "Eroare la returnarea utilizatorilor!", res);
    }
  },

  createUser: async (req, res) => {
    const { nume, prenume, email, parola, confirmaParola, tip } = req.body;

    if (parola !== confirmaParola) {
      return res
        .status(400)
        .send({ message: "Parola trebuie sa fie aceeasi!" });
    }

    try {
      const user = await UserDb.create({
        nume,
        prenume,
        email,
        parola: await bcrypt.hash(req.body.parola, 10),
        tip,
      });
      res.status(201).json(user);
    } catch (err) {
      functieEroare(err, "Eroare la crearea utilizatorului!", res);
    }
  },

  getUserById: async (req, res) => {
    const id = req.params.id;

    try {
      const user = await verificaExistentaEntitate(UserDb, id, res, "user");
      if (!user) {
        return;
      }

      res.status(200).json(user);
    } catch (err) {
      functieEroare(err, "Eroare la returnarea utilizatorului!", res);
    }
  },

  updateUserById: async (req, res) => {
    const id = req.params.id;
    const toUpdate = req.body;

    try {
      const user = await verificaExistentaEntitate(UserDb, id, res, "user");
      if (!user) {
        return;
      }

      await user.update(toUpdate);
      res.status(200).json(user);
    } catch (err) {
      functieEroare(err, "Eroare la modificarea utilizatorului!", res);
    }
  },

  deleteUserById: async (req, res) => {
    const id = req.params.id;

    try {
      const user = await verificaExistentaEntitate(UserDb, id, res, "user");
      if (!user) {
        return;
      }

      await user.destroy();
      res.status(200).send({ message: "User sters cu succes!" });
    } catch (err) {
      functieEroare(err, "Eroare la stergerea utilizatorului!", res);
    }
  },
};

module.exports = controller;
