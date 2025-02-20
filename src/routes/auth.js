import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Session from "../models/session.js";
import { validateRegister } from '../middlewares/validateRegister.js'; 
import { validateLogin } from '../middlewares/validateLogin.js'; 
// import registerUsers from "../controllers/auth.js";
// import loginUser from "../controllers/auth.js";
import authController from "../controllers/auth.js";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";


router.post("/register",  validateRegister, authController.registerUser, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Всі поля обов’язкові" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Користувач з таким email вже існує" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: "Користувач створений успішно", userId: newUser._id });
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера", error });
  }
});


router.post("/login", validateLogin, authController.loginUser, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Невірний email або пароль" });
    }

    const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ userId: user._id }, JWT_REFRESH_SECRET, { expiresIn: "7d" });

    await Session.create({
      userId: user._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
      refreshTokenValidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера", error });
  }
});


router.post("/refresh", authController.refreshUser, async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: "Необхідний рефреш-токен" });
    }

    const session = await Session.findOne({ refreshToken });
    if (!session) {
      return res.status(403).json({ message: "Недійсний токен" });
    }

    jwt.verify(refreshToken, JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Недійсний токен" });

      const newAccessToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, { expiresIn: "15m" });
      const newRefreshToken = jwt.sign({ userId: decoded.userId }, JWT_REFRESH_SECRET, { expiresIn: "7d" });

      session.accessToken = newAccessToken;
      session.refreshToken = newRefreshToken;
      session.accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
      await session.save();

      res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    });
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера", error });
  }
});


router.post("/logout", authController.logoutUser, async (req, res) => {
  try {
    const { refreshToken } = req.body;
    await Session.deleteOne({ refreshToken });

    res.status(200).json({ message: "Вихід успішний" });
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера", error });
  }
});

export default router;