import { config } from "../config/config.js";
import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { loginSchema, signupSchema } from "../validators/auth.validate.js";
import httpStatus from "http-status";
import crypto from "crypto";
import sessionModel from "../models/session.model.js";
import nodemailer from "nodemailer";

const sendWelcomeEmail = async (receiverEmail, receiverName) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const message = {
    from: process.env.EMAIL,
    to: receiverEmail,
    subject: "Welcome Email!",
    text: `Welcome to HaloMeet, hope you doing well ${receiverName}.`,
  };

  const info = await transporter.sendMail(message);
  console.log(info);
};

export async function signup(req, res) {
  const result = signupSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      errors: result.error.issues,
    });
  }

  try {
    const { username, email, password } = result.data;
    const isRegister = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isRegister) {
      return res.status(409).json({
        message: "Username or email already exists",
      });
    }

    const hashPassword = bcrypt.hashSync(password, 10);
    const user = await userModel.create({
      username,
      email,
      password: hashPassword,
    });

    const refreshToken = jwt.sign({ id: user._id }, config.JWT_SECRET, {
      expiresIn: "7d",
    });

    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const session = await sessionModel.create({
      user: user._id,
      refreshTokenHash: refreshTokenHash,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
    const accessToken = jwt.sign(
      { id: user._id, sessionId: session._id },
      config.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    try {
      await sendWelcomeEmail(email, username);
    } catch (error) {
      console.log(`Email send error: ${error}`);
    }

    return res.status(201).json({
      message: "User register successfully",
      user: {
        username: user.username,
        email: user.email,
      },
      accessToken,
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
}

export async function login(req, res) {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      errors: result.error.issues,
    });
  }

  const { email, password } = result.data;
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      message: "Invalid email or password",
    });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      message: "Password is incorrect",
    });
  }

  const refreshToken = jwt.sign(
    {
      id: user._id,
    },
    config.JWT_SECRET,
    { expiresIn: "7d" },
  );

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = sessionModel.create({
    user: user._id,
    refreshTokenHash: refreshTokenHash,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  const accessToken = jwt.sign(
    {
      id: user._id,
      sessionId: session._id,
    },
    config.JWT_SECRET,
    { expiresIn: "15m" },
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  try {
    await sendWelcomeEmail(email, user.username);
  } catch (error) {
    console.log(`Email send error: ${error}`);
  }

  res.status(httpStatus.OK).json({
    message: "User login successfully",
    user: {
      username: user.username,
      email: user.email,
    },
    accessToken,
  });
}

export async function getMe(req, res) {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: "User not found",
      });
    }
    res.status(httpStatus.OK).json({
      message: "User fetched successfully",
      user: {
        user: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Sever error",
      error,
    });
  }
}

export async function refreshToken(req, res) {
  const refreshToken = req.refreshToken;
  const decoded = req.user;

  const user = await userModel.findOne(decoded.id);
  if (!user) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      message: "User not found",
    });
  }
  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");
  const session = await sessionModel.findOne({
    refreshTokenHash,
    revoke: false,
  });

  if (!session) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      message: "Invalid refresh token",
    });
  }

  const accessToken = jwt.sign(
    { id: decoded.id, sessionId: session._id },
    config.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );

  const newRefreshToken = jwt.sign({ id: decoded.id }, config.JWT_SECRET, {
    expiresIn: "7d",
  });

  const newRefreshTokenHash = crypto
    .createHash("sha256")
    .update(newRefreshToken)
    .digest("hex");
  res.cookie("refreshToken", newRefreshTokenHash, {
    httpOnly: true,
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "strict",
  });

  res.status(200).json({
    message: "Access token refreshed successfully",
    accessToken,
  });
}

export async function logout(req, res) {
  const refreshToken = req.refreshToken;
  if (!refreshToken) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      message: "Refresh token not found",
    });
  }
  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");
  const session = await sessionModel.findOne({
    refreshTokenHash,
    revoke: false,
  });
  if (!session) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      message: "Invalid refresh token",
    });
  }
  session.revoke = true;
  await session.save();

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });

  res.status(httpStatus.OK).json({
    message: "Logged out successfully",
  });
}

export async function logoutAll(req, res) {
  const refreshToken = req.refreshToken;
  const decoded = req.user;

  await sessionModel.updateMany(
    {
      user: decoded.id,
      revoke: false,
    },
    { revoke: true },
  );

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });

  res.status(httpStatus.OK).json({
    message: "Successfully logged out from all devices",
  });
}
