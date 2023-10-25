import express from "express";
import { userController } from "../controllers/index.js";
import { isAuthorized, isStaff } from "../middlewares/authorization.js";
import { isAuthenticated } from "../middlewares/firebase-auth.js";
import { uploadImageSchema, uploadProfileSchema } from "../middlewares/validators.js";
import errors from "../utils/errors.js";

const router = express.Router();

router.get("/:uid/images", [isAuthenticated, isAuthorized], userController.images)
router.get("/me", [isAuthenticated], userController.me);
router.get("/patients", [isAuthenticated, isStaff], userController.patients);
router.get("/profile", [isAuthenticated], userController.profile);
router.put("/profile", [isAuthenticated, uploadProfileSchema, errors], userController.updateProfile);
router.get("/radiologists", [isAuthenticated], userController.radiologists);
router.post(
  "/upload-image",
  [isAuthenticated, isStaff, uploadImageSchema],
  userController.uploadImage
);

export default router;
