import express from "express";
import { notificationController } from "../controllers/index.js";
import { isAuthorized } from "../middlewares/authorization.js";
import { isAuthenticated } from "../middlewares/firebase-auth.js";

const router = express.Router();

router.get(
  "/polling",
  [isAuthenticated, isAuthorized],
  notificationController.polling
);

export default router;
