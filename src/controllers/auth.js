import createHttpError from "http-errors";
import { validateLogin } from "../middlewares/validateLogin.js";
import { validateRegister } from "../middlewares/validateRegister.js";
// import bcrypt from "bcrypt";
import User from "../models/user.js";
import { registerUser } from "../services/auth.js";
// import jwt from "jsonwebtoken";
import { loginUser } from "../services/auth.js";
import { refreshUserSession } from "../services/auth.js";
import { removeUserSession } from "../services/auth.js";


export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const { error } = validateRegister(req.body);
    if (error) {
      throw createHttpError(400, error.details[0].message);
    }

    // if (!name || !email || !password) {
    //   throw createHttpError(400, "All fields are required");
    // }

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
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { error } = validateLogin(req.body);
    if (error) {
      throw createHttpError(400, error.details[0].message);
    }

    // if (!email || !password) {
    //   throw createHttpError(400, "All fields are required");
    // }

    const { accessToken, refreshToken } = await loginUser(email, password);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
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

export const refreshSession = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw createHttpError(401, "Refresh token is missing");
    }

    const newAccessToken = await refreshUserSession(refreshToken);

    res.status(200).json({
      status: "success",
      message: "Successfully refreshed a session!",
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw createHttpError(401, "Refresh token is missing");
    }

    await removeUserSession(refreshToken);

    res.status(204).send(); // No Content
  } catch (error) {
    next(error);
  }
};