import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { validateLogin } from "../middlewares/validateLogin.js";
import { validateRegister } from "../middlewares/validateRegister.js";

import User from "../models/user.js";
import { registerUser } from "../services/auth.js";

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

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createHttpError(409, "Email in use");
    }

    const newUser = await registerUser({ name, email, password });

    res.status(201).json({
      status: 201,
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
    // const user = await User.findOne({ email });

    const { error } = validateLogin(req.body);
    if (error) {
      throw createHttpError(400, error.details[0].message);
    }

     const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(400, "Invalid email or password");
    }

    const { accessToken, refreshToken } = await loginUser(email, password);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, 
    });

    res.status(200).json({
      status: 200,
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
      status: 200,
      message: "Successfully refreshed a session!",
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { _id } = req.user; 
    const { name, email, password } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(_id, updateData, { new: true });

    if (!updatedUser) {
      throw createHttpError(404, "User not found");
    }

    res.status(200).json({
      status: 200,
      message: "User updated successfully",
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, "-password"); 

    res.status(200).json({
      status: 200,
      message: "Successfully fetched users!",
      data: users,
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

    res.status(204).send(); 
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { _id } = req.user; 

    const deletedUser = await User.findByIdAndDelete(_id);
    if (!deletedUser) {
      throw createHttpError(404, "User not found");
    }

    res.status(200).json({
      status: 200,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};