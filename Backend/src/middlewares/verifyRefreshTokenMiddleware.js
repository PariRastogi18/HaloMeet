import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export async function verifyRefreshTokenMiddleware(req, res, next) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      message: "Refresh token not found",
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, config.JWT_SECRET);
    req.refreshToken = refreshToken;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      message: "Invalid or expire refresh token",
    });
  }
}
