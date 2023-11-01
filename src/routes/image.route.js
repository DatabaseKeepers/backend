import express from "express";
import { imageController } from "../controllers/index.js";
import { isStaff } from "../middlewares/authorization.js";

import errors from "../middlewares/errors.js";
import { isAuthenticated } from "../middlewares/firebase-auth.js";

const router = express.Router();

router.put("/:image_uid", [isAuthenticated, isStaff], imageController.updateImageNote);

export default router;
