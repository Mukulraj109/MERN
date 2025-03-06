const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authenticateUser = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id).select("-password");
    if (!user) {
      return res.status(401).json({ error: "Invalid token. User not found." });
    }
   

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token." });
  }
};

exports.authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied. Insufficient role." });
    }

    next();
  };
};
