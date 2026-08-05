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
} from "../controllers/auth.controller.js";
import { authorization } from "../middlewares/auth.middleware.js";
import { verifyRefreshTokenMiddleware } from "../middlewares/verifyRefreshTokenMiddleware.js";
import userModel from "../models/user.model.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/verify", verifyRefreshTokenMiddleware, async (req, res) => {
  const user = await userModel.findById(req.user.id).select("username");
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
  (req, res) => {
    try {
      const token = jwt.sign(
        { id: req.user._id, email: req.user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
      );

      res.redirect(`${process.env.CLIENT_URL}/auth-success?token=${token}`);
    } catch (error) {
      console.error("Google login error", error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=google_failed`);
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

export default router;
