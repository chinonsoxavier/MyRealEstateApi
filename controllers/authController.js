const authServices = require("../services/authServices");
const sendMail = require("../services/emails/emailService");
const userServices = require("../services/userServices");
const CryptoJS = require("crypto-js");
const ejs = require("ejs");
const path = require("path");
const {
  decodedToken,
  GenerateRefreshToken,
  GenerateToken,
  GetRefreshToken,
  DeleteRefreshToken,
} = require("../services/jwt/jwtServices");
const chalk = require("chalk");


// Register
exports.createUser = async (req, res) => {
  try {
    const existingUser = await userServices.getUserByEmail(req.body.email);
    console.log(existingUser);
    const userPayload = {
      email: req.body.email,
      userName: req.body.userName,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.CRYPTO_JS_SECRET_KEY
      ).toString(),
    };
    if (existingUser == null || existingUser.$isEmpty()) {
      const newUser = await authServices.createUser(userPayload);
      const user = {
        email: newUser.email,
        userName: newUser.userName,
      };
      console.log(newUser);
      const activationToken = await GenerateToken(user, "access");
      const activationUrl = `http://localhost:8080/auth/verify/${activationToken}`;
      const data = { email: user.email, activationUrl: activationUrl };
      const htmlContent = await ejs.renderFile(
        path.join("services", "emails", "verifyEmail.ejs"),
        data
      );
      await sendMail({
        from: `Evara ${process.env.SMPT_USER}`,
        to: req.body.email,
        subject: "Activate your Evara account",
        html: htmlContent,
      });
      return res.status(200).json({
        Message: `Account created Successfully! Please check your email ${newUser.email} to verify your account`,
      });
    } else {
      return res.status(400).json("user with this email already exists");
    }
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};


// verify user email
exports.verifyUser = async (req, res) => {
  const user = req.user;
  try {
    authServices.verifyUser(user);
    res.status(200).json("you account has been successfully verified");
  } catch (err) {
    console.error("user verification failed");
    console.error(err);
  }
};


// refresh verification token
exports.RefreshVerificationToken = async (req, res) => {
  const token = req.params.token;
  const user = decodedToken(token);
  try {
    const newVerificationToken = await GenerateToken(user, "access");
    const activationUrl = `http://localhost:8080/auth/verify/${newVerificationToken}`;
   const data = { email: user.email, activationUrl: activationUrl };
   const htmlContent = await ejs.renderFile(
     path.join("services", "emails", "verifyEmail.ejs"),
     data
   );
   await sendMail({
     from: `Evara ${process.env.SMPT_USER}`,
     to: req.body.email,
     subject: "Activate your Evara account",
     html: htmlContent,
   });
    res
      .status(200)
      .json("A new verification token has been sent to your email!");
  } catch (error) {
    console.log(chalk.red(err));
    res.status(400).json(error);
  }
};


// login user
exports.LoginUser = async (req, res) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  const existingUser = await userServices.getUserByEmail(userEmail);
  const bytes = CryptoJS.AES.decrypt(
    existingUser.password,
    process.env.CRYPTO_JS_SECRET_KEY
  );
  const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
  try {
    if (existingUser == null || existingUser.$isEmpty()) {
      return res.status(404).json("User not found");
    } else if (originalPassword !== userPassword) {
      return res.status(404).json("Password incorrect");
    }

    await DeleteRefreshToken({ userId: existingUser._id });
    const accessToken = await GenerateToken(existingUser, "access");
    const refreshToken = await GenerateToken(existingUser, "refresh");
    await GenerateRefreshToken(existingUser._id, refreshToken);
    const { password, ...info } = existingUser._doc;
    res.status(200).json({ ...info, accessToken, refreshToken });
  } catch (error) {
    console.log(chalk.red(error));
    console.error(chalk.red("Failed to login user"));
    res.status(400).json({ Error: error });
  }
};


// refresh access token
exports.RefreshToken = async (req, res) => {
  try {
    const refreshToken = req.headers?.token?.split(" ")[1];
    const getUserRefreshToken = await GetRefreshToken({ token: refreshToken });
    const existingUser = await userServices?.getUserById(
      getUserRefreshToken.userId
    );
    if (!refreshToken) {
      return res.status(403).json("You are not authenticated");
    } else if (getUserRefreshToken == null || getUserRefreshToken.$isEmpty()) {
      return res.status(403).json("token is invalid");
    }
    const newRefreshToken = await GenerateToken(existingUser, "refresh");
    const newAccessToken = await GenerateToken(existingUser, "access");
    await DeleteRefreshToken({ token: refreshToken });
    await GenerateRefreshToken(existingUser._id, newRefreshToken);
    res.status(200).json({ newAccessToken, newRefreshToken });
  } catch (error) {
    console.log(chalk.red(error));
    console.log(chalk.red("failed to refresh token"));
  }
};


// reset-password
exports.ResetPasswordToken = async (req, res) => {
   const token = req.params.token;
   const user = decodedToken(token);
  try {
    const resetPasswordToken = await GenerateToken(user, "access");
    const activationUrl = `http://localhost:8080/auth/reset-password/${resetPasswordToken}`;
    const data = { email: user.email, activationUrl: activationUrl };
    const htmlContent = await ejs.renderFile(
      path.join("services", "emails", "resetPasswordEmail.ejs"),
      data
    );
    await sendMail({
      from: `Evara ${process.env.SMPT_USER}`,
      to: req.body.email,
      subject: "Reset your Evara password",
      html: htmlContent,
    });
    res
      .status(200)
      .json("A reset token has been sent to your email!");
  } catch (error) {
    console.log(chalk.red(err));
    res.status(400).json(error);
  }
}