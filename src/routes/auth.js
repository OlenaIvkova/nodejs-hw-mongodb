import express from "express";
import { register } from "../controllers/auth.js";
import { login } from "../controllers/auth.js";
import { refreshSession } from "../controllers/auth.js";
import { logoutUser } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshSession);
router.post("/logout", logoutUser);

export default router;