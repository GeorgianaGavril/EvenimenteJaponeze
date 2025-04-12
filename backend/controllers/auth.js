const bcrypt = require("bcrypt");
const User = require("../models").User;
const { functieEroare } = require("../utils/errorsManager");
const { generateToken } = require("../middlewares/auth");

const controller = {
  login: async (req, res) => {
    const { email, parola } = req.body;

    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).send({ message: "Utilizator nu a fost gasit!" });
      }

      const isMatch = await bcrypt.compare(parola, user.parola);
      if (!isMatch) {
        return res.status(400).send({ message: "Parola incorecta!" });
      }

      console.log(user);
      const token = generateToken(user);

      res.status(200).json({ message: "Autentificare reusita", token });
    } catch (err) {
      functieEroare(err, "Eroare la logarea utilizatorului!", res);
    }
  },
};

module.exports = controller;
