import express from "express";
import { register, login, refreshSession, logoutUser, deleteUser } from "../controllers/auth.js";
import authenticate from "../middlewares/authenticate.js";
import validateBody from "../middlewares/validateBody.js";
import validationSchemas from "../schemas/contactValidation.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import { sendResetEmailController, resetPassword } from "../controllers/auth.js";

const { registerSchema, loginSchema } = validationSchemas; 

const router = express.Router();

// router.get("/users", authenticate, getAllUsers);
router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);
router.post("/refresh", refreshSession);
// router.patch("/users/update", authenticate, updateUser);
router.post("/logout", logoutUser);
router.delete("/delete", authenticate, deleteUser);
router.post("/send-reset-email", ctrlWrapper(sendResetEmailController));
router.post("/reset-password", ctrlWrapper(resetPassword));

export default router;