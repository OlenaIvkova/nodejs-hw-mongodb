import express from "express";
import { register } from "../controllers/auth.js";
import { login } from "../controllers/auth.js";
import { refreshSession } from "../controllers/auth.js";
import { logoutUser } from "../controllers/auth.js";
import { updateUser } from "../controllers/auth.js";
import authenticate from "../middlewares/authenticate.js";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshSession);
router.patch("/users/update", authenticate, updateUser);
router.post("/logout", logoutUser);

export default router;