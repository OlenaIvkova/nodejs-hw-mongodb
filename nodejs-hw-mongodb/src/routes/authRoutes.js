import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import User from "../models/user.js";
import { register } from "../controllers/authControllers.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw createHttpError(401, "Invalid credentials");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    next(error);
  }
});

export default router;