import { Router } from "express";
import {
  signup,
  login,
  refreshToken,
  getMe,
  logout,
  logoutAll,
  sendOtp,
  verifyOtp,
  resetPassword,
  exchange,
} from "../controllers/auth.controller.js";
import { authorization } from "../middlewares/auth.middleware.js";
import { verifyRefreshTokenMiddleware } from "../middlewares/verifyRefreshTokenMiddleware.js";
import userModel from "../models/user.model.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sessionModel from "../models/session.model.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/verify", verifyRefreshTokenMiddleware, async (req, res) => {
  const user = await userModel.findById(req.user.id).select("username");
  if (!user) {
    return res.status(401).json({ message: "User not found or token invalid" });
  }
  res.status(200).json({
    user: {
      id: user._id,
      username: user.username,
    },
  });
});
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      const refreshToken = jwt.sign(
        { id: req.user._id, email: req.user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
      );

      const refreshTokenHash = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");

      await sessionModel.create({
        user: req.user._id,
        refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });

      const exchangeCode = crypto.randomBytes(32).toString("hex");

      await exchangeCodeModel.create({
        code: exchangeCode,
        refreshToken, 
        expiresAt: new Date(Date.now() + 2 * 60 * 1000), // 2 min expiry
      });

      const clientUrl = process.env.CLIENT_URL;
      return res.redirect(`${clientUrl}/auth-success?code=${exchangeCode}`);
    } catch (error) {
      console.error("Google login error", error);
      const clientUrl = process.env.CLIENT_URL;
      return res.redirect(`${clientUrl}/signIn?error=google_failed`);
    }
  },
);
router.get("/logout", verifyRefreshTokenMiddleware, logout);
router.get("/logoutAll", verifyRefreshTokenMiddleware, logoutAll);
router.get("/get-me", authorization, getMe);
router.get("/refreshToken", verifyRefreshTokenMiddleware, refreshToken);
router.post("/sendOtp", sendOtp);
router.post("/verifyOtp", verifyOtp);
router.post("/resetPassword", resetPassword);
router.post("/exchange", exchange);

export default router;
