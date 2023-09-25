import express from "express";
import authController from "../controllers/index.js";
import { isAuthenticated } from "../middlewares/firebase-auth.js";

const router = express.Router();

router.post("/signup", authController.signup);
router.get("/token", isAuthenticated);

export default router;
