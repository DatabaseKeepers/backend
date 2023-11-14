import express from "express";
import { notificationController } from "../controllers/index.js";
import { isAuthorized } from "../middlewares/authorization.js";
import { isAuthenticated } from "../middlewares/firebase-auth.js";
import { readNotificationSchema } from "../middlewares/validators.js";
import errors from "../middlewares/errors.js";

const router = express.Router();

router.get(
  "/polling",
  [isAuthenticated, isAuthorized],
  notificationController.polling
);

router.put(
  "/read",
  [isAuthenticated, isAuthorized, readNotificationSchema, errors],
  notificationController.read
);

export default router;
