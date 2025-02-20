import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Session from "../models/session.js"; 

const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = process.env;

const registerUser = async ({ name, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    password: hashedPassword,
  });

  await user.save();

  return user;
};

const generateTokens = async (user) => {
  const payload = { userId: user._id };

  const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: "15m", 
  });

  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: "30d", 
  });

  await Session.findOneAndUpdate(
    { userId: user._id },
    { refreshToken },
    { upsert: true }
  );

  return { accessToken, refreshToken };
};

export default { registerUser, generateTokens };