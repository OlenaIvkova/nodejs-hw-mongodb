import express from "express";
import { register, login, refresh, logout } from "../controllers/authControllers.js";
import { validateRegister } from "../middlewares/validateRegister.js";
import { validateLogin } from "../middlewares/validateLogin.js";

const router = express.Router();

router.post("/register", validateRegister, register);

router.post("/login", validateLogin, login);

router.post("/refresh", refresh);

router.post("/logout", logout);

export default router;