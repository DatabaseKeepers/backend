import express from "express";
import { userController } from "../controllers/index.js";
import { isStaff } from "../middlewares/authorization.js";
import { isAuthenticated } from "../middlewares/firebase-auth.js";
import { uploadImageSchema } from "../middlewares/validators.js";

const router = express.Router();

router.get("/me", [isAuthenticated], userController.me);
router.get("/patients", [isAuthenticated, isStaff], userController.patients);
router.post(
  "/upload-image",
  [isAuthenticated, isStaff, uploadImageSchema],
  userController.uploadImage
);

export default router;
