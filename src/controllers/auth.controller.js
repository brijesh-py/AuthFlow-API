const userService = require("../services/user.service");
const { response } = require("../utils/response");
const { HttpError, errorHandler } = require("../utils/errorHandler");
const HTTP_STATUS_CODES = require("../constants/httpStatusCodes");
const setCookie = require("../utils/setCookie");
const { googleAuthURL, githubAuthURL } = require("../config/config");
const {
  oauth2GoogleResponse,
  googleApi,
  githubResponse,
  githubApi,
} = require("../lib");

class AuthController {
  createUser(req, res) {
    const { name, email, password, avatar, role } = req.body;
    errorHandler(res, async () => {
      const existingUser = await userService.findUser({ email });
      if (existingUser) {
        throw new HttpError({
          message: "User already exists",
          statusCode: HTTP_STATUS_CODES.CONFLICT,
        });
      }

      const user = await userService.createUser({
        name,
        email,
        password,
        avatar,
        role,
      });
      if (!user) {
        throw new HttpError({
          message: "Failed to create user",
          statusCode: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        });
      }
      response({
        res,
        message: "User created successfully",
        statusCode: HTTP_STATUS_CODES.CREATED,
        user,
      });
    });
  }

  verifyAccount(req, res) {
    const { email } = req.body;
    errorHandler(res, async () => {
      const existingUser = await userService.findUser({ email });
      if (!existingUser) {
        throw new HttpError({
          message: "User not found",
          statusCode: HTTP_STATUS_CODES.NOT_FOUND,
        });
      }
      const user = await userService.generateVerificationToken({ email });
      if (!user) {
        throw new HttpError({
          message: "Failed to generate verification token",
          statusCode: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        });
      }
      response({
        res,
        message: "Verification email sent successfully",
      });
    });
  }

  verifyAccountToken(req, res) {
    const { token } = req.params;
    errorHandler(res, async () => {
      const user = await userService.verifyAccount({ token });
      if (!user) {
        throw new HttpError({
          message: "Invalid or expired token",
          statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
        });
      }
      response({
        res,
        message: "Account verified successfully",
      });
    });
  }

  loginUser(req, res) {
    const { email, password } = req.body;
    errorHandler(res, async () => {
      const user = await userService.logUser({ email, password });
      if (!user) {
        throw new HttpError({ message: "Invalid Credentials" });
      }
      const token = await setCookie(res, user?._id);
      response({ res, user, token });
    });
  }

  forgotPassword(req, res) {
    const { email } = req.body;
    errorHandler(res, async () => {
      const isExistsUser = await userService.forgotPassword({ email });
      if (!isExistsUser) {
        throw new HttpError({
          message: "User not found",
          statusCode: HTTP_STATUS_CODES.NOT_FOUND,
        });
      }
      response({
        res,
        message: "Password reset email sent successfully",
      });
    });
  }

  resetPassword(req, res) {
    const { token } = req.query;
    const { password } = req.body;
    errorHandler(res, async () => {
      const isResetPassword = await userService.resetPassword({
        token,
        password,
      });
      if (!isResetPassword) {
        throw new HttpError({
          message: "Invalid or expired token",
          statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
        });
      }
      response({
        res,
        message: "Password reset successfully",
      });
    });
  }

  loginGoogle(req, res) {
    errorHandler(res, async () => {
      res.redirect(googleAuthURL);
    });
  }

  loginGoogleCallback(req, res) {
    const { code } = req.query;
    errorHandler(res, async () => {
      const data = await oauth2GoogleResponse(code);
      const { access_token } = data;
      if (!access_token) {
        throw new HttpError({
          message: "Failed to get access token",
          statusCode: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        });
      }
      const googleUser = await googleApi(access_token);
      const { id, email, name, picture } = googleUser;
      const existingUser = await userService.findUser({ email });
      if (existingUser) {
        const token = await setCookie(res, existingUser?._id);
        return response({ res, token, user: existingUser });
      }

      const user = await userService.createGoogleUser({
        id,
        email,
        name,
        picture,
      });
      const token = await setCookie(res, user?._id);
      response({ res, token, user });
    });
  }

  loginGithub(req, res) {
    errorHandler(res, async () => {
      res.redirect(githubAuthURL);
    });
  }

  loginGithubCallback(req, res) {
    const { code } = req.query;
    errorHandler(res, async () => {
      const data = await githubResponse(code);
      const { access_token } = data;
      if (!access_token) {
        throw new HttpError({
          message: "Failed to get access token",
          statusCode: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        });
      }
      const { id, login, avatar_url, email } = await githubApi(access_token);
      const existingUser = await userService.findUser({ email });
      if (existingUser) {
        const token = await setCookie(res, existingUser?._id);
        return response({ res, token, user: existingUser });
      }

      const user = await userService.createGithubUser({
        id,
        name: login,
        email,
        avatar_url,
      });

      const token = await setCookie(res, user?._id);
      response({ res, user, token });
    });
  }
}

module.exports = new AuthController();
