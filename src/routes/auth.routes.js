const { Router } = require("express");
const {
  validator,
  createUserSchema,
  loginUserSchema,
  emailSchema,
  passwordSchema,
} = require("../validator");
const authMiddleware = require("../middlewares/auth.middleware");
// const alreadyLoggedIn = require("../middlewares/alreadyLoggedIn.middleware");

const {
  createUser,
  verifyAccount,
  verifyAccountToken,
  loginUser,
  forgotPassword,
  resetPassword,
  loginGoogle,
  loginGoogleCallback,
  loginGithub,
  loginGithubCallback,
  logout,
} = require("../controllers/auth.controller");

const router = Router();

router.post("/register", validator(createUserSchema, "body"), createUser);
router.post("/verify-account", validator(emailSchema, "body"), verifyAccount);
router.get("/verify-account/:token", verifyAccountToken);
router.post("/login", validator(loginUserSchema, "body"), loginUser);
router.post("/forgot-password", validator(emailSchema, "body"), forgotPassword);
router.post(
  "/reset-password",
  validator(passwordSchema, "body"),
  resetPassword
);
router.get("/google", loginGoogle);
router.get("/google/callback", loginGoogleCallback);
router.get("/github", loginGithub);
router.get("/github/callback", loginGithubCallback);

module.exports = router;
