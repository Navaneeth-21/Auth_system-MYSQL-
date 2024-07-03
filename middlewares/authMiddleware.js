require("dotenv").config();
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (authHeader == null) {
      return res.status(401).json({ message: "No Token provided" });
    }

    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
      return res.status(401).json({ message: "Malformed token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = authenticateToken;
