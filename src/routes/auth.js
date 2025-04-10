import express from "express";
import { register, login, refreshSession, logoutUser, deleteUser } from "../controllers/auth.js";
import authenticate from "../middlewares/authenticate.js";
const validateBody = require("../../middlewares/validateBody");
const { registerSchema, loginSchema } = require("../../schemas/usersSchemas");

const router = express.Router();

// router.get("/users", authenticate, getAllUsers);
router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);
router.post("/refresh", refreshSession);
// router.patch("/users/update", authenticate, updateUser);
router.post("/logout", logoutUser);
router.delete("/delete", authenticate, deleteUser);

export default router;