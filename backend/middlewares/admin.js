const jwt = require("jsonwebtoken");

const requireAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization; // Bearer token
  if (!authHeader) return res.status(401).json({ message: "Fără token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin")
      return res.status(403).json({ message: "Acces interzis" });

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid" });
  }
};
