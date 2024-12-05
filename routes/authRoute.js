const authController = require("../controllers/authController");
const { verify, protected } = require("../services/jwt/jwtServices");
const router = require("express").Router();

// module.exports = () => {
router.post("/register", authController.createUser);
router.put("/verify", verify, authController.verifyUser);
router.put(
  "/refresh-verification-token/:token",
  authController.RefreshVerificationToken
);
router.get("/login", authController.LoginUser);
router.put("/refresh-token", authController.RefreshToken);
router.put(
  "/reset-password",
  verify,
  protected,
  authController.ResetPasswordToken
);

// }

module.exports = router;
