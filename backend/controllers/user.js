const UserDb = require("../models").User;
const {
  functieEroare,
  verificaExistentaEntitate,
} = require("../utils/errorsManager");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

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
        parola: await bcrypt.hash(parola, 10),
        tip,
      });
      res.status(201).json(user);
    } catch (err) {
      functieEroare(err, "Eroare la crearea utilizatorului!", res);
    }
  },

  bulkCreateUsers: async (req, res) => {
    try {
      const { users } = req.body;

      if (!Array.isArray(users)) {
        return res
          .status(400)
          .json({ message: "Trimite un array de utilizatori." });
      }

      const hashedUsers = await Promise.all(
        users.map(async (user) => {
          const hashedPassword = await bcrypt.hash(user.parola, 10);
          return {
            ...user,
            parola: hashedPassword,
          };
        })
      );

      await UserDb.bulkCreate(hashedUsers, {
        validate: true,
        individualHooks: false,
      });

      res.status(201).json({ message: "Utilizatori adăugați cu succes!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Eroare la adăugarea utilizatorilor." });
    }
  },

  getMonthlyUserStats: async (req, res) => {
    try {
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      const [currentCount, previousCount] = await Promise.all([
        UserDb.count({
          where: {
            createdAt: {
              [Op.gte]: currentMonthStart,
            },
            tip: "userObisnuit",
          },
        }),
        UserDb.count({
          where: {
            createdAt: {
              [Op.between]: [lastMonthStart, lastMonthEnd],
            },
            tip: "userObisnuit",
          },
        }),
      ]);

      const procent =
        previousCount === 0
          ? null
          : (((currentCount - previousCount) / previousCount) * 100).toFixed(1);

      res.status(200).json({
        currentCount,
        previousCount,
        procent,
      });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Eroare la statistica utilizatorilor lunari" });
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

  getUserCount: async (req, res) => {
    try {
      const total = await UserDb.count({
        where: { tip: "userObisnuit" },
      });

      res.status(200).json({ total });
    } catch (err) {
      functieEroare(err, "Eroare la numărarea utilizatorilor!", res);
    }
  },
};

module.exports = controller;
