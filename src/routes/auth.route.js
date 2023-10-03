import express from "express";
import { authController } from "../controllers/index.js";
import { isAuthenticated } from "../middlewares/firebase-auth.js";
import { loginSchema, signupSchema } from "../middlewares/validators.js";

const router = express.Router();

router.post("/login", [loginSchema], authController.login);
router.post("/signup", [signupSchema], authController.signup);
router.get("/token", [isAuthenticated], authController.token);

export default router;
