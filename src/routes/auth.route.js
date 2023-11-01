import express from "express";
import { authController } from "../controllers/index.js";
import { isStaff } from "../middlewares/authorization.js";
import errors from "../middlewares/errors.js";
import { isAuthenticated } from "../middlewares/firebase-auth.js";
import {
  //addPatientSchema,
  loginSchema,
  signupSchema,
} from "../middlewares/validators.js";

const router = express.Router();

router.post(
  "/add-patient",
  [isAuthenticated, isStaff],
  authController.addPatient
);
router.post("/login", [loginSchema], authController.login);
router.post("/signup", [signupSchema, errors], authController.signup);
router.get("/token", [isAuthenticated], authController.token);

export default router;
