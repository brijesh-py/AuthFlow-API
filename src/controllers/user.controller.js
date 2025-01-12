const userService = require("../services/user.service");
const { response } = require("../utils/response");
const { HttpError, errorHandler } = require("../utils/errorHandler");
const HTTP_STATUS_CODES = require("../constants/httpStatusCodes");

class UserController {
  getProfile(req, res) {
    const userId = req.auth;
    errorHandler(res, async () => {
      const user = await userService.findOnyById(userId);
      if (!user) {
        throw new HttpError({
          message: "Unauthorized Access",
          statusCode: HTTP_STATUS_CODES.UNAUTHORIZED,
        });
      }
      response({ res, user });
    });
  }

  updateProfile(req, res) {
    const userId = req.auth;
    const { name, role, avatar } = req.body;
    errorHandler(res, async () => {
      const user = await userService.updateProfile(userId, {
        name,
        role,
        avatar,
      });
      if (!user) {
        throw new HttpError({
          message: "Unauthorized Access",
          statusCode: HTTP_STATUS_CODES.UNAUTHORIZED,
        });
      }
      response({ res, user, message: "Profile updated successfully" });
    });
  }

  updatePassword(req, res) {
    const userId = req.auth;
    const { oldPassword, password } = req.body;
    errorHandler(res, async () => {
      const isExistsUser = await userService.findOnyById(userId);
      if (!isExistsUser) {
        throw new HttpError({
          message: "Unauthorized Access",
          statusCode: HTTP_STATUS_CODES.UNAUTHORIZED,
        });
      }
      const user = await userService.updatePassword(userId, {
        oldPassword,
        password,
      });
      if (!user) {
        throw new HttpError({
          message: "Old password is incorrect",
          statusCode: HTTP_STATUS_CODES.NOT_FOUND,
        });
      }
      response({ res, message: "Password updated successfully" });
    });
  }

  logout(req, res) {
    errorHandler(res, async () => {
      res.clearCookie("token");
      response({
        res,
        message: "Logout successfully",
      });
    });
  }
}

module.exports = new UserController();
