const authMiddleware = require("./auth.middleware");

const alreadyLoggedIn = async (req, res, next) => {
  await authMiddleware(req, res, null);
  if (req.auth) {
    return res.status(400).json({ message: "User already logged in" });
  }
  next();
};

module.exports = alreadyLoggedIn;
