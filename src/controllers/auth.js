import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Session from "../models/session.js"; 
import generateTokens from "../services/auth.js"; 
// import authService from "../services/auth.js";

const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;

const authService = require("../services/auth.js");

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const newUser = await authService.registerUser({ name, email, password });
    
    res.status(201).json({ message: "User created", user: newUser });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(createHttpError(401, "Invalid email or password"));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(createHttpError(401, "Invalid email or password"));
    }

    const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "15m" });

    const refreshToken = jwt.sign({ userId: user._id }, JWT_REFRESH_SECRET, { expiresIn: "30d" });

    await Session.findOneAndDelete({ userId: user._id });

    const session = new Session({ userId: user._id, refreshToken });
    await session.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 днів
    });

    res.status(200).json({
      status: "success",
      message: "Successfully logged in an user!",
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

const refreshUser = async (req, res, next) => {
  try {
    
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw createHttpError(401, "No refresh token, please log in again");
    }

    jwt.verify(refreshToken, JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err) {
        throw createHttpError(401, "Invalid or expired refresh token");
      }

      const user = await User.findById(decoded.userId);
      if (!user) {
        throw createHttpError(401, "User not found");
      }

      const session = await Session.findOne({ userId: user._id });
      if (!session) {
        throw createHttpError(401, "Session not found");
      }

      await session.remove();

      const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user);

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60 * 1000, 
      });

      res.status(200).json({
        status: "success",
        message: "Successfully refreshed a session!",
        data: { accessToken },
      });
    });
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw createHttpError(400, "No refresh token provided");
    }

    jwt.verify(refreshToken, JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err) {
        throw createHttpError(401, "Invalid or expired refresh token");
      }

      const session = await Session.findOneAndDelete({ userId: decoded.userId });
      if (!session) {
        throw createHttpError(400, "Session not found");
      }

      res.clearCookie("refreshToken");

      res.status(204).send();
    });
  } catch (error) {
    next(error);
  }
};

export default { loginUser, registerUser, refreshUser, logoutUser };