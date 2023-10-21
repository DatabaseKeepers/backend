import express from "express";
import { userController } from "../controllers/index.js";
import { isAuthorized, isStaff } from "../middlewares/authorization.js";
import { isAuthenticated } from "../middlewares/firebase-auth.js";
import { uploadImageSchema } from "../middlewares/validators.js";

const router = express.Router();

router.get("/:uid/images", [isAuthenticated, isAuthorized], userController.images)
router.get("/me", [isAuthenticated], userController.me);
router.get("/patients", [isAuthenticated, isStaff], userController.patients);
router.post(
  "/upload-image",
  [isAuthenticated, isStaff, uploadImageSchema],
  userController.uploadImage
);
router.get("/profile", [isAuthenticated], userController.profile);

export default router;
