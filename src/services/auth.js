import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import User from "../models/user.js";
import Session from "../models/session.js";


export const registerUser = async ({ name, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();
  return user;
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  console.log("JWT_SECRET:", process.env.JWT_SECRET);
  if (!user) {
    throw createHttpError(401, "Invalid email or password");
  }
  
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
if (!isPasswordValid) {
    throw createHttpError(401, "Invalid email or password");
  }

  const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });

  await Session.deleteOne({ userId: user._id });

  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken };
};

export const refreshUserSession = async (refreshToken) => {
  const session = await Session.findOne({ refreshToken });

  if (!session) {
    throw createHttpError(403, "Invalid refresh token");
  }

  const { userId, refreshTokenValidUntil } = session;

  if (new Date() > refreshTokenValidUntil) {
    await Session.deleteOne({ _id: session._id });
    throw createHttpError(401, "Refresh token expired");
  }

  const newAccessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  await Session.findByIdAndUpdate(session._id, {
    accessToken: newAccessToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
  });

  return newAccessToken;
};

export const removeUserSession = async (refreshToken) => {
  const session = await Session.findOneAndDelete({ refreshToken });

  if (!session) {
    throw createHttpError(403, "Invalid refresh token");
  }
};