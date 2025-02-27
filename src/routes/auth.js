import express from "express";
import { register, login, refreshSession, logoutUser, updateUser, getAllUsers, deleteUser } from "../controllers/auth.js";
import authenticate from "../middlewares/authenticate.js";
// import { register } from "../controllers/auth.js";
// import { login } from "../controllers/auth.js";
// import { refreshSession } from "../controllers/auth.js";
// import { logoutUser } from "../controllers/auth.js";
// import { updateUser } from "../controllers/auth.js";
// import { getAllUsers } from "../controllers/auth.js";


const router = express.Router();

router.get("/users", authenticate, getAllUsers);
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshSession);
router.patch("/users/update", authenticate, updateUser);
router.post("/logout", logoutUser);
router.delete("/delete", authenticate, deleteUser);

export default router;