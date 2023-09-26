import express from "express";
import { userController } from "../controllers/index.js";
import { isAuthenticated } from "../middlewares/firebase-auth.js";

const router = express.Router();

router.get("/me", [isAuthenticated], userController.me);

export default router;
