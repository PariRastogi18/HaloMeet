import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export async function authorization(req, res, next) {
  const token = await req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      message: "Token is not found",
    });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      message: "Invalid or expire token",
    });
  }
}
