require("dotenv").config();
const jwt = require("jsonwebtoken");

const controller = {
  generateToken: (user) => {
    return jwt.sign({ tip: user.tip }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
  },

  verifyToken: async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).send({ message: "Acces neautorizat" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).send({ message: "Token invalid!" });
      }
      res.user = decoded;
      next();
    });
  },
};

module.exports = controller;
