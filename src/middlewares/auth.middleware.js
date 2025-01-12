const jwt = require("jsonwebtoken");
const { HttpError, errorHandler } = require("../utils/errorHandler");
const { UNAUTHORIZED } = require("../constants/httpStatusCodes");

const auth = (req, res, next) =>
  errorHandler(res, async () => {
    const token =
      req.cookies?.token ?? req.headers?.authorization?.replace("Bearer ", "");
    if (!token) {
      throw new HttpError({
        message: "Unauthorized Access",
        statusCode: UNAUTHORIZED,
      });
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.auth = decoded?._id;
    if (!req.auth) {
      throw new HttpError({
        message: "Unauthorized Access",
        statusCode: UNAUTHORIZED,
      });
    }
    if (!next) return;
    next();
  });

module.exports = auth;
