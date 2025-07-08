require("dotenv").config();
const jwt = require("jsonwebtoken");

const controller = {
  verifyAdmin: (req, res, next) => {
    const token = req.headers.authorization;
    console.log(token);
    if (!token) {
      return res.status(401).send({ message: "Acces neautorizat" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(403).send({ message: "Token invalid!" });
      }

      if (decoded.tip !== "admin") {
        return res
          .status(403)
          .send({ message: "Acces interzis - doar pentru admini" });
      }

      req.user = decoded;
      next();
    });
  },
};

module.exports = controller;
