const { Router } = require("express");
const {
  validator,
  profileSchema,
  updatePasswordSchema,
} = require("../validator");

const {
  getProfile,
  updateProfile,
  updatePassword,
  logout,
} = require("../controllers/user.controller");

const router = Router();

router.get("/profile", getProfile);
router.put("/profile", validator(profileSchema, "body"), updateProfile);
router.put(
  "/profile/password",
  validator(updatePasswordSchema, "body"),
  updatePassword
);
router.get("/logout", logout);

module.exports = router;
