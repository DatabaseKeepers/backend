import express from "express";
import { userController } from "../controllers/index.js";
import { isAuthenticated } from "../middlewares/firebase-auth.js";
import { isStaff } from "../middlewares/authorization.js";

const router = express.Router();

router.get("/me", [isAuthenticated], userController.me);
router.get("/patients", [isAuthenticated, isStaff], userController.patients);

export default router;
