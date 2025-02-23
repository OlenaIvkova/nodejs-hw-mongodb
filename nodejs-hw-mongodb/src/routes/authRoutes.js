import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import User from "../models/user.js";

const router = express.Router();

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


// import express from "express";
// import { register, login, refresh, logout } from "../controllers/authControllers.js";
// import { validateRegister } from "../middlewares/validateRegister.js";
// import { validateLogin } from "../middlewares/validateLogin.js";

// const router = express.Router();

// router.post("/register", validateRegister, register);

// router.post("/login", validateLogin, login);

// router.post("/refresh", refresh);

// router.post("/logout", logout);

// export default router;