import { config } from "../config/config.js";
import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { loginSchema, signupSchema } from "../validators/auth.validate.js";
import httpStatus from "http-status";
import crypto from "crypto";
import sessionModel from "../models/session.model.js";
import nodemailer from "nodemailer";
import exchangeCodeModel from "../models/exchangeCode.model.js";

// Cookie options helper - development में secure: false, production में true
const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  sameSite: "none",
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
  connectionTimeout: 10000,
});

const sendWelcomeEmail = async (receiverEmail, receiverName) => {
  const message = {
    from: process.env.EMAIL,
    to: receiverEmail,
    subject: "Welcome Email!",
    text: `Welcome to HaloMeet, hope you doing well ${receiverName}.`,
  };

  const info = await transporter.sendMail(message);
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

    res.cookie("refreshToken", refreshToken, getCookieOptions());

    try {
      sendWelcomeEmail(email, username);
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

  const session = await sessionModel.create({
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

  res.cookie("refreshToken", refreshToken, getCookieOptions());

  try {
    sendWelcomeEmail(email, user.username);
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

export async function exchange(req, res) {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: "Code required" });

    const record = await exchangeCodeModel.findOne({ code });
    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ error: "Invalid or expired code" });
    }

    // Ek baar use hone ke baad turant delete kar dein (replay attack se bachne ke liye)
    await exchangeCodeModel.deleteOne({ code });

    // ✅ Ab cookie yaha set hogi — ye request /api/exchange se aayi hai,
    // jo Vercel rewrite proxy se hoke aayi (same-origin treat hogi)
    res.cookie("refreshToken", record.refreshToken, getCookieOptions());

    res.json({ success: true });
  } catch (error) {
    console.error("Exchange error", error);
    res.status(500).json({ error: "Something went wrong" });
  }
}

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export async function sendOtp(req, res) {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: "User is not authorized",
      });
    }

    const otp = generateOtp();
    user.resetOtp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    const message = {
      from: process.env.EMAIL,
      to: email,
      subject: "OTP for reset password",
      text: `Your OTP for reset password is ${otp}.`,
    };

    await transporter.sendMail(message);

    res.status(httpStatus.OK).json({
      message: "OTP send successfully",
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
}

export async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: "User is not authorized",
      });
    }

    if (!user || user.resetOtp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }
    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
        message: "OTP Expired",
      });
    }

    user.resetOtp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({
      message: "OTP verified successfully",
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
}

export async function resetPassword(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: "User is not authorized",
      });
    }
    const hashPassword = bcrypt.hashSync(password, 10);
    user.password = hashPassword;
    await user.save();
    res.status(200).json({
      message: "change password successfully",
    });
  } catch (error) {
    console.log(error);
  }
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
  res.cookie("refreshToken", newRefreshTokenHash, getCookieOptions());

  res.status(200).json({
    message: "Access token refreshed successfully",
    accessToken,
  });
}

export async function logout(req, res) {
  const refreshToken = req.refreshToken;

  if (refreshToken) {
    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const session = await sessionModel.findOne({
      refreshTokenHash,
      revoke: false,
    });

    if (session) {
      session.revoke = true;
      await session.save();
    }
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  return res.status(httpStatus.OK).json({
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
    secure: true,
    sameSite: "none",
  });

  res.status(httpStatus.OK).json({
    message: "Successfully logged out from all devices",
  });
}
