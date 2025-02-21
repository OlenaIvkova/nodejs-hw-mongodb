import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Session from "../models/Session.js"; 
import { registerUser, generateTokens } from "../services/authServices.js";  


const { JWT_REFRESH_SECRET } = process.env;

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw createHttpError(400, "All fields are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createHttpError(409, "Email in use");
    }

    const newUser = await registerUser({ name, email, password });

    res.status(201).json({
      status: "success",
      message: "Successfully registered a user!",
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(401, "Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw createHttpError(401, "Invalid email or password");
    }

    // const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
    // const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });
    
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });
    
    // const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "15m" });
    // const refreshToken = jwt.sign({ userId: user._id }, JWT_REFRESH_SECRET, { expiresIn: "30d" });

    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    console.log('JWT_REFRESH_SECRET:', process.env.JWT_REFRESH_SECRET);

    // const { accessToken, refreshToken } = await generateTokens(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, 
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

export const refresh = async (req, res, next) => {
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

export const logout = async (req, res, next) => {
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